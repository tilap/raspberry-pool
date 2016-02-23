'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const actions = [
// { name: 'Test', value: 'test', isVisible: r => true },
{ name: 'Refresh', value: 'refresh', isVisible: r => r.screenState === 'on' }, { name: 'Screen on', value: 'screen-on', isVisible: r => r.screenState === 'off' }, { name: 'Screen off', value: 'screen-off', isVisible: r => r.screenState === 'on' }, { name: 'Update client', value: 'selfUpdate', isVisible: () => true }];

exports.default = actions;
//# sourceMappingURL=raspberryActions.js.map
