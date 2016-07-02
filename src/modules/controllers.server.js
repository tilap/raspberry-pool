import installController from './install/controller.server';
import noConfigController from './no-config/controller.server';
import raspberriesController from './raspberries/controller.server';

const controllers = new Map([
    ['install', installController],
    ['no-config', noConfigController],
    ['raspberries', raspberriesController],
]);

export default controllers;
