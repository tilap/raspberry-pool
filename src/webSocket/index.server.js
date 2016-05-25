import websocket from 'alp-websocket';
import Logger from 'nightingale';
import * as raspberriesManager from '../server/raspberriesManager';

const logger = new Logger('app.webSocket');
let io;

export function broadcast(type, data) {
    logger.info('broadcast', { type, data });
    io.to('raspberries').emit(type, data);
}

export function init(app) {
    io = websocket(app);

    io.on('connection', socket => {
        socket.on('subscribe:raspberries', (callback) => {
            socket.join('raspberries');
            callback({ raspberries: raspberriesManager.getAll() });
        });

        socket.on('unsubscribe:raspberries', () => {
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
            ids.forEach(id => {
                const raspberry = raspberriesManager.sendAction(id, action);
                if (raspberry) {
                    socket.broadcast.to('raspberries').emit('raspberry:update', raspberry);
                }
            });
            callback();
        });

        socket.on('raspberry:add', (mac, info, callback) => {
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
    });
}
