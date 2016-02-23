export const UPDATE_ALL = 'UPDATE_ALL_RASPBERRY';
export const ADD_RASPBERRY = 'ADD_RASPBERRY';
export const UPDATE_RASPBERRY = 'UPDATE_RASPBERRY';
export const REMOVE_RASPBERRY = 'REMOVE_RASPBERRY';
export const SAVING_RASPBERRY = 'SAVING_RASPBERRY';
export const SAVED_RASPBERRY = 'SAVED_RASPBERRY';
export const SENDING_ACTION_RASPBERRY = 'SENDING_ACTION_RASPBERRY';
export const ACTION_DONE_RASPBERRY = 'ACTION_DONE_RASPBERRY';

import * as webSocket from '../../webSocket/index';

export function updateAll(raspberries) {
    return {
        type: UPDATE_ALL,
        raspberries,
    };
}

export function add(raspberry) {
    return {
        type: ADD_RASPBERRY,
        raspberry,
    };
}

export function update(raspberry) {
    return {
        type: UPDATE_RASPBERRY,
        id: raspberry.id,
        raspberry,
    };
}

export function remove(id) {
    return {
        type: REMOVE_RASPBERRY,
        id,
    };
}

function saving(raspberry) {
    return {
        type: SAVING_RASPBERRY,
        id: raspberry.id,
    };
}

function saved(raspberry, changes) {
    return {
        type: SAVED_RASPBERRY,
        id: raspberry.id,
        changes,
    };
}

function sendingAction(raspberry, action) {
    return {
        type: SENDING_ACTION_RASPBERRY,
        id: raspberry.id,
        action: action,
    };
}

function actionDone(raspberry, action, result) {
    return {
        type: ACTION_DONE_RASPBERRY,
        id: raspberry.id,
        action: action,
        result: result,
    };
}


export function changeConfig(dispatch, raspberry, newConfig) {
    dispatch(saving(raspberry));
    webSocket.changeConfig(raspberry, newConfig, () => {
        dispatch(saved(raspberry, { data: { ...raspberry.data, config: newConfig } }));
    });
}

export function sendAction(dispatch, raspberry, action) {
    dispatch(sendingAction(raspberry, action));
    webSocket.sendAction(raspberry, action, (result) => {
        dispatch(actionDone(raspberry, action, result));
    });
}

export function saveUnknown(dispatch, raspberry, { name }) {
    dispatch(saving(raspberry));
    webSocket.registerUnknown(raspberry, name, (raspberry) => {
        if (raspberry) {
            dispatch(saved(raspberry, raspberry));
        }
    });
}

export function broadcastAction(dispatch, raspberries, action) {
    raspberries.forEach(raspberry => dispatch(sendingAction(raspberry, action)));
    webSocket.broadcastAction(raspberries, action, (result) => {
        raspberries.forEach(raspberry => dispatch(actionDone(raspberry, action, result)));
    });
}

