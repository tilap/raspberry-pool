'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.broadcast = broadcast;
exports.start = start;

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _nightingale = require('nightingale');

var _raspberries = require('./data/raspberries');

var _fs = require('fs');

var _https = require('https');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale.ConsoleLogger('websocket', _nightingale.LogLevel.ALL);
let io;

function broadcast(type, data) {
    io.emit(type, data);
}

const dirname = __dirname;
function start(config) {
    if (io) {
        throw new Error('Already started');
    }

    if (!config.has('webSocketPort')) {
        throw new Error('Missing config webSocketPort');
    }

    const options = {
        key: (0, _fs.readFileSync)(`${ dirname }/../config/cert/server.key`),
        cert: (0, _fs.readFileSync)(`${ dirname }/../config/cert/server.crt`)
    };

    const server = (0, _https.createServer)(options);
    server.listen(config.get('webSocketPort'));
    io = (0, _socket2.default)(server);
    io.on('connection', socket => {
        logger.info('connected', { id: socket.id });
        socket.emit('update all', { raspberries: _raspberries.items, unknownRaspberries: (0, _raspberries.getUnknownRaspberries)() });

        socket.on('patch raspberry', (_ref, callback) => {
            let id = _ref.id;
            let changes = _ref.changes;

            logger.log('patch raspberry', { id, changes });
            const raspberry = (0, _raspberries.getById)(id);

            if (!raspberry) {
                logger.warn('unknown raspberry', { id });
                return;
            }

            changes = (0, _raspberries.patchRaspberry)(raspberry, changes);
            callback(changes);
            socket.broadcast.emit('update raspberry', { raspberry });
        });

        socket.on('action raspberry', (_ref2, callback) => {
            let id = _ref2.id;
            let action = _ref2.action;

            logger.log('action raspberry', { id, action });
            const raspberry = (0, _raspberries.getById)(id);

            if (!raspberry) {
                logger.warn('unknown raspberry', { id });
                return;
            }

            (0, _raspberries.sendAction)(raspberry, action);
        });

        socket.on('save unknown raspberry', (_ref3, callback) => {
            let mac = _ref3.mac;
            let name = _ref3.name;

            if (!(0, _raspberries.removeUnknown)(mac)) {
                return callback(false);
            }

            const raspberry = (0, _raspberries.addNew)(mac, name);
            socket.broadcast.emit('delete unknown raspberry', { raspberry: { mac } });
            broadcast('add raspberry', { raspberry });

            callback(true);
        });

        socket.on('disconnect', () => {
            logger.info('disconnected', { id: socket.id });
        });
    });

    io.on('error', logger.error);
}
//# sourceMappingURL=websocket.js.map
