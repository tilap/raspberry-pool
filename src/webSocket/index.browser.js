import socketio from 'socket.io';
import { ConsoleLogger, LogLevel } from 'nightingale';

const logger = new ConsoleLogger('app.webSocket', LogLevel.INFO);

let socket;

export function start(config) {
    if (socket) {
        throw new Error('WebSocket already started');
    }

    if (!config.has('webSocketPort')) {
        throw new Error('Missing config webSocketPort');
    }

    socket = socketio(`https://${location.hostname}:${config.get('webSocketPort')}/`, {
        reconnectionDelay: 500,
        reconnectionDelayMax: 1000,
        timeout: 4000,
        transports: ['websocket'],
    });

    socket.on('connect', () => {
        logger.success('connected', { transport: socket.io.engine.transport.name }, { transport: [] });

        const disconnected = document.getElementById('disconnected');
        if (disconnected) {
            disconnected.style.display = 'none';
        }
    });

    socket.on('disconnect', () => {
        logger.warn('disconnected');

        const disconnected = document.getElementById('disconnected');
        if (disconnected) {
            disconnected.style.display = 'block';
        }
    });

    socket.on('hello', ({ version }) => {
        if (version !== window.VERSION) {
            return location.reload(true);
        }
    });
}

export function emit(...args) {
    logger.debug('emit', { args });
    return socket.emit(...args);
}

export function on(type, handler) {
    // only one handler per type is supported
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


