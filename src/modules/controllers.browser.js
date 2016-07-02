import installController from './install/controller.browser';
import raspberriesController from './raspberries/controller.browser';

const controllers = new Map([
    ['install', installController],
    ['raspberries', raspberriesController],
]);

export default controllers;
