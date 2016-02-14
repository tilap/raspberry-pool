'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = start;
exports.writeById = writeById;

var _net = require('net');

var _nightingale = require('nightingale');

var _raspberries = require('./data/raspberries');

var raspberries = _interopRequireWildcard(_raspberries);

var _websocket = require('./websocket');

var _objectstream = require('objectstream');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale.ConsoleLogger('tcp-server', _nightingale.LogLevel.ALL);

const clients = new Map();

function start(config) {
    const server = (0, _net.createServer)(socket => {
        logger.info('client connected');
        let mac;
        let pingInterval;

        socket.on('end', () => {
            logger.info('client disconnected');
            if (mac && clients.get(mac).socket === socket) {
                clients.delete(mac);
            }

            const raspberry = raspberries.getByMac(mac);
            if (!raspberry) {
                logger.warn('unknown mac', { mac });
            } else {
                raspberries.setOffline(raspberry, mac);
                (0, _websocket.broadcast)('raspberry offline', { raspberry });
            }

            if (pingInterval) {
                clearInterval(pingInterval);
            }
        });

        const jsonStream = (0, _objectstream.createStream)(socket);

        pingInterval = setInterval(() => jsonStream.write({ type: 'ping' }), 10000);

        jsonStream.on('data', data => {
            if (data.type === 'ping') {
                logger.debug('ping', { mac });
                return;
            }

            logger.info('data', { mac, data });
            if (data.type === 'hello') {
                mac = data.mac;
                clients.set(mac, { socket, jsonStream });

                const raspberry = raspberries.getByMac(data.mac);
                if (!raspberry) {
                    logger.warn('unknown mac', { mac });
                    raspberries.addUnknown(data);
                } else {
                    raspberries.setOnline(raspberry, { mac, ip: data.ip });
                    (0, _websocket.broadcast)('raspberry online', { raspberry });
                }
                return;
            }

            const raspberry = raspberries.getByMac(mac);
            if (!raspberry) {
                return;
            }

            logger.warn('unsupported instruction by client', data);
        });
    });

    server.listen(config.get('tcpSocketPort'), () => {
        logger.info('Listening', { port: config.get('tcpSocketPort') });
    });
}

function writeById(id, data) {
    const raspberry = raspberries.getById(id);
    Object.keys(raspberry.networks).forEach(mac => {
        if (clients.has(mac)) {
            clients.get(mac).jsonStream.write(data);
        }
    });
}
//# sourceMappingURL=tcp-server.js.map
