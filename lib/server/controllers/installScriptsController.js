'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alpController = require('alp-controller');

var _alpController2 = _interopRequireDefault(_alpController);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const installScriptsDir = `${ __dirname }/../../../install-scripts/`;
const date = new Date();
const CONFIG_PLACEHOLDER = '### SERVER CONFIG WILL BE INJECTED HERE ###';

const scripts = new Map((0, _fs.readdirSync)(installScriptsDir).filter(filename => filename.endsWith('.sh')).map(filename => [filename.slice(0, -3), (0, _fs.readFileSync)(`${ installScriptsDir }${ filename }`).toString()]));

scripts.get('install-raspberry').replace(CONFIG_PLACEHOLDER, 'URL = ');

exports.default = (0, _alpController2.default)({
    index: function index(ctx) {
        ctx.assert(ctx.method === 'HEAD' || ctx.method === 'GET', 405);
        const scriptName = ctx.route.namedParams.get('scriptName');
        let scriptBody = scripts.get(scriptName);
        ctx.assert(scriptBody, 404);
        ctx.set('Last-Modified', date.toUTCString());

        if (scriptName === 'install-raspberry') {
            scriptBody = scriptBody.replace(CONFIG_PLACEHOLDER, `URL="${ ctx.request.origin }/install-scripts/"`);
        } else if (scriptName === 'install-client') {
            scriptBody = scriptBody.replace(CONFIG_PLACEHOLDER, `SERVER_HOSTNAME="${ ctx.request.origin }"\nSERVER_PORT=${ ctx.app.config.get('tcpSocketPort') }`);
        }

        ctx.body = scriptBody;
    }
});
//# sourceMappingURL=installScriptsController.js.map
