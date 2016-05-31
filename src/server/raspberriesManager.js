import Logger from 'nightingale';
import * as data from './raspberriesData';
import { updateFromAction } from '../common/raspberryActionManager';
import { raspberriesBroadcast, emitToRaspberryClient, broadcastToRaspberryClients } from './websocket';
import type { RaspberryConfig, RaspberryData, Raspberry } from './types';

const logger = new Logger('app.raspberriesManager');
const map = new Map();
const mapByMac = new Map();

data.items.forEach((item: ?RaspberryData) => {
    const raspberry = {
        id: item.id,
        data: item,
        registered: true,
        online: false,
        ip: null,
    };

    map.set(item.id, raspberry);
    item.macAddresses.forEach(mac => {
        if (mapByMac.has(mac)) {
            throw new Error(`Mac defined more than one: ${mac}`);
        }

        mapByMac.set(mac, raspberry);
    });
});

export function getById(id: string): ?Raspberry {
    return map.get(id);
}

export function getByMac(mac: string): ?Raspberry {
    return mapByMac.get(mac);
}

export function getAll(): Array<Raspberry> {
    return Array.from(map.values());
}

export function screenshotPath(id: string): string {
    return data.screenshotPath(id);
}

/* FROM raspberry clients */

export function setOnline(mac, configTime, info) {
    let raspberry = getByMac(mac);
    let unknownMac = false;
    if (!raspberry) {
        unknownMac = true;
        logger.warn('unknown mac, adding', { mac });
        raspberry = { id: mac };
        map.set(raspberry.id, raspberry);
        mapByMac.set(mac, raspberry);
    } else {
        logger.info('raspberry online', { mac });
        if (raspberry.updating) {
            raspberry.updating = false;
        }
    }

    raspberry.online = mac;
    Object.assign(raspberry, info);

    raspberriesBroadcast(`raspberry:${unknownMac ? 'add' : 'update'}`, raspberry);

    if (raspberry.data && raspberry.data.config.time !== configTime) {
        emitToRaspberryClient(raspberry.online, 'changeConfig', raspberry.data.config);
    }
}

export function update(mac: string, info) {
    let raspberry = getByMac(mac);
    if (!raspberry) {
        // should not happen...
        return;
    }

    if (info.screenState && raspberry.nextExpectedScreenState === info.screenState) {
        raspberry.nextExpectedScreenState = null;
    }

    Object.assign(raspberry, info);
    raspberriesBroadcast('raspberry:update', raspberry);
}

export function setOffline(mac: string) {
    const raspberry = getByMac(mac);
    if (!raspberry) {
        // should not happen...
        return;
    }

    if (!raspberry.data) {
        map.delete(mac);
        mapByMac.delete(mac);
        raspberriesBroadcast('raspberry:delete', raspberry.id);
    } else {
        Object.assign(raspberry, {
            online: false,
            // keep last known ip
        });

        raspberriesBroadcast('raspberry:update', raspberry);
    }
}

export function changeScreenshot(mac: string, screenshot: Buffer) {
    const raspberry = getByMac(mac);
    if (!raspberry) {
        logger.warn('changeScreenshot, no raspberry', { mac });
        // should not happen...
        return;
    }

    data.saveScreenshot(raspberry.id, screenshot);
    raspberriesBroadcast('raspberry:screenshot-updated', raspberry.id, Date.now());
}

/* FROM browser clients */

const TIME_OUTDATED = 30000;
let intervalUpdateData;
let lastUpdated = Date.now() - TIME_OUTDATED;

export function raspberriesClientsConnected() {
    const now = Date.now();
    if (lastUpdated > now - TIME_OUTDATED) {
        logger.debug('not outdated');
        return;
    }
    lastUpdated = now;

    logger.info('update data');
    broadcastToRaspberryClients('screenshot');

    intervalUpdateData = setInterval(() => {
        logger.info('update data');
        broadcastToRaspberryClients('screenshot');
    }, TIME_OUTDATED);
}

export function raspberriesClientsDisonnected() {
    if (intervalUpdateData) {
        clearInterval(intervalUpdateData);
    }
}

export function changeConfig(id: string, config: RaspberryConfig) {
    logger.log('changeConfig', { id, config });
    const raspberry = getById(id);
    if (!raspberry || !raspberry.registered) {
        logger.warn('unknown raspberry', { id });
        // should not happen...
        return;
    }

    const newConfig = data.changeConfig(id, config);
    emitToRaspberryClient(raspberry.online, 'changeConfig', newConfig);
    return newConfig;
}

export function add(mac: string, { name, addOrReplace, id }) {
    logger.log('add', { mac, name, addOrReplace, id });
    const raspberry = getByMac(mac);
    if (!raspberry) {
        return logger.warn('unknown raspberry', { mac });
    } else if (raspberry.registered) {
        return logger.warn('raspberry already registered', { mac });
    }

    if (addOrReplace) {
        mapByMac.delete(mac);
        map.delete(mac);
        const existing = map.get(id);
        if (!existing) {
            return logger.warn('existing not found', { id });
        }

        if (addOrReplace === 'replace') {
            existing.data.macAddresses.forEach(mac => mapByMac.delete(mac));
            data.replaceMacAddresses(id, [mac]);
        } else {
            data.addMacAddress(id, mac);
        }
        mapByMac.set(mac, existing);
        existing.online = raspberry.online;
        existing.ip = raspberry.ip;
        existing.screenState = raspberry.screenState;

        return existing;
    } else {
        raspberry.registered = true;
        raspberry.data = data.addNew(raspberry.id, mac, name);
    }

    return raspberry;
}

export function sendAction(id: string, action: string) {
    const raspberry = getById(id);
    if (!raspberry || !raspberry.registered) {
        logger.warn('unknown raspberry', { id });
        // should not happen...
        return Promise.resolve();
    }

    Object.assign(raspberry, updateFromAction(action));
    emitToRaspberryClient(raspberry.online, 'action', action);
    return raspberry;
}
