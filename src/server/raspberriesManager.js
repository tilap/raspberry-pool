import * as data from './raspberriesData';
import * as raspberries from './tcp-server';
import * as webSocket from '../webSocket';
import { ConsoleLogger, LogLevel } from 'nightingale';

const logger = new ConsoleLogger('app.raspberriesManager', LogLevel.INFO);
const map = new Map();
const mapByMac = new Map();

data.items.forEach(item => {
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

export function getById(id) {
    return map.get(id);
}

export function getByMac(mac) {
    return mapByMac.get(mac);
}

export function getAll() {
    return Array.from(map.values());
}

/* FROM raspberries */

export function setOnline(mac, configTime, info) {
    let raspberry = getByMac(mac);
    let unknownMac = false;
    if (!raspberry) {
        unknownMac = true;
        logger.warn('unknown mac', { mac });
        raspberry = { id: mac };
        map.set(raspberry.id, raspberry);
        mapByMac.set(mac, raspberry);
    } else {
        logger.info('raspberry online', { mac });
    }

    raspberry.online = mac;
    Object.assign(raspberry, info);

    webSocket.broadcast(`raspberry:${unknownMac ? 'add' : 'update'}`, raspberry);

    if (raspberry.data && raspberry.data.config.time !== configTime) {
        raspberries.emit(raspberry.online, {
            type: 'change-config',
            config: raspberry.data.config,
        });
    }
}

export function update(mac, info) {
    let raspberry = getByMac(mac);
    if (!raspberry) {
        // should not happen...
        return;
    }

    Object.assign(raspberry, info);
    webSocket.broadcast(`raspberry:update`, raspberry);
}

export function setOffline(mac) {
    const raspberry = getByMac(mac);
    if (!raspberry) {
        // should not happen...
        return;
    }

    if (!raspberry.data) {
        map.delete(mac);
        mapByMac.delete(mac);
        webSocket.broadcast('raspberry:delete', raspberry.id);
    } else {
        Object.assign(raspberry, {
            online: false,
            // keep last known ip
        });

        webSocket.broadcast('raspberry:update', raspberry);
    }
}

/* FROM browser clients */

export function changeConfig(id, config) {
    logger.log('changeConfig', { id, config });
    const raspberry = getById(id);
    if (!raspberry || !raspberry.registered) {
        logger.warn('unknown raspberry', { id });
        // should not happen...
        return;
    }

    const newConfig = data.changeConfig(id, config);
    raspberries.emit(raspberry.online, { type: 'change-config', config: newConfig });
    return newConfig;
}

export function add(mac, name) {
    const raspberry = getByMac(mac);
    if (!raspberry || !raspberry.registered) {
        logger.warn('unknown raspberry', { mac });
        // should not happen...
        return;
    }

    raspberry.registered = true;
    raspberry.data = data.addNew(raspberry.id, mac, name);
    return raspberry;
}

export function sendAction(id, action, callback) {
    const raspberry = getById(id);
    if (!raspberry || !raspberry.registered) {
        logger.warn('unknown raspberry', { id });
        // should not happen...
        return Promise.resolve();
    }

    raspberries.emit(raspberry.online, { type: 'action', action });
    return Promise.resolve();
}
