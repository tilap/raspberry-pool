import * as raspberriesManager from '../raspberriesManager';
import Logger from 'nightingale';

const logger = new Logger('app.websocket.raspberries');

export default function init(socket) {
    logger.info('connected');

    socket.on('disconnect', () => {
        logger.info('disconnected');
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
            socket.broadcast.to('raspberries').emit('raspberry:update', raspberry);
        }
    });

    socket.on('raspberry:sendAction', (ids, action, callback) => {
        logger.info('sendAction raspberry', { ids, action });
        ids.forEach(id => {
            const raspberry = raspberriesManager.sendAction(id, action);
            if (raspberry) {
                socket.broadcast.to('raspberries').emit('raspberry:update', raspberry);
            }
        });
        callback();
    });

    socket.on('raspberry:add', (mac, info, callback) => {
        logger.info('register raspberry', { mac, info });
        const newRaspberry = raspberriesManager.add(mac, info);
        if (!newRaspberry) {
            callback(false);
        } else {
            callback(newRaspberry);
            socket.broadcast.to('raspberries').emit('raspberry:update', newRaspberry);
            if (newRaspberry.id !== mac) {
                socket.broadcast.to('raspberries').emit('raspberry:update', newRaspberry);
            }
        }
    });
}
