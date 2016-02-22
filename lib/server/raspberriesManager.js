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

var _raspberriesData = require('./raspberriesData');

var data = _interopRequireWildcard(_raspberriesData);

var _tcpServer = require('./tcp-server');

var raspberries = _interopRequireWildcard(_tcpServer);

var _webSocket = require('../webSocket');

var webSocket = _interopRequireWildcard(_webSocket);

var _nightingale = require('nightingale');

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
        logger.warn('unknown mac', { mac });
        raspberry = { id: mac };
        map.set(raspberry.mac, raspberry);
        mapByMac.set(mac, raspberry);
    } else {
        logger.info('raspberry online', { mac });
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

function add(mac, name) {
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

function sendAction(id, action, callback) {
    const raspberry = getById(id);
    if (!raspberry || !raspberry.registered) {
        logger.warn('unknown raspberry', { id });
        // should not happen...
        return callback();
    }

    raspberries.emit(raspberry.online, { type: 'action', action });
    callback();
}
//# sourceMappingURL=raspberriesManager.js.map
