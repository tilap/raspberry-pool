import { newController } from 'alp';
import NoConfigView from './NoConfigView';

export default newController({
    index(ctx) {
        ctx.render({ View: NoConfigView }, { url: ctx.request.origin, ip: ctx.query.ip });
    },
});
