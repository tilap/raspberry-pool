import { newController } from 'alp';
import * as raspberriesDescriptor from './';
import * as raspberriesManager from './raspberriesManager.server';
import send from 'koa-sendfile';

export default newController({
    index(ctx) {
        return ctx.render(raspberriesDescriptor, { raspberries: raspberriesManager.getAll() });
    },

    screenshot: async (ctx) => {
        const stats = await send(ctx, raspberriesManager.screenshotPath(ctx.query.id));
        if (!stats) {
            await send(ctx, `${__dirname}/../../../public/default-screenshot.jpg`);
        }
    },
});
