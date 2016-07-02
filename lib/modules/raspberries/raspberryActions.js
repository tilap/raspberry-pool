'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const actions = [
// { name: 'Test', value: 'test', isVisible: r => true },
{ name: 'Refresh', value: 'refresh',
    isVisible: r => {
        return r.screenState === 'on';
    },
    isInProgress: r => {
        return false;
    }
}, { name: 'Screen on', value: 'screen-on',
    isVisible: r => {
        return r.screenState === 'off';
    },
    isInProgress: r => {
        return r.nextExpectedScreenState === 'on';
    }
}, { name: 'Screen off', value: 'screen-off',
    isVisible: r => {
        return r.screenState === 'on';
    },
    isInProgress: r => {
        return r.nextExpectedScreenState === 'off';
    }
}, { name: 'Update client', value: 'self-update',
    isVisible: r => {
        return true;
    },
    isInProgress: r => {
        return !!r.updating;
    }
}];

exports.default = actions;
//# sourceMappingURL=raspberryActions.js.map
