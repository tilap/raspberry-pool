import { newController } from 'alp';
import * as appDescriptor from '../views/index';
import { items as raspberries } from '../data/raspberries';

export default newController({
    index(ctx) {
        return ctx.render(appDescriptor, { raspberries });
    },

    'no-config'(ctx) {
        return ctx.body = 'No config file found for this raspberry';
    },
});
