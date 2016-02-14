'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alp = require('alp');

var _index = require('../views/index');

var appDescriptor = _interopRequireWildcard(_index);

var _raspberries = require('../data/raspberries');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = (0, _alp.newController)({
    index(ctx) {
        return ctx.render(appDescriptor, { raspberries: _raspberries.items });
    },

    'no-config'(ctx) {
        return ctx.body = 'No config file found for this raspberry';
    }
});
//# sourceMappingURL=siteController.js.map
