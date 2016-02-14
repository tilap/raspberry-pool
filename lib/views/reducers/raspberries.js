'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = raspberries;

var _raspberry = require('../actions/raspberry');

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
        case _raspberry.ACTION_DONE_RASPBERRY:
            return _extends({}, raspberry, action.changes, {
                actions: _extends({}, raspberry.actions, {
                    [action.action]: action.result
                })
            });
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
        case _raspberry.UPDATE_ALL:
            return action.raspberries;
        case _raspberry.UPDATE_RASPBERRY:
        case _raspberry.SAVING_RASPBERRY:
        case _raspberry.SAVED_RASPBERRY:
            return raspberries.map(r => raspberry(r, action));
        default:
            return raspberries;
    }
}
//# sourceMappingURL=raspberries.js.map
