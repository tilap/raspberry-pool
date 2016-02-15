export const UPDATE_ALL = 'UPDATE_ALL';
export const ADD_RASPBERRY = 'ADD_RASPBERRY';
export const UPDATE_RASPBERRY = 'UPDATE_RASPBERRY';
export const CHANGE_URL_RASPBERRY = 'CHANGE_URL_RASPBERRY';
export const SAVING_RASPBERRY = 'SAVING_RASPBERRY';
export const SAVED_RASPBERRY = 'SAVED_RASPBERRY';
export const SENDING_ACTION_RASPBERRY = 'SENDING_ACTION_RASPBERRY';
export const ACTION_DONE_RASPBERRY = 'ACTION_DONE_RASPBERRY';

import { patchRaspberry as sendPatchRaspberry, sendAction as sendActionRaspberry } from '../../websocket';

export function updateAll(raspberries) {
    return {
        type: UPDATE_ALL,
        raspberries,
    };
}

export function addRaspberry(raspberry) {
    return {
        type: ADD_RASPBERRY,
        raspberry,
    };
}

export function updateRaspberry(raspberry) {
    return {
        type: UPDATE_RASPBERRY,
        id: raspberry.id,
        raspberry,
    };
}

function savingRaspberry(raspberry) {
    return {
        type: SAVING_RASPBERRY,
        id: raspberry.id,
    };
}

function savedRaspberry(raspberry, changes) {
    return {
        type: SAVED_RASPBERRY,
        id: raspberry.id,
        changes,
    };
}

function sendingActionRaspberry(raspberry, action) {
    return {
        type: SENDING_ACTION_RASPBERRY,
        id: raspberry.id,
        action: action,
    };
}

function actionDoneRaspberry(raspberry, action, result) {
    return {
        type: ACTION_DONE_RASPBERRY,
        id: raspberry.id,
        action: action,
        result: result,
    };
}


export function saveRaspberry(dispatch, raspberry, changes) {
    dispatch(savingRaspberry(raspberry));
    sendPatchRaspberry(raspberry, changes, () => {
        dispatch(savedRaspberry(raspberry, changes));
    });
}

export function sendAction(dispatch, raspberry, action) {
    dispatch(sendingActionRaspberry(raspberry));
    sendActionRaspberry(raspberry, action, (result) => {
        console.log(result)
        dispatch(actionDoneRaspberry(raspberry, action, result));
    });
}
