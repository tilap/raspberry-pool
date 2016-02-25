'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getById = getById;
exports.getByMac = getByMac;
exports.getAll = getAll;
exports.setOnline = setOnline;
exports.update = update;
exports.setOffline = setOffline;
exports.changeConfig = changeConfig;
exports.add = add;
exports.sendAction = sendAction;

var _nightingale = require('nightingale');

var _raspberriesData = require('./raspberriesData');

var data = _interopRequireWildcard(_raspberriesData);

var _raspberryActionManager = require('../common/raspberryActionManager');

var _tcpServer = require('./tcp-server');

var raspberries = _interopRequireWildcard(_tcpServer);

var _webSocket = require('../webSocket');

var webSocket = _interopRequireWildcard(_webSocket);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale.ConsoleLogger('app.raspberriesManager', _nightingale.LogLevel.INFO);
const map = new Map();
const mapByMac = new Map();

data.items.forEach(item => {
    const raspberry = {
        id: item.id,
        data: item,
        registered: true,
        online: false,
        ip: null
    };

    map.set(item.id, raspberry);
    item.macAddresses.forEach(mac => {
        if (mapByMac.has(mac)) {
            throw new Error(`Mac defined more than one: ${ mac }`);
        }

        mapByMac.set(mac, raspberry);
    });
});

function getById(id) {
    return map.get(id);
}

function getByMac(mac) {
    return mapByMac.get(mac);
}

function getAll() {
    return Array.from(map.values());
}

/* FROM raspberries */

function setOnline(mac, configTime, info) {
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

    webSocket.broadcast(`raspberry:${ unknownMac ? 'add' : 'update' }`, raspberry);

    if (raspberry.data && raspberry.data.config.time !== configTime) {
        raspberries.emit(raspberry.online, {
            type: 'change-config',
            config: raspberry.data.config
        });
    }
}

function update(mac, info) {
    let raspberry = getByMac(mac);
    if (!raspberry) {
        // should not happen...
        return;
    }

    if (info.screenState && raspberry.nextExpectedScreenState === info.screenState) {
        raspberry.nextExpectedScreenState = null;
    }

    Object.assign(raspberry, info);
    webSocket.broadcast(`raspberry:update`, raspberry);
}

function setOffline(mac) {
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
            online: false
        });

        // keep last known ip
        webSocket.broadcast('raspberry:update', raspberry);
    }
}

/* FROM browser clients */

function changeConfig(id, config) {
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

function add(mac, _ref) {
    let name = _ref.name;
    let addOrReplace = _ref.addOrReplace;
    let id = _ref.id;

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

function sendAction(id, action) {
    const raspberry = getById(id);
    if (!raspberry || !raspberry.registered) {
        logger.warn('unknown raspberry', { id });
        // should not happen...
        return Promise.resolve();
    }

    Object.assign(raspberry, (0, _raspberryActionManager.updateFromAction)(action));
    raspberries.emit(raspberry.online, { type: 'action', action });
    return raspberry;
}
//# sourceMappingURL=raspberriesManager.js.map
