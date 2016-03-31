import newController from 'alp-controller';
import * as appDescriptor from '../../views/index';
import InstallView from '../../views/InstallView';
import NoConfigView from '../../views/NoConfigView';
import * as raspberriesManager from '../raspberriesManager';

export default newController({
    index(ctx) {
        return ctx.render(appDescriptor, { raspberries: raspberriesManager.getAll() });
    },

    'no-config'(ctx) {
        ctx.render({ View: NoConfigView }, { url: ctx.request.origin, ip: ctx.query.ip });
    },

    install(ctx) {
        ctx.render({ View: InstallView }, { url: ctx.request.origin });
    },
});
