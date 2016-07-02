import * as raspberriesManager from '../raspberriesManager.server';
import Logger from 'nightingale';
import { update, updateConfig } from '../actions/raspberry';
import { emitAction } from 'alp-react-redux';

const logger = new Logger('app.websocket.raspberries');

let clientsCount = 0;
let clientNs;

export default function init(io) {
    clientNs = io.of('client', socket => onConnection(socket));
}

export function broadcastAction(action: Object) {
    logger.info('broadcast', action);
    emitAction(clientNs.to('raspberries'), action);
}

function onConnection(socket) {
    if (clientsCount++ === 0) {
        raspberriesManager.raspberriesClientsConnected();
    }
    logger.info('connected', { clientsCount });

    socket.on('disconnect', () => {
        if (--clientsCount === 0) {
            raspberriesManager.raspberriesClientsDisonnected();
        }
        logger.info('disconnected', { clientsCount });
    });

    socket.on('subscribe:raspberries', (callback) => {
        logger.info('join');
        socket.join('raspberries');
        callback({ raspberries: raspberriesManager.getAll() });
    });

    socket.on('unsubscribe:raspberries', () => {
        logger.info('leave');
        socket.leave('raspberries');
    });

    socket.on('raspberry:changeConfig', (id, config, callback) => {
        const newConfig = raspberriesManager.changeConfig(id, config, callback);
        if (!newConfig) {
            callback();
        } else {
            callback(newConfig);
            const raspberry = raspberriesManager.getById(id);
            emitAction(socket.broadcast.to('raspberries'), updateConfig(raspberry, newConfig));
        }
    });

    socket.on('raspberry:sendAction', (ids, action, callback) => {
        logger.info('sendAction raspberry', { ids, action });
        ids.forEach(id => {
            const raspberry = raspberriesManager.sendAction(id, action);
            if (raspberry) {
                emitAction(socket.broadcast.to('raspberries'), update(raspberry));
            }
        });
        callback();
    });

    socket.on('raspberry:registerUnknown', (mac, info, callback) => {
        logger.info('register raspberry', { mac, info });
        const newRaspberry = raspberriesManager.add(mac, info);
        if (!newRaspberry) {
            callback(false);
        } else {
            callback(newRaspberry);
            emitAction(socket.broadcast.to('raspberries'), update(newRaspberry));
        }
    });
}
