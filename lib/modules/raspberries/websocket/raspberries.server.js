'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = init;
exports.broadcastAction = broadcastAction;

var _raspberriesManager = require('../raspberriesManager.server');

var raspberriesManager = _interopRequireWildcard(_raspberriesManager);

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _raspberry = require('../actions/raspberry');

var _alpReactRedux = require('alp-react-redux');

var _alpWebsocket = require('alp-websocket');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale2.default('app.websocket.raspberries');

let clientsCount = 0;
let clientNs;

function init(io) {
    clientNs = io.of('client', socket => {
        return onConnection(socket);
    });
}

function broadcastAction(action) {
    if (!(action instanceof Object)) {
        throw new TypeError('Value of argument "action" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(action));
    }

    logger.info('broadcast', action);
    (0, _alpReactRedux.emitAction)(clientNs.to('raspberries'), action);
}

function onConnection(socket) {
    if (clientsCount++ === 0) {
        raspberriesManager.raspberriesClientsConnected();
    }
    logger.info('connected', { clientsCount: clientsCount });

    socket.on('disconnect', () => {
        if (--clientsCount === 0) {
            raspberriesManager.raspberriesClientsDisonnected();
        }
        logger.info('disconnected', { clientsCount: clientsCount });
    });

    (0, _alpWebsocket.subscribe)(socket, 'raspberries', () => {
        return (0, _raspberry.updateAll)(raspberriesManager.getAll());
    });

    socket.on('raspberry:changeConfig', (id, config, callback) => {
        const newConfig = raspberriesManager.changeConfig(id, config, callback);
        if (!newConfig) {
            callback();
        } else {
            callback(newConfig);
            const raspberry = raspberriesManager.getById(id);
            (0, _alpReactRedux.emitAction)(socket.broadcast.to('raspberries'), (0, _raspberry.updateConfig)(raspberry, newConfig));
        }
    });

    socket.on('raspberry:sendAction', (ids, action, callback) => {
        logger.info('sendAction raspberry', { ids: ids, action: action });
        ids.forEach(id => {
            const raspberry = raspberriesManager.sendAction(id, action);
            if (raspberry) {
                (0, _alpReactRedux.emitAction)(socket.broadcast.to('raspberries'), (0, _raspberry.update)(raspberry));
            }
        });
        callback();
    });

    socket.on('raspberry:registerUnknown', (mac, info, callback) => {
        logger.info('register raspberry', { mac: mac, info: info });
        const newRaspberry = raspberriesManager.add(mac, info);
        if (!newRaspberry) {
            callback(false);
        } else {
            callback(newRaspberry);
            (0, _alpReactRedux.emitAction)(socket.broadcast.to('raspberries'), (0, _raspberry.update)(newRaspberry));
        }
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
//# sourceMappingURL=raspberries.server.js.map
