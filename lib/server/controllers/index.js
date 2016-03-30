'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _siteController = require('./siteController');

var _siteController2 = _interopRequireDefault(_siteController);

var _installScriptsController = require('./installScriptsController');

var _installScriptsController2 = _interopRequireDefault(_installScriptsController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const controllers = new Map([['site', _siteController2.default], ['installScripts', _installScriptsController2.default]]);

exports.default = controllers;
//# sourceMappingURL=index.js.map
