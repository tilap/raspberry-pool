'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.emit = emit;
exports.broadcast = broadcast;
exports.default = init;

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _raspberriesManager = require('../raspberriesManager');

var raspberriesManager = _interopRequireWildcard(_raspberriesManager);

var _semver = require('semver');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.websocket.raspberryClient');
const MIN_SUPPORTED_VERSION = '4.1.0';
const clients = new Map();

function emit(mac, eventName) {
    for (var _len = arguments.length, data = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        data[_key - 2] = arguments[_key];
    }

    if (!(typeof eventName === 'string')) {
        throw new TypeError('Value of argument "eventName" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(eventName));
    }

    if (!(data === undefined || Array.isArray(data))) {
        throw new TypeError('Value of argument "data" violates contract.\n\nExpected:\nArray<any>\n\nGot:\n' + _inspect(data));
    }

    logger.debug('emit', { mac: mac, data: data });
    if (!clients.has(mac)) {
        logger.warn('cannot send message');
        return;
    }
    clients.get(mac).emit(eventName, ...data);
}

function broadcast(eventName) {
    for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        data[_key2 - 1] = arguments[_key2];
    }

    if (!(typeof eventName === 'string')) {
        throw new TypeError('Value of argument "eventName" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(eventName));
    }

    if (!(data === undefined || Array.isArray(data))) {
        throw new TypeError('Value of argument "data" violates contract.\n\nExpected:\nArray<any>\n\nGot:\n' + _inspect(data));
    }

    clients.forEach(socket => {
        return socket.emit(eventName, ...data);
    });
}

function init(socket) {
    logger.info('client connected');
    let clientMac;

    socket.on('disconnect', () => {
        logger.info('client disconnected');
        if (clientMac && clients.get(clientMac) === socket) {
            clients.delete(clientMac);

            raspberriesManager.setOffline(clientMac);
        }
        clientMac = null;
    });

    socket.on('hello', _ref => {
        let mac = _ref.mac;
        let version = _ref.version;
        let configTime = _ref.configTime;
        let ip = _ref.ip;
        let screenState = _ref.screenState;

        logger.info('received hello', { mac: mac, version: version, configTime: configTime, ip: ip, screenState: screenState });

        if (clientMac) {
            logger.warn('already have clientMac');
            return;
        }

        if (!version || (0, _semver.lt)(version, MIN_SUPPORTED_VERSION)) {
            socket.emit('selfUpdate');
            return;
        }

        clientMac = mac;
        clients.set(mac, socket);

        raspberriesManager.setOnline(mac, configTime, { ip: ip, screenState: screenState });
    });

    socket.on('screenshot', (_ref2, callback) => {
        let buffer = _ref2.buffer;

        logger.info('got screenshot');
        raspberriesManager.changeScreenshot(clientMac, buffer); // non async method
        callback();
    });

    socket.on('update', data => {
        logger.info('received update', data);

        const patch = {};
        ['screenState', 'updating'].forEach(key => {
            if (data.hasOwnProperty(key)) {
                patch[key] = data[key];
            }
        });

        raspberriesManager.update(clientMac, patch);
    });
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
//# sourceMappingURL=raspberryClient.js.map
