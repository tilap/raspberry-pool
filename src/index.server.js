import { addGlobalHandler } from 'nightingale';
import ConsoleLogger from 'nightingale-console';

addGlobalHandler(new ConsoleLogger());

import Alp from 'alp';
import reactredux from 'alp-react-redux';
import routerBuilder from './routerBuilder';
import Html from './modules/common/layouts/Html';
import controllers from './modules/controllers.server';
import { init as websocket } from './websocket';
import config from './config.server';

const app = new Alp({
    srcDirname: __dirname,
    packageDirname: `${__dirname}/..`,
    config,
});

// config / init
app.proxy = true;
app.DATA_PATH = `${__dirname}/../data/`;
reactredux(Html)(app);

// middlewares
app.servePublic();
app.catchErrors();
app.useRouter(routerBuilder, controllers);
app.listen();

websocket(app);
