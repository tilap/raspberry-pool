import { createServer } from 'net';
import { ConsoleLogger, LogLevel } from 'nightingale';
import * as raspberriesManager from './raspberriesManager';
import { createStream } from 'objectstream';
import { lt as semverLt } from 'semver';

const logger = new ConsoleLogger('app.tcp-server', LogLevel.INFO);

const MIN_SUPPORTED_VERSION = '4.0.0';
const clients = new Map();

export function start(config) {
    const server = createServer(socket => {
        logger.info('client connected');
        let mac;
        const jsonStream = createStream(socket);
        const pingInterval = setInterval(() => jsonStream.write({ type: 'ping' }), 30000);

        socket.on('end', () => {
            logger.info('client disconnected');
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
        });

        jsonStream.on('data', data => {
            if (data.type === 'ping') {
                logger.debug('ping', { mac });
                return;
            }

            logger.info('data', { mac, data });

            if (data.type === 'hello') {
                if (!data.version || semverLt(data.version, MIN_SUPPORTED_VERSION)) {
                    jsonStream.write({ type: 'selfUpdate' });
                    return;
                }

                mac = data.mac;
                clients.set(mac, { socket, jsonStream });

                raspberriesManager.setOnline(mac, data.configTime, {
                    ip: data.ip,
                    screenState: data.screenState,
                });

                return;
            }

            if (data.type === 'update') {
                raspberriesManager.update(mac, {
                    screenState: data.screenState,
                });
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
