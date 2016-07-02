import { newController } from 'alp';
import * as raspberriesDescriptor from './';

export default newController({
    index(ctx) {
        return ctx.render(raspberriesDescriptor, { raspberries: [] });
    },
});
