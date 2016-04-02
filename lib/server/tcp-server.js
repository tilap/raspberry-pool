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

var _semver = require('semver');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale.ConsoleLogger('app.tcp-server', _nightingale.LogLevel.INFO);

const MIN_SUPPORTED_VERSION = '4.1.0';
const clients = new Map();

function start(config) {
    const server = (0, _net.createServer)(socket => {
        logger.info('client connected');
        let mac;
        const jsonStream = (0, _objectstream.createStream)(socket);
        const pingInterval = setInterval(() => jsonStream.write({ type: 'ping' }), 30000);

        const disconnected = () => {
            if (mac && clients.get(mac).socket === socket) {
                clients.delete(mac);

                raspberriesManager.setOffline(mac);
            }

            if (pingInterval) {
                clearInterval(pingInterval);
            }

            if (jsonStream) {
                jsonStream.end();
            }
        };

        socket.on('end', () => {
            logger.info('client disconnected');
            disconnected();
        });

        socket.on('error', err => {
            logger.info('client error', { err: err });
            disconnected();
        });

        socket.setTimeout(120000, () => {
            socket.destroy(new Error('timeout'));
        });

        jsonStream.on('data', data => {
            if (data.type === 'ping') {
                logger.debug('ping', { mac: mac });
                return;
            }

            logger.info('data', { mac: mac, data: data });

            if (data.type === 'hello') {
                if (!data.version || (0, _semver.lt)(data.version, MIN_SUPPORTED_VERSION)) {
                    jsonStream.write({ type: 'selfUpdate' });
                    return;
                }

                mac = data.mac;
                clients.set(mac, { socket: socket, jsonStream: jsonStream });

                raspberriesManager.setOnline(mac, data.configTime, {
                    ip: data.ip,
                    screenState: data.screenState
                });

                return;
            }

            if (data.type === 'update') {
                const patch = {};
                ['screenState', 'updating'].forEach(key => {
                    if (data.hasOwnProperty(key)) {
                        patch[key] = data[key];
                    }
                });

                raspberriesManager.update(mac, patch);
                return;
            }

            logger.warn('unsupported instruction by client', data);
        });
    });

    const port = config.get('tcpSocket').get('port');
    server.listen(port, () => {
        logger.info('Listening', { port: port });
    });
}

function emit(mac, data) {
    logger.debug('emit', { mac: mac, data: data });
    if (!clients.has(mac)) {
        logger.warn('cannot send message');
        return;
    }
    clients.get(mac).jsonStream.write(data);
}
//# sourceMappingURL=tcp-server.js.map
