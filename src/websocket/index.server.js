import websocket from 'alp-websocket';
import raspberries from '../modules/raspberries/websocket/raspberries.server';
import raspberryClient from '../modules/raspberries/websocket/raspberryClient.server';

export function init(app) {
    const io = websocket(app);
    raspberries(io);
    raspberryClient(io);
}
