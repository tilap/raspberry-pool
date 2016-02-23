'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.broadcast = broadcast;
exports.start = start;

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _nightingale = require('nightingale');

var _raspberriesManager = require('../server/raspberriesManager');

var raspberriesManager = _interopRequireWildcard(_raspberriesManager);

var _fs = require('fs');

var _https = require('https');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale.ConsoleLogger('app.webSocket', _nightingale.LogLevel.INFO);
let io;

function broadcast(type, data) {
    logger.info('broadcast', { type, data });
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
        key: (0, _fs.readFileSync)(`${ dirname }/../../config/cert/server.key`),
        cert: (0, _fs.readFileSync)(`${ dirname }/../../config/cert/server.crt`)
    };

    const server = (0, _https.createServer)(options);
    server.listen(config.get('webSocketPort'));
    io = (0, _socket2.default)(server);
    io.on('connection', socket => {
        logger.info('connected', { id: socket.id });
        socket.emit('hello', {
            version: config.get('version'),
            raspberries: raspberriesManager.getAll()
        });

        socket.on('raspberry:changeConfig', (id, config, callback) => {
            const newConfig = raspberriesManager.changeConfig(id, config, callback);
            if (!newConfig) {
                callback();
            } else {
                callback(newConfig);
                const raspberry = raspberriesManager.getById(id);
                socket.broadcast.emit('raspberry:update', raspberry);
            }
        });

        socket.on('raspberry:sendAction', (id, action, callback) => {
            raspberriesManager.sendAction(id, action).then(() => callback());
        });

        socket.on('raspberry:broadcastAction', (ids, action, callback) => {
            Promise.all(ids.map(id => raspberriesManager.sendAction(id, action))).then(() => callback());
        });

        socket.on('raspberry:add', (mac, name, callback) => {
            const newRaspberry = raspberriesManager.add(mac, name);
            if (!newRaspberry) {
                callback(false);
            } else {
                callback(newRaspberry);
                socket.broadcast.emit('raspberry:update', newRaspberry);
            }
        });

        socket.on('disconnect', () => {
            logger.info('disconnected', { id: socket.id });
        });
    });

    io.on('error', logger.error);
}
//# sourceMappingURL=index.js.map
