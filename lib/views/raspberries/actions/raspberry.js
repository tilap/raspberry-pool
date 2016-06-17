'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.actionSent = exports.sendingAction = exports.saved = exports.saving = exports.screenshotUpdated = exports.remove = exports.update = exports.add = exports.updateAll = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.changeConfig = changeConfig;
exports.sendAction = sendAction;
exports.saveUnknown = saveUnknown;

var _alpReactRedux = require('alp-react-redux');

var _websocket = require('../../../websocket');

var websocket = _interopRequireWildcard(_websocket);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const updateAll = exports.updateAll = (0, _alpReactRedux.createAction)('UPDATE_ALL_RASPBERRIES', 'raspberries');
const add = exports.add = (0, _alpReactRedux.createAction)('ADD_RASPBERRY', 'raspberry');
const update = exports.update = (0, _alpReactRedux.createAction)('UPDATE_RASPBERRY', raspberry => {
    return { id: raspberry.id, raspberry: raspberry };
});
const remove = exports.remove = (0, _alpReactRedux.createAction)('REMOVE_RASPBERRY', 'id');
const screenshotUpdated = exports.screenshotUpdated = (0, _alpReactRedux.createAction)('SCREENSHOT_UPDATED', 'id,screenshotDate');
const saving = exports.saving = (0, _alpReactRedux.createAction)('SAVING_RASPBERRY', raspberry => {
    return { id: raspberry.id };
});
const saved = exports.saved = (0, _alpReactRedux.createAction)('SAVED_RASPBERRY', (raspberry, changes) => {
    return { id: raspberry.id, changes: changes };
});
const sendingAction = exports.sendingAction = (0, _alpReactRedux.createAction)('SENDING_ACTION_RASPBERRY', (raspberry, action) => {
    return { id: raspberry.id, action: action };
});
const actionSent = exports.actionSent = (0, _alpReactRedux.createAction)('ACTION_SENT_RASPBERRY', (raspberry, action, result) => {
    return { id: raspberry.id, action: action, result: result };
});

function changeConfig(dispatch, raspberry, newConfig) {
    dispatch(saving(raspberry));
    websocket.changeConfig(raspberry, newConfig, () => {
        dispatch(saved(raspberry, { data: _extends({}, raspberry.data, { config: newConfig }) }));
    });
}

function sendAction(dispatch, raspberries, action) {
    raspberries.forEach(raspberry => {
        return dispatch(sendingAction(raspberry, action));
    });
    websocket.sendAction(raspberries, action, result => {
        raspberries.forEach(raspberry => {
            return dispatch(actionSent(raspberry, action, result));
        });
    });
}

function saveUnknown(dispatch, raspberry, _ref) {
    let name = _ref.name;
    let addOrReplace = _ref.addOrReplace;
    let id = _ref.id;

    dispatch(saving(raspberry));
    console.log('registerUnknown', raspberry);
    websocket.registerUnknown(raspberry, { name: name, addOrReplace: addOrReplace, id: id }, newRaspberry => {
        console.log('registerUnknown :)', newRaspberry);
        if (newRaspberry) {
            if (newRaspberry.id !== raspberry.id) {
                dispatch(remove(raspberry.id));
                dispatch(update(newRaspberry));
            } else {
                dispatch(saved(newRaspberry, newRaspberry));
            }
        }
    });
}
//# sourceMappingURL=raspberry.js.map
