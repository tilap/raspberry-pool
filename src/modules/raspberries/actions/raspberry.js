import { createAction } from 'alp-react-redux';

export const updateAll = createAction('UPDATE_ALL_RASPBERRIES', 'raspberries');
export const add = createAction('ADD_RASPBERRY', 'raspberry');
export const update = createAction('UPDATE_RASPBERRY', raspberry => ({ id: raspberry.id, raspberry }));
export const updateConfig = createAction(
    'UPDATE_RASPBERRY_CONFIG',
    (raspberry, config) => ({ id: raspberry.id, config }),
);
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

export function changeConfig(raspberry, newConfig) {
    return async (dispatch, { websocket }) => {
        dispatch(saving(raspberry));
        const configSaved = await websocket.emit('raspberry:changeConfig', raspberry.id, newConfig);
        dispatch(updateConfig(raspberry, configSaved));
        dispatch(saved(raspberry, { data: { ...raspberry.data, config: configSaved } }));
    };
}

export function sendAction(raspberries, action) {
    return async (dispatch, { websocket }) => {
        raspberries.forEach(raspberry => dispatch(sendingAction(raspberry, action)));
        const result = await websocket.emit('raspberry:sendAction', raspberries.map(r => r.id), action);
        raspberries.forEach(raspberry => dispatch(actionSent(raspberry, action, result)));
    };
}

export function registerUnknown(raspberry, { name, addOrReplace, id }) {
    return async (dispatch, { websocket }) => {
        dispatch(saving(raspberry));
        const newRaspberry = await websocket.emit('raspberry:registerUnknown', raspberry.id, { name, addOrReplace, id });
        if (newRaspberry) {
            if (newRaspberry.id !== raspberry.id) {
                dispatch(remove(raspberry.id));
                dispatch(update(newRaspberry));
            } else {
                dispatch(saved(newRaspberry, newRaspberry));
            }
        }
    };
}
