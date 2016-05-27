'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = init;

var _raspberriesManager = require('../raspberriesManager');

var raspberriesManager = _interopRequireWildcard(_raspberriesManager);

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const logger = new _nightingale2.default('app.websocket.raspberries');

function init(socket) {
    logger.info('connected');

    socket.on('disconnect', () => {
        logger.info('disconnected');
    });

    socket.on('subscribe:raspberries', callback => {
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
        logger.info('sendAction raspberry', { ids: ids, action: action });
        ids.forEach(id => {
            const raspberry = raspberriesManager.sendAction(id, action);
            if (raspberry) {
                socket.broadcast.to('raspberries').emit('raspberry:update', raspberry);
            }
        });
        callback();
    });

    socket.on('raspberry:add', (mac, info, callback) => {
        logger.info('register raspberry', { mac: mac, info: info });
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
//# sourceMappingURL=raspberries.js.map
