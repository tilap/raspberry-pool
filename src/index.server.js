import Alp from 'alp';
import reactredux from 'alp-react-redux';
import routerBuilder from './common/routerBuilder';
import Html from './views/layouts/Html';
import controllers from './server/controllers';
import { start as startTcpServer } from './server/tcp-server';
import { init as websocket } from './webSocket';

const app = new Alp(
    `${__dirname}/..`,
    __dirname,
    { argv: ['webSocket.port', 'tcpSocket.port'] }
);
app.proxy = true;
reactredux(Html)(app);
app.servePublic();
app.catchErrors();
app.useRouter(routerBuilder, controllers);
app.listen();
startTcpServer(app.config);
websocket(app);
