import { createServer } from 'net';
import { ConsoleLogger, LogLevel } from 'nightingale';
import * as raspberriesManager from './raspberriesManager';
import { createStream } from 'objectstream';

const logger = new ConsoleLogger('app.tcp-server', LogLevel.INFO);

const clients = new Map();

export function start(config) {
    const server = createServer(socket => {
        logger.info('client connected');
        let mac;
        const jsonStream = createStream(socket);
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

export function emit(mac, data) {
    logger.debug('emit', { mac, data });
    if (!clients.has(mac)) {
        logger.warn('cannot send message');
        return;
    }
    clients.get(mac).jsonStream.write(data);
}
