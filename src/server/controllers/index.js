import siteController from './siteController';
import installScriptsController from './installScriptsController';

const controllers = new Map([
    ['site', siteController],
    ['installScripts', installScriptsController],
]);

export default controllers;
