'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alp = require('alp');

var _NoConfigView = require('./NoConfigView');

var _NoConfigView2 = _interopRequireDefault(_NoConfigView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _alp.newController)({
    index: function index(ctx) {
        ctx.render({ View: _NoConfigView2.default }, { url: ctx.request.origin, ip: ctx.query.ip });
    }
});
//# sourceMappingURL=controller.server.js.map
