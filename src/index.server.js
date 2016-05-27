import { addGlobalHandler } from 'nightingale';
import ConsoleLogger from 'nightingale-console';

addGlobalHandler(new ConsoleLogger());

import Alp from 'alp';
import reactredux from 'alp-react-redux';
import routerBuilder from './common/routerBuilder';
import Html from './views/layouts/Html';
import controllers from './server/controllers';
import { init as websocket } from './server/websocket';

const app = new Alp(
    `${__dirname}/..`,
    __dirname,
    { argv: ['websocket.port'] }
);
app.proxy = true;
reactredux(Html)(app);
app.servePublic();
app.catchErrors();
app.useRouter(routerBuilder, controllers);
app.listen();
websocket(app);
