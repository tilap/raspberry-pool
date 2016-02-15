'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ACTION_DONE_RASPBERRY = exports.SENDING_ACTION_RASPBERRY = exports.SAVED_RASPBERRY = exports.SAVING_RASPBERRY = exports.CHANGE_URL_RASPBERRY = exports.UPDATE_RASPBERRY = exports.ADD_RASPBERRY = exports.UPDATE_ALL = undefined;
exports.updateAll = updateAll;
exports.addRaspberry = addRaspberry;
exports.updateRaspberry = updateRaspberry;
exports.saveRaspberry = saveRaspberry;
exports.sendAction = sendAction;

var _websocket = require('../../websocket');

const UPDATE_ALL = exports.UPDATE_ALL = 'UPDATE_ALL';
const ADD_RASPBERRY = exports.ADD_RASPBERRY = 'ADD_RASPBERRY';
const UPDATE_RASPBERRY = exports.UPDATE_RASPBERRY = 'UPDATE_RASPBERRY';
const CHANGE_URL_RASPBERRY = exports.CHANGE_URL_RASPBERRY = 'CHANGE_URL_RASPBERRY';
const SAVING_RASPBERRY = exports.SAVING_RASPBERRY = 'SAVING_RASPBERRY';
const SAVED_RASPBERRY = exports.SAVED_RASPBERRY = 'SAVED_RASPBERRY';
const SENDING_ACTION_RASPBERRY = exports.SENDING_ACTION_RASPBERRY = 'SENDING_ACTION_RASPBERRY';
const ACTION_DONE_RASPBERRY = exports.ACTION_DONE_RASPBERRY = 'ACTION_DONE_RASPBERRY';

function updateAll(raspberries) {
    return {
        type: UPDATE_ALL,
        raspberries
    };
}

function addRaspberry(raspberry) {
    return {
        type: ADD_RASPBERRY,
        raspberry
    };
}

function updateRaspberry(raspberry) {
    return {
        type: UPDATE_RASPBERRY,
        id: raspberry.id,
        raspberry
    };
}

function savingRaspberry(raspberry) {
    return {
        type: SAVING_RASPBERRY,
        id: raspberry.id
    };
}

function savedRaspberry(raspberry, changes) {
    return {
        type: SAVED_RASPBERRY,
        id: raspberry.id,
        changes
    };
}

function sendingActionRaspberry(raspberry, action) {
    return {
        type: SENDING_ACTION_RASPBERRY,
        id: raspberry.id,
        action: action
    };
}

function actionDoneRaspberry(raspberry, action, result) {
    return {
        type: ACTION_DONE_RASPBERRY,
        id: raspberry.id,
        action: action,
        result: result
    };
}

function saveRaspberry(dispatch, raspberry, changes) {
    dispatch(savingRaspberry(raspberry));
    (0, _websocket.patchRaspberry)(raspberry, changes, () => {
        dispatch(savedRaspberry(raspberry, changes));
    });
}

function sendAction(dispatch, raspberry, action) {
    dispatch(sendingActionRaspberry(raspberry));
    (0, _websocket.sendAction)(raspberry, action, result => {
        console.log(result);
        dispatch(actionDoneRaspberry(raspberry, action, result));
    });
}
//# sourceMappingURL=raspberry.js.map
