import { createAction } from 'alp-react-redux';

import * as websocket from '../../../websocket';

export const updateAll = createAction('UPDATE_ALL_RASPBERRIES', 'raspberries');
export const add = createAction('ADD_RASPBERRY', 'raspberry');
export const update = createAction('UPDATE_RASPBERRY', raspberry => ({ id: raspberry.id, raspberry }));
export const remove = createAction('REMOVE_RASPBERRY', 'id');
export const screenshotUpdated = createAction('SCREENSHOT_UPDATED', 'id,screenshotDate');
export const saving = createAction('SAVING_RASPBERRY', raspberry => ({ id: raspberry.id }));
export const saved = createAction('SAVED_RASPBERRY', (raspberry, changes) => ({ id: raspberry.id, changes }));
export const sendingAction = createAction(
    'SENDING_ACTION_RASPBERRY',
    (raspberry, action) => ({ id: raspberry.id, action })
);
export const actionSent = createAction(
    'ACTION_SENT_RASPBERRY',
    (raspberry, action, result) => ({ id: raspberry.id, action, result })
);


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
