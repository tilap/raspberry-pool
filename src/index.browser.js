import 'babel-regenerator-runtime';
import Ibex from 'ibex';
import config from 'ibex-config';
import language from 'ibex-language';
import logger from 'ibex-logger';
import reactredux from 'ibex-react-redux';
import translate from 'ibex-translate';
import { start as startWebSocket } from './webSocket/index';
// import 'text'; //to remove

import * as appDescriptor from './views/index';

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
        console.log('ready');
        const app = new Ibex();
        app.appVersion = window.VERSION;
        await config('config')(app);
        logger(app);
        startWebSocket(app.config);
        language(app);
        await translate('locales')(app);
        await reactredux({
            appDescriptor,
            initialData: window.initialData,
            element: document.getElementById('app'),
        })(app);

        await app.run();
    }).catch(err => console.log(err));
