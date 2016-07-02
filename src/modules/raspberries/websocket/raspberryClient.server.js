import Logger from 'nightingale';
import * as raspberriesManager from '../raspberriesManager.server';
import { lt as semverLt } from 'semver';

const logger = new Logger('app.websocket.raspberryClient');
const MIN_SUPPORTED_VERSION = '4.1.0';
const clients = new Map();


export function emit(mac, eventName: string, ...data?: Array<any>) {
    logger.debug('emit', { mac, data });
    if (!clients.has(mac)) {
        logger.warn('cannot send message');
        return;
    }
    clients.get(mac).emit(eventName, ...data);
}

export function broadcast(eventName: string, ...data?: Array<any>) {
    clients.forEach(socket => socket.emit(eventName, ...data));
}


export default function init(io) {
    io.of('raspberry-client', socket => onConnection(socket));
}

function onConnection(socket) {
    logger.info('client connected');
    let clientMac;

    socket.on('disconnect', () => {
        logger.info('client disconnected');
        if (clientMac && clients.get(clientMac) === socket) {
            clients.delete(clientMac);

            raspberriesManager.setOffline(clientMac);
        }
        clientMac = null;
    });

    socket.on('hello', ({ mac, version, configTime, ip, screenState }) => {
        logger.info('received hello', { mac, version, configTime, ip, screenState });

        if (clientMac) {
            logger.warn('already have clientMac');
            return;
        }

        if (!version || semverLt(version, MIN_SUPPORTED_VERSION)) {
            socket.emit('selfUpdate');
            return;
        }


        clientMac = mac;
        clients.set(mac, socket);

        raspberriesManager.setOnline(mac, configTime, { ip, screenState });
    });

    socket.on('screenshot', ({ buffer }, callback) => {
        logger.info('got screenshot');
        raspberriesManager.changeScreenshot(clientMac, buffer); // non async method
        callback();
    });

    socket.on('update', data => {
        logger.info('received update', data);

        const patch = {};
        ['screenState', 'updating'].forEach(key => {
            if (data.hasOwnProperty(key)) {
                patch[key] = data[key];
            }
        });

        raspberriesManager.update(clientMac, patch);
    });
}
