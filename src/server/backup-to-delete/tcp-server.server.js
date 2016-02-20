import { createServer } from 'net';
import { ConsoleLogger, LogLevel } from 'nightingale';
import * as raspberries from './data/raspberries';
import { broadcast } from './websocket';
import { createStream } from 'objectstream';

const logger = new ConsoleLogger('tcp-server', LogLevel.ALL);

const clients = new Map();

export function start(config) {
    const server = createServer(socket => {
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
                raspberries.removeUnknown(mac);
                broadcast('delete unknown raspberry', { raspberry: { mac } });
            } else {
                raspberries.setOffline(raspberry, mac);
                broadcast('raspberry offline', { raspberry });
            }

            if (pingInterval) {
                clearInterval(pingInterval);
            }
        });

        const jsonStream = createStream(socket);

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
                    broadcast('add unknown raspberry', { raspberry: { mac, ip: data.ip } });
                } else {
                    raspberries.setOnline(raspberry, { mac, ip: data.ip });
                    broadcast('raspberry online', { raspberry });
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

export function writeById(id, data) {
    const raspberry = raspberries.getById(id);
    Object.keys(raspberry.networks).forEach(mac => {
        if (clients.has(mac)) {
            clients.get(mac).jsonStream.write(data);
        }
    });
}
