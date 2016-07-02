'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alp = require('alp');

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const config = new _alp.Config(`${ __dirname }/config/`);
config.loadSync({
    packageConfig: _package2.default,
    argv: ['webSocket.port']
});

exports.default = config;
//# sourceMappingURL=config.server.js.map
