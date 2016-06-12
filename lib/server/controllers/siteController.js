'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alpController = require('alp-controller');

var _alpController2 = _interopRequireDefault(_alpController);

var _raspberries = require('../../views/raspberries');

var raspberriesDescriptor = _interopRequireWildcard(_raspberries);

var _InstallView = require('../../views/InstallView');

var _InstallView2 = _interopRequireDefault(_InstallView);

var _NoConfigView = require('../../views/NoConfigView');

var _NoConfigView2 = _interopRequireDefault(_NoConfigView);

var _raspberriesManager = require('../raspberriesManager');

var raspberriesManager = _interopRequireWildcard(_raspberriesManager);

var _koaSendfile = require('koa-sendfile');

var _koaSendfile2 = _interopRequireDefault(_koaSendfile);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = (0, _alpController2.default)({
    index: function index(ctx) {
        return ctx.render(raspberriesDescriptor, { raspberries: raspberriesManager.getAll() });
    },
    screenshot: function screenshot(ctx) {
        return _asyncToGenerator(function* () {
            const stats = yield (0, _koaSendfile2.default)(ctx, raspberriesManager.screenshotPath(ctx.query.id));
            if (!stats) {
                yield (0, _koaSendfile2.default)(ctx, `${ __dirname }/../../../public/default-screenshot.jpg`);
            }
        })();
    },
    'no-config': function noConfig(ctx) {
        ctx.render({ View: _NoConfigView2.default }, { url: ctx.request.origin, ip: ctx.query.ip });
    },
    install: function install(ctx) {
        ctx.render({ View: _InstallView2.default }, { url: ctx.request.origin });
    }
});
//# sourceMappingURL=siteController.js.map
