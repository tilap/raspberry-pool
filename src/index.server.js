import Alp from 'alp';
import reactredux from 'alp-react-redux';
import routerBuilder from './common/routerBuilder';
import Html from './views/layouts/Html';
import controllers from './server/controllers';
import { start as startTcpServer } from './server/tcp-server';
import { start as startWebsocket } from './webSocket';

const app = new Alp(__dirname, {
    argv: ['webSocketPort', 'tcpSocketPort'],
});
app.proxy = true;
reactredux(Html)(app);
app.servePublic();
app.catchErrors();
app.useRouter(routerBuilder, controllers);
app.listen();
startTcpServer(app.config);
startWebsocket(app.config);
