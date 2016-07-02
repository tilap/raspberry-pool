import { addGlobalHandler } from 'nightingale';
import ConsoleLogger from 'nightingale-browser-console';

addGlobalHandler(new ConsoleLogger());

import Alp from 'alp';
import reactredux from 'alp-react-redux';
import { init as websocket } from './websocket';
import { init } from 'alauda/web-app';
import controllers from './modules/controllers.browser';
import routerBuilder from './routerBuilder';

import * as moduleDescriptors from './modules';

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
        websocket(app);
        reactredux(document.getElementById('app'))(app);

        const handler = app.createRouter(routerBuilder, controllers);

        if (window.MODULE_IDENTIFIER) {
            await app.initialRender(moduleDescriptors[window.MODULE_IDENTIFIER], window.initialData);
        }

        app.use(handler);
        init(url => app.load(url));
        await app.run();
    }).catch(err => console.log(err));
