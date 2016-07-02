'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateFromAction = updateFromAction;
function updateFromAction(action) {
    switch (action) {
        case 'self-update':
            return { updating: true };
        case 'screen-on':
            return { nextExpectedScreenState: 'on' };
        case 'screen-off':
            return { nextExpectedScreenState: 'off' };
    }
}
//# sourceMappingURL=raspberryActionManager.js.map
