'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _alp = require('alp');

var _fs = require('fs');

var _InstallView = require('./InstallView');

var _InstallView2 = _interopRequireDefault(_InstallView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const installScriptsDir = `${ __dirname }/../../../install-scripts/`;
const date = new Date();
const CONFIG_PLACEHOLDER = '### SERVER CONFIG WILL BE INJECTED HERE ###';

const scripts = new Map((0, _fs.readdirSync)(installScriptsDir).filter(filename => {
    return filename.endsWith('.sh');
}).map(filename => {
    return [filename.slice(0, -3), (0, _fs.readFileSync)(`${ installScriptsDir }${ filename }`).toString()];
}));

exports.default = (0, _alp.newController)({
    index: function index(ctx) {
        ctx.render({ View: _InstallView2.default }, { url: ctx.request.origin });
    },
    script: function script(ctx) {
        ctx.assert(ctx.method === 'HEAD' || ctx.method === 'GET', 405);
        const scriptName = ctx.route.namedParams.get('scriptName');
        let scriptBody = scripts.get(scriptName);
        ctx.assert(scriptBody, 404);
        ctx.set('Last-Modified', date.toUTCString());

        if (scriptName === 'install-raspberry') {
            scriptBody = scriptBody.replace(CONFIG_PLACEHOLDER, `URL="${ ctx.request.origin }/install-scripts/"`);
        } else if (scriptName === 'install-client') {
            scriptBody = scriptBody.replace(CONFIG_PLACEHOLDER, `SERVER_HOSTNAME="${ ctx.request.origin }"\nSERVER_PORT=${ ctx.app.config.get('webSocket').get('port') }`);
        }

        ctx.body = scriptBody;
    }
});
//# sourceMappingURL=controller.server.js.map
