'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.emitToRaspberryClient = undefined;
exports.raspberriesBroadcast = raspberriesBroadcast;

var _raspberryClient = require('./raspberryClient');

Object.defineProperty(exports, 'emitToRaspberryClient', {
    enumerable: true,
    get: function get() {
        return _raspberryClient.emit;
    }
});
exports.init = init;

var _alpWebsocket = require('alp-websocket');

var _alpWebsocket2 = _interopRequireDefault(_alpWebsocket);

var _nightingale = require('nightingale');

var _nightingale2 = _interopRequireDefault(_nightingale);

var _raspberries = require('./raspberries');

var _raspberries2 = _interopRequireDefault(_raspberries);

var _raspberryClient2 = _interopRequireDefault(_raspberryClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingale2.default('app.websocket');
let io;
let clientNs;

function raspberriesBroadcast(type, data) {
    logger.info('broadcast', { type: type, data: data });
    clientNs.to('raspberries').emit(type, data);
}

function init(app) {
    io = (0, _alpWebsocket2.default)(app);

    clientNs = io.of('client', socket => {
        return (0, _raspberries2.default)(socket);
    });
    io.of('raspberry-client', socket => {
        return (0, _raspberryClient2.default)(socket);
    });
}
//# sourceMappingURL=index.js.map
