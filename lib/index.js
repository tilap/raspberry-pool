'use strict';

var _nightingale = require('nightingale');

var _nightingaleConsole = require('nightingale-console');

var _nightingaleConsole2 = _interopRequireDefault(_nightingaleConsole);

var _alp = require('alp');

var _alp2 = _interopRequireDefault(_alp);

var _alpReactRedux = require('alp-react-redux');

var _alpReactRedux2 = _interopRequireDefault(_alpReactRedux);

var _routerBuilder = require('./common/routerBuilder');

var _routerBuilder2 = _interopRequireDefault(_routerBuilder);

var _Html = require('./views/layouts/Html');

var _Html2 = _interopRequireDefault(_Html);

var _controllers = require('./server/controllers');

var _controllers2 = _interopRequireDefault(_controllers);

var _websocket = require('./server/websocket');

var _config = require('./server/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _nightingale.addGlobalHandler)(new _nightingaleConsole2.default());

const app = new _alp2.default({
    srcDirname: __dirname,
    packageDirname: `${ __dirname }/..`,
    config: _config2.default
});

// config / init
app.proxy = true;
(0, _alpReactRedux2.default)(_Html2.default)(app);

// middlewares
app.servePublic();
app.catchErrors();
app.useRouter(_routerBuilder2.default, _controllers2.default);
app.listen();

(0, _websocket.init)(app);
//# sourceMappingURL=index.js.map
