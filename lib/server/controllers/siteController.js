'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alp = require('alp');

var _index = require('../../views/index');

var appDescriptor = _interopRequireWildcard(_index);

var _InstallView = require('../../views/InstallView');

var _InstallView2 = _interopRequireDefault(_InstallView);

var _raspberriesManager = require('../raspberriesManager');

var raspberriesManager = _interopRequireWildcard(_raspberriesManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = (0, _alp.newController)({
    index(ctx) {
        return ctx.render(appDescriptor, { raspberries: raspberriesManager.getAll() });
    },

    'no-config'(ctx) {
        return ctx.body = 'No config file found for this raspberry';
    },

    install(ctx) {
        ctx.render({ View: _InstallView2.default }, { url: ctx.request.origin });
    }
});
//# sourceMappingURL=siteController.js.map
