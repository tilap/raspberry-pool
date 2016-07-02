import { newController } from 'alp';
import InstallView from './InstallView';

export default newController({
    index(ctx) {
        ctx.render({ View: InstallView }, { url: ctx.request.origin });
    },
});
