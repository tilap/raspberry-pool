import { newController } from 'alp';
import * as appDescriptor from '../../views/index';
import * as raspberriesManager from '../raspberriesManager';

export default newController({
    index(ctx) {
        return ctx.render(appDescriptor, { raspberries: raspberriesManager.getAll() });
    },

    'no-config'(ctx) {
        return ctx.body = 'No config file found for this raspberry';
    },
});
