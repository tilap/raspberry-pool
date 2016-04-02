import 'babel-regenerator-runtime';
import Alp from 'alp';
import reactredux from 'alp-react-redux';
import { init as webSocket } from './webSocket/index';
import { init } from 'alauda/web-app';
import controllers from './browser/controllers';
import routerBuilder from './common/routerBuilder';

import * as moduleDescriptor from './views/index';

function ready() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            return resolve();
        }

        document.addEventListener('DOMContentLoaded', () => resolve());
    });
}

ready()
    .then(async function main() {
        const app = new Alp();
        app.appVersion = window.VERSION;
        await app.init();
        webSocket(app);
        const handler = app.createRouter(routerBuilder, controllers);
        await reactredux({
            moduleDescriptor: window.MODULE_IDENTIFIER == 'raspberries-list' ? moduleDescriptor : undefined,
            initialData: window.initialData,
            element: document.getElementById('app'),
        })(app);

        app.use(handler);
        init(url => app.load(url));
        await app.run();
    }).catch(err => console.log(err));
