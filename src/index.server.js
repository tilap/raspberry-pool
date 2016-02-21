import Auk from 'auk';
import serve from 'koa-static';
import convert from 'koa-convert';
import config from 'auk-config';
import errors from 'auk-errors';
import params from 'auk-params';
import language from 'auk-language';
import logger from 'auk-logger';
import translate from 'auk-translate';
import router from 'auk-limosa';
import packageConfig from '../package.json';
import routerBuilder from './routerBuilder';
import reactredux from 'auk-react-redux';
import Html from './views/layouts/Html';

import controllers from './server/controllers';

import { start as startTcpServer } from './server/tcp-server';
import { start as startWebsocket } from './webSocket';

const app = new Auk();
config(`${__dirname}/config`, { packageConfig, argv: ['webSocketPort', 'tcpSocketPort'] })(app);
params(app);
language(app);
logger(app);
translate('locales')(app);
reactredux(Html)(app);
const handler = router(routerBuilder, controllers)(app);

app.use(convert(serve(`${__dirname}/../public/`))); // static files
app.use(errors);
app.use(handler);

app.listen(`${__dirname}/../config/cert`)
    .then((server) => {
        startTcpServer(app.config);
        startWebsocket(app.config);
    })
    .catch(app.logger.error);
