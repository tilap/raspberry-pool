/* global MODERN_BROWSERS */
if (!MODERN_BROWSERS) {
    // eslint-disable-next-line global-require
    require('babel-regenerator-runtime');
}

import { addGlobalHandler } from 'nightingale';
import ConsoleLogger from 'nightingale-browser-console';

addGlobalHandler(new ConsoleLogger());

import Alp from 'alp';
import reactredux from 'alp-react-redux';
import { init as websocket } from './browser/websocket';
import { init } from 'alauda/web-app';
import controllers from './browser/controllers';
import routerBuilder from './common/routerBuilder';

import * as moduleDescriptors from './views/modules';

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
        reactredux(document.getElementById('app'))(app);
        websocket(app);

        const handler = app.createRouter(routerBuilder, controllers);
        await app.initialRender(moduleDescriptors[window.MODULE_IDENTIFIER], window.initialData);

        app.use(handler);
        init(url => app.load(url));
        await app.run();
    }).catch(err => console.log(err));
