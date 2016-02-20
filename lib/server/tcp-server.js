'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = start;
exports.emit = emit;

var _net = require('net');

var _nightingale = require('nightingale');

var _raspberriesManager = require('./raspberriesManager');

var raspberriesManager = _interopRequireWildcard(_raspberriesManager);

var _objectstream = require('objectstream');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale.ConsoleLogger('app.tcp-server', _nightingale.LogLevel.INFO);

const clients = new Map();

function start(config) {
    const server = (0, _net.createServer)(socket => {
        logger.info('client connected');
        let mac;
        const jsonStream = (0, _objectstream.createStream)(socket);
        const pingInterval = setInterval(() => jsonStream.write({ type: 'ping' }), 10000);

        socket.on('end', () => {
            logger.info('client disconnected');
            if (mac && clients.get(mac).socket === socket) {
                clients.delete(mac);
            }

            raspberriesManager.setOffline(mac);

            if (pingInterval) {
                clearInterval(pingInterval);
            }

            if (jsonStream) {
                jsonStream.end();
            }
        });

        jsonStream.on('data', data => {
            if (data.type === 'ping') {
                logger.debug('ping', { mac });
                return;
            }

            logger.info('data', { mac, data });

            if (data.type === 'hello') {
                mac = data.mac;
                clients.set(mac, { socket, jsonStream });

                raspberriesManager.setOnline(mac, data.ip, socket);
                return;
            }

            logger.warn('unsupported instruction by client', data);
        });
    });

    server.listen(config.get('tcpSocketPort'), () => {
        logger.info('Listening', { port: config.get('tcpSocketPort') });
    });
}

function emit(mac, data) {
    logger.debug('emit', { mac, data });
    if (!clients.has(mac)) {
        logger.warn('cannot send message');
        return;
    }
    clients.get(mac).jsonStream.write(data);
}
//# sourceMappingURL=tcp-server.js.map
