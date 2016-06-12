'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = raspberries;

var _raspberry = require('../actions/raspberry');

var _raspberryActionManager = require('../../../common/raspberryActionManager');

function raspberry(raspberry, action) {
    if (action.type === _raspberry.ADD_RASPBERRY) {
        return action.raspberry;
    }

    if (raspberry.id !== action.id) {
        return raspberry;
    }

    switch (action.type) {
        case _raspberry.UPDATE_RASPBERRY:
            return action.raspberry;
        case _raspberry.SCREENSHOT_UPDATED:
            return _extends({}, raspberry);
        case _raspberry.SAVING_RASPBERRY:
            return _extends({}, raspberry, {
                saving: true
            });
        case _raspberry.SAVED_RASPBERRY:
            return _extends({}, raspberry, action.changes, {
                saving: false
            });
        case _raspberry.SENDING_ACTION_RASPBERRY:
            return _extends({}, raspberry, action.changes, {
                actions: _extends({}, raspberry.actions, {
                    [action.action]: 'sending'
                })
            });
        case _raspberry.ACTION_SENT_RASPBERRY:
            return _extends({}, raspberry, action.changes, {
                actions: _extends({}, raspberry.actions, {
                    [action.action]: null
                })
            }, (0, _raspberryActionManager.updateFromAction)(action.action));
        default:
            return raspberry;
    }
}

function raspberries() {
    let raspberries = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    let action = arguments[1];

    switch (action.type) {
        case _raspberry.ADD_RASPBERRY:
            return [...raspberries, raspberry(undefined, action)];
        case _raspberry.REMOVE_RASPBERRY:
            return raspberries.filter(r => {
                return r.id !== action.id;
            });
        case _raspberry.UPDATE_ALL:
            return action.raspberries;
        case _raspberry.UPDATE_RASPBERRY:
        case _raspberry.SCREENSHOT_UPDATED:
        case _raspberry.SAVING_RASPBERRY:
        case _raspberry.SAVED_RASPBERRY:
        case _raspberry.SENDING_ACTION_RASPBERRY:
        case _raspberry.ACTION_SENT_RASPBERRY:
            return raspberries.map(r => {
                return raspberry(r, action);
            });
        default:
            return raspberries;
    }
}
//# sourceMappingURL=raspberries.js.map
