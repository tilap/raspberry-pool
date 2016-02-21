import socketio from 'socket.io';
import { ConsoleLogger, LogLevel } from 'nightingale';
import * as raspberriesManager from '../server/raspberriesManager';
import { readFileSync } from 'fs';
import { createServer } from 'https';

const logger = new ConsoleLogger('app.webSocket', LogLevel.INFO);
let io;

export function broadcast(type, data) {
    logger.info('broadcast', { type, data });
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
        key: readFileSync(`${dirname}/../../config/cert/server.key`),
        cert: readFileSync(`${dirname}/../../config/cert/server.crt`),
    };

    const server = createServer(options);
    server.listen(config.get('webSocketPort'));
    io = socketio(server);
    io.on('connection', socket => {
        logger.info('connected', { id: socket.id });
        socket.emit('hello', {
            version: config.get('version'),
            raspberries: raspberriesManager.getAll(),
        });


        socket.on('raspberry:changeConfig', (id, config, callback) => {
            const newConfig = raspberriesManager.changeConfig(id, config, callback);
            if (!newConfig) {
                callback();
            } else {
                callback(newConfig);
                const raspberry = raspberriesManager.getById(id);
                socket.broadcast.emit('raspberry:update', raspberry);
            }
        });

        socket.on('raspberry:sendAction', (id, action, callback) => {
            raspberriesManager.sendAction(id, action, callback);
        });

        socket.on('raspberry:add', (mac, name, callback) => {
            const newRaspberry = raspberriesManager.add(mac, name);
            if (!newRaspberry) {
                callback(false);
            } else {
                callback(newRaspberry);
                socket.broadcast.emit('raspberry:update', newRaspberry);
            }
        });

        socket.on('disconnect', () => {
            logger.info('disconnected', { id: socket.id });
        });
    });

    io.on('error', logger.error);
}