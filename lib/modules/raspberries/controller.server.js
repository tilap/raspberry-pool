'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alp = require('alp');

var _ = require('./');

var raspberriesDescriptor = _interopRequireWildcard(_);

var _raspberriesManager = require('./raspberriesManager.server');

var raspberriesManager = _interopRequireWildcard(_raspberriesManager);

var _koaSendfile = require('koa-sendfile');

var _koaSendfile2 = _interopRequireDefault(_koaSendfile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = (0, _alp.newController)({
    index: function index(ctx) {
        return ctx.render(raspberriesDescriptor, { raspberries: raspberriesManager.getAll() });
    },


    screenshot: (() => {
        var ref = _asyncToGenerator(function* (ctx) {
            const stats = yield (0, _koaSendfile2.default)(ctx, raspberriesManager.screenshotPath(ctx.query.id));
            if (!stats) {
                yield (0, _koaSendfile2.default)(ctx, `${ __dirname }/../../../public/default-screenshot.jpg`);
            }
        });

        return function screenshot(_x) {
            return ref.apply(this, arguments);
        };
    })()
});
//# sourceMappingURL=controller.server.js.map
