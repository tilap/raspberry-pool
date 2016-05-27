'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.start = start;

var _net = require('net');

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _objectstream = require('objectstream');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.tcp-server');

function start(config) {
    const server = (0, _net.createServer)(socket => {
        logger.info('client connected');
        let mac;
        const jsonStream = (0, _objectstream.createStream)(socket);

        const disconnected = () => {
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

            logger.warn('data', { mac: mac, data: data });

            if (data.type === 'hello') {
                jsonStream.write({ type: 'selfUpdate' });
                return;
            }
        });
    });

    const port = config.get('tcpSocket').get('port');
    server.listen(port, () => {
        logger.info('Listening', { port: port });
    });
}
//# sourceMappingURL=tcp-server.js.map
