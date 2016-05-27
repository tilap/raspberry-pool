import websocket from 'alp-websocket';
import Logger from 'nightingale';

import raspberries from './raspberries';
import raspberryClient from './raspberryClient';

const logger = new Logger('app.websocket');
let io;
let clientNs;

export function raspberriesBroadcast(type, data) {
    logger.info('broadcast', { type, data });
    clientNs.to('raspberries').emit(type, data);
}

export { emit as emitToRaspberryClient } from './raspberryClient';

export function init(app) {
    io = websocket(app);

    clientNs = io.of('client', socket => raspberries(socket));
    io.of('raspberry-client', socket => raspberryClient(socket));
}
