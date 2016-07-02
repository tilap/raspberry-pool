import websocket from 'alp-websocket';
import Logger from 'nightingale';

const logger = new Logger('app.websocket');
let socket;

export function init(app) {
    socket = websocket(app, 'client');

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

export function isConnected() {
    return socket && socket.connected;
}

export function emit(eventName: string, ...args) {
    logger.debug('emit', { eventName, args });
    return socket.emit(eventName, ...args);
}

export function on(type, handler) {
    socket.on(type, handler);
    return handler;
}

export function off(type, handler) {
    socket.off(type, handler);
}


