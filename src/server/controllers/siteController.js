import newController from 'alp-controller';
import * as appDescriptor from '../../views/index';
import InstallView from '../../views/InstallView';
import * as raspberriesManager from '../raspberriesManager';

export default newController({
    index(ctx) {
        return ctx.render(appDescriptor, { raspberries: raspberriesManager.getAll() });
    },

    'no-config'(ctx) {
        return ctx.body = 'No config file found for this raspberry';
    },

    install(ctx) {
        ctx.render({ View: InstallView }, { url: ctx.request.origin });
    },
});
