import socketio from 'socket.io';
import { ConsoleLogger, LogLevel } from 'nightingale';
import { items as raspberries, patchRaspberry, getById, sendAction, getUnknownRaspberries, removeUnknown, addNew } from './data/raspberries';
import { readFileSync } from 'fs';
import { createServer } from 'https';

const logger = new ConsoleLogger('websocket', LogLevel.ALL);
let io;

export function broadcast(type, data) {
    io.emit(type, data);
}

const dirname = __dirname;
export function start(config) {
    if (io) {
        throw new Error('Already started');
    }

    if (!config.has('webSocketPort')) {
        throw new Error('Missing config webSocketPort');
    }

    const options = {
        key: readFileSync(`${dirname}/../config/cert/server.key`),
        cert: readFileSync(`${dirname}/../config/cert/server.crt`),
    };

    const server = createServer(options);
    server.listen(config.get('webSocketPort'));
    io = socketio(server);
    io.on('connection', socket => {
        logger.info('connected', { id: socket.id });
        socket.emit('update all', { raspberries, unknownRaspberries: getUnknownRaspberries() });

        socket.on('patch raspberry', ({ id, changes }, callback) => {
            logger.log('patch raspberry', { id, changes });
            const raspberry = getById(id);

            if (!raspberry) {
                logger.warn('unknown raspberry', { id });
                return;
            }

            changes = patchRaspberry(raspberry, changes);
            callback(changes);
            socket.broadcast.emit('update raspberry', { raspberry });
        });

        socket.on('action raspberry', ({ id, action }, callback) => {
            logger.log('action raspberry', { id, action });
            const raspberry = getById(id);

            if (!raspberry) {
                logger.warn('unknown raspberry', { id });
                return;
            }

            sendAction(raspberry, action);
        });

        socket.on('save unknown raspberry', ({ mac, name }, callback) => {
            if (!removeUnknown(mac)) {
                return callback(false);
            }

            const raspberry = addNew(mac, name);
            socket.broadcast.emit('delete unknown raspberry', { raspberry: { mac } });
            broadcast('add raspberry', { raspberry });

            callback(true);
        });

        socket.on('disconnect', () => {
            logger.info('disconnected', { id: socket.id });
        });
    });

    io.on('error', logger.error);
}
