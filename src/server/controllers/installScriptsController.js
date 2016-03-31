import newController from 'alp-controller';
import { readdirSync, readFileSync } from 'fs';

const installScriptsDir = `${__dirname}/../../../install-scripts/`;
const date = new Date();
const CONFIG_PLACEHOLDER = '### SERVER CONFIG WILL BE INJECTED HERE ###';

const scripts = new Map(
    readdirSync(installScriptsDir)
        .filter(filename => filename.endsWith('.sh'))
        .map(filename => [filename.slice(0, -3), readFileSync(`${installScriptsDir}${filename}`).toString()])
);


scripts.get('install-raspberry').replace(CONFIG_PLACEHOLDER, 'URL = ')

export default newController({
    index(ctx) {
        ctx.assert(ctx.method === 'HEAD' || ctx.method === 'GET', 405);
        const scriptName = ctx.route.namedParams.get('scriptName');
        let scriptBody = scripts.get(scriptName);
        ctx.assert(scriptBody, 404);
        ctx.set('Last-Modified', date.toUTCString());

        if (scriptName === 'install-raspberry') {
            scriptBody = scriptBody.replace(CONFIG_PLACEHOLDER, `URL="${ctx.request.origin}"`);
        } else if (scriptName === 'install-client') {
            scriptBody = scriptBody.replace(
                CONFIG_PLACEHOLDER,
                `SERVER_HOSTNAME="${ctx.request.origin}"\nSERVER_PORT=${ctx.app.config.get('tcpSocketPort')}`
            );
        }

        ctx.body = scriptBody;
    },
});
