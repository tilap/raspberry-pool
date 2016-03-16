import newController from 'alp-controller';
import * as appDescriptor from '../../views/index';
import InstallView from '../../views/InstallView';

export default newController({
    index(ctx) {
        return ctx.render(appDescriptor, { raspberries: [] });
    },

    install(ctx) {
        ctx.render({ View: InstallView }, { url: location.origin });
    },
});
