'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = init;

var _alpWebsocket = require('alp-websocket');

var _alpWebsocket2 = _interopRequireDefault(_alpWebsocket);

var _raspberries = require('../modules/raspberries/websocket/raspberries.server');

var _raspberries2 = _interopRequireDefault(_raspberries);

var _raspberryClient = require('../modules/raspberries/websocket/raspberryClient.server');

var _raspberryClient2 = _interopRequireDefault(_raspberryClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
    const io = (0, _alpWebsocket2.default)(app);
    (0, _raspberries2.default)(io);
    (0, _raspberryClient2.default)(io);
}
//# sourceMappingURL=index.js.map
