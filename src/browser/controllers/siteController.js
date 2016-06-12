import newController from 'alp-controller';
import * as raspberriesDescriptor from '../../views/raspberries';
import InstallView from '../../views/InstallView';

export default newController({
    index(ctx) {
        return ctx.render(raspberriesDescriptor, { raspberries: [] });
    },

    install(ctx) {
        ctx.render({ View: InstallView }, { url: location.origin });
    },
});
