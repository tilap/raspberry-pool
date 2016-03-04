import Auk from 'auk';
import reactredux from 'auk-react-redux';
import routerBuilder from './routerBuilder';
import Html from './views/layouts/Html';
import controllers from './server/controllers';
import { start as startTcpServer } from './server/tcp-server';
import { start as startWebsocket } from './webSocket';

const app = new Auk(__dirname, {
    argv: ['webSocketPort', 'tcpSocketPort'],
});
reactredux(Html)(app);
app.servePublic();
app.catchErrors();
app.useRouter(routerBuilder, controllers);
app.listen();
startTcpServer(app.config);
startWebsocket(app.config);
