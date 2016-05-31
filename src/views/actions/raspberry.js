export const UPDATE_ALL = 'UPDATE_ALL_RASPBERRY';
export const ADD_RASPBERRY = 'ADD_RASPBERRY';
export const UPDATE_RASPBERRY = 'UPDATE_RASPBERRY';
export const REMOVE_RASPBERRY = 'REMOVE_RASPBERRY';
export const SCREENSHOT_UPDATED = 'SCREENSHOT_UPDATED';
export const SAVING_RASPBERRY = 'SAVING_RASPBERRY';
export const SAVED_RASPBERRY = 'SAVED_RASPBERRY';
export const SENDING_ACTION_RASPBERRY = 'SENDING_ACTION_RASPBERRY';
export const ACTION_SENT_RASPBERRY = 'ACTION_SENT_RASPBERRY';

import * as websocket from '../../websocket';

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

export function screenshotUpdated(id, screenshotDate) {
    return {
        type: SCREENSHOT_UPDATED,
        id,
        screenshotDate,
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

function actionSent(raspberry, action, result) {
    return {
        type: ACTION_SENT_RASPBERRY,
        id: raspberry.id,
        action: action,
        result: result,
    };
}


export function changeConfig(dispatch, raspberry, newConfig) {
    dispatch(saving(raspberry));
    websocket.changeConfig(raspberry, newConfig, () => {
        dispatch(saved(raspberry, { data: { ...raspberry.data, config: newConfig } }));
    });
}

export function sendAction(dispatch, raspberries, action) {
    raspberries.forEach(raspberry => dispatch(sendingAction(raspberry, action)));
    websocket.sendAction(raspberries, action, (result) => {
        raspberries.forEach(raspberry => dispatch(actionSent(raspberry, action, result)));
    });
}

export function saveUnknown(dispatch, raspberry, { name, addOrReplace, id }) {
    dispatch(saving(raspberry));
    console.log('registerUnknown', raspberry);
    websocket.registerUnknown(raspberry, { name, addOrReplace, id }, (newRaspberry) => {
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
