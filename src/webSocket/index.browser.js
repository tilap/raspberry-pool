import websocket from 'alp-websocket';
import Logger from 'nightingale';

const logger = new Logger('app.webSocket');
let socket;

export function init(app) {
    socket = websocket(app);

    socket.on('connect', () => {
        const disconnected = document.getElementById('disconnected');
        if (disconnected) {
            disconnected.style.display = 'none';
        }
    });

    socket.on('disconnect', () => {
        const disconnected = document.getElementById('disconnected');
        if (disconnected) {
            disconnected.style.display = 'block';
        }
    });
}

export function emit(...args) {
    logger.debug('emit', { args });
    return socket.emit(...args);
}

export function on(type, handler) {
    socket.on(type, handler);
    return handler;
}

export function off(type, handler) {
    socket.off(type, handler);
}

export function changeConfig(raspberry, config, callback) {
    emit('raspberry:changeConfig', raspberry.id, config, callback);
}

export function sendAction(raspberries, action, callback) {
    emit('raspberry:sendAction', raspberries.map(r => r.id), action, callback);
}

export function registerUnknown(raspberry, name, callback) {
    emit('raspberry:add', raspberry.id, name, callback);
}


