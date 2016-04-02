'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.broadcast = broadcast;
exports.init = init;

var _alpWebsocket = require('alp-websocket');

var _alpWebsocket2 = _interopRequireDefault(_alpWebsocket);

var _nightingale = require('nightingale');

var _raspberriesManager = require('../server/raspberriesManager');

var raspberriesManager = _interopRequireWildcard(_raspberriesManager);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale.ConsoleLogger('app.webSocket', _nightingale.LogLevel.INFO);
let io;

function broadcast(type, data) {
    logger.info('broadcast', { type: type, data: data });
    io.to('raspberries').emit(type, data);
}

function init(app) {
    io = (0, _alpWebsocket2.default)(app);

    io.on('connection', socket => {
        socket.on('subscribe:raspberries', callback => {
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
//# sourceMappingURL=index.js.map
