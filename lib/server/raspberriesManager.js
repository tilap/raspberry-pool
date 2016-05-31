'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getById = getById;
exports.getByMac = getByMac;
exports.getAll = getAll;
exports.screenshotPath = screenshotPath;
exports.setOnline = setOnline;
exports.update = update;
exports.setOffline = setOffline;
exports.changeScreenshot = changeScreenshot;
exports.raspberriesClientsConnected = raspberriesClientsConnected;
exports.raspberriesClientsDisonnected = raspberriesClientsDisonnected;
exports.changeConfig = changeConfig;
exports.add = add;
exports.sendAction = sendAction;

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _raspberriesData = require('./raspberriesData');

var data = _interopRequireWildcard(_raspberriesData);

var _raspberryActionManager = require('../common/raspberryActionManager');

var _websocket = require('./websocket');

var _types = require('./types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RaspberryConfig = _types.RaspberryConfig,
    RaspberryData = _types.RaspberryData,
    Raspberry = _types.Raspberry;


const logger = new _nightingale2.default('app.raspberriesManager');
const map = new Map();
const mapByMac = new Map();

data.items.forEach(item => {
    if (!(item == null || RaspberryData(item))) {
        throw new TypeError('Value of argument "item" violates contract.\n\nExpected:\n?RaspberryData\n\nGot:\n' + _inspect(item));
    }

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
    function _ref(_id) {
        if (!(_id == null || Raspberry(_id))) {
            throw new TypeError('Function "getById" return value violates contract.\n\nExpected:\n?Raspberry\n\nGot:\n' + _inspect(_id));
        }

        return _id;
    }

    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    return _ref(map.get(id));
}

function getByMac(mac) {
    function _ref2(_id2) {
        if (!(_id2 == null || Raspberry(_id2))) {
            throw new TypeError('Function "getByMac" return value violates contract.\n\nExpected:\n?Raspberry\n\nGot:\n' + _inspect(_id2));
        }

        return _id2;
    }

    if (!(typeof mac === 'string')) {
        throw new TypeError('Value of argument "mac" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(mac));
    }

    return _ref2(mapByMac.get(mac));
}

function getAll() {
    function _ref3(_id3) {
        if (!(Array.isArray(_id3) && _id3.every(function (item) {
            return Raspberry(item);
        }))) {
            throw new TypeError('Function "getAll" return value violates contract.\n\nExpected:\nArray<Raspberry>\n\nGot:\n' + _inspect(_id3));
        }

        return _id3;
    }

    return _ref3(Array.from(map.values()));
}

function screenshotPath(id) {
    function _ref4(_id4) {
        if (!(typeof _id4 === 'string')) {
            throw new TypeError('Function "screenshotPath" return value violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(_id4));
        }

        return _id4;
    }

    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    return _ref4(data.screenshotPath(id));
}

/* FROM raspberry clients */

function setOnline(mac, configTime, info) {
    let raspberry = getByMac(mac);
    let unknownMac = false;
    if (!raspberry) {
        unknownMac = true;
        logger.warn('unknown mac, adding', { mac: mac });
        raspberry = { id: mac };
        map.set(raspberry.id, raspberry);
        mapByMac.set(mac, raspberry);
    } else {
        logger.info('raspberry online', { mac: mac });
        if (raspberry.updating) {
            raspberry.updating = false;
        }
    }

    raspberry.online = mac;
    Object.assign(raspberry, info);

    (0, _websocket.raspberriesBroadcast)(`raspberry:${ unknownMac ? 'add' : 'update' }`, raspberry);

    if (raspberry.data && raspberry.data.config.time !== configTime) {
        (0, _websocket.emitToRaspberryClient)(raspberry.online, 'changeConfig', raspberry.data.config);
    }
}

function update(mac, info) {
    if (!(typeof mac === 'string')) {
        throw new TypeError('Value of argument "mac" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(mac));
    }

    let raspberry = getByMac(mac);
    if (!raspberry) {
        // should not happen...
        return;
    }

    if (info.screenState && raspberry.nextExpectedScreenState === info.screenState) {
        raspberry.nextExpectedScreenState = null;
    }

    Object.assign(raspberry, info);
    (0, _websocket.raspberriesBroadcast)('raspberry:update', raspberry);
}

function setOffline(mac) {
    if (!(typeof mac === 'string')) {
        throw new TypeError('Value of argument "mac" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(mac));
    }

    const raspberry = getByMac(mac);
    if (!raspberry) {
        // should not happen...
        return;
    }

    if (!raspberry.data) {
        map.delete(mac);
        mapByMac.delete(mac);
        (0, _websocket.raspberriesBroadcast)('raspberry:delete', raspberry.id);
    } else {
        Object.assign(raspberry, {
            online: false
        });

        // keep last known ip
        (0, _websocket.raspberriesBroadcast)('raspberry:update', raspberry);
    }
}

function changeScreenshot(mac, screenshot) {
    if (!(typeof mac === 'string')) {
        throw new TypeError('Value of argument "mac" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(mac));
    }

    if (!(screenshot instanceof Buffer)) {
        throw new TypeError('Value of argument "screenshot" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(screenshot));
    }

    const raspberry = getByMac(mac);
    if (!raspberry) {
        logger.warn('changeScreenshot, no raspberry', { mac: mac });
        // should not happen...
        return;
    }

    data.saveScreenshot(raspberry.id, screenshot);
    (0, _websocket.raspberriesBroadcast)('raspberry:screenshot-updated', raspberry.id, Date.now());
}

/* FROM browser clients */

const TIME_OUTDATED = 30000;
let intervalUpdateData;
let lastUpdated = Date.now() - TIME_OUTDATED;

function raspberriesClientsConnected() {
    const now = Date.now();
    if (lastUpdated > now - TIME_OUTDATED) {
        logger.debug('not outdated');
        return;
    }
    lastUpdated = now;

    logger.info('update data');
    (0, _websocket.broadcastToRaspberryClients)('screenshot');

    intervalUpdateData = setInterval(() => {
        logger.info('update data');
        (0, _websocket.broadcastToRaspberryClients)('screenshot');
    }, TIME_OUTDATED);
}

function raspberriesClientsDisonnected() {
    if (intervalUpdateData) {
        clearInterval(intervalUpdateData);
    }
}

function changeConfig(id, config) {
    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    if (!RaspberryConfig(config)) {
        throw new TypeError('Value of argument "config" violates contract.\n\nExpected:\nRaspberryConfig\n\nGot:\n' + _inspect(config));
    }

    logger.log('changeConfig', { id: id, config: config });
    const raspberry = getById(id);
    if (!raspberry || !raspberry.registered) {
        logger.warn('unknown raspberry', { id: id });
        // should not happen...
        return;
    }

    const newConfig = data.changeConfig(id, config);
    (0, _websocket.emitToRaspberryClient)(raspberry.online, 'changeConfig', newConfig);
    return newConfig;
}

function add(mac, _ref5) {
    let name = _ref5.name;
    let addOrReplace = _ref5.addOrReplace;
    let id = _ref5.id;

    if (!(typeof mac === 'string')) {
        throw new TypeError('Value of argument "mac" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(mac));
    }

    logger.log('add', { mac: mac, name: name, addOrReplace: addOrReplace, id: id });
    const raspberry = getByMac(mac);
    if (!raspberry) {
        return logger.warn('unknown raspberry', { mac: mac });
    } else if (raspberry.registered) {
        return logger.warn('raspberry already registered', { mac: mac });
    }

    if (addOrReplace) {
        mapByMac.delete(mac);
        map.delete(mac);
        const existing = map.get(id);
        if (!existing) {
            return logger.warn('existing not found', { id: id });
        }

        if (addOrReplace === 'replace') {
            existing.data.macAddresses.forEach(mac => {
                return mapByMac.delete(mac);
            });
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
    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    if (!(typeof action === 'string')) {
        throw new TypeError('Value of argument "action" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(action));
    }

    const raspberry = getById(id);
    if (!raspberry || !raspberry.registered) {
        logger.warn('unknown raspberry', { id: id });
        // should not happen...
        return Promise.resolve();
    }

    Object.assign(raspberry, (0, _raspberryActionManager.updateFromAction)(action));
    (0, _websocket.emitToRaspberryClient)(raspberry.online, 'action', action);
    return raspberry;
}

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=raspberriesManager.js.map
