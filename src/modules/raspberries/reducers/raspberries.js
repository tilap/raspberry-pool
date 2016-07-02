import { createReducer } from 'alp-react-redux';

import {
    updateAll,
    add,
    update,
    updateConfig,
    remove,
    screenshotUpdated,
    saving,
    saved,
    sendingAction,
    actionSent,
} from '../actions/raspberry';
import { updateFromAction } from '../raspberryActionManager';

const raspberryReducer = createReducer({
    [update]: (state, { raspberry }) => raspberry,
    [updateConfig]: (raspberry, { config }) => ({ ...raspberry, data: { ...raspberry.data, config } }),
    [remove]: (state, { raspberry }) => raspberry,
    [screenshotUpdated]: raspberry => ({ ...raspberry }),
    [saving]: raspberry => ({ ...raspberry, saving: true }),
    [saved]: (raspberry) => ({ ...raspberry, saving: false }),
    [sendingAction]: (raspberry, { changes, action }) => ({
        ...raspberry,
        ...changes,
        actions: {
            ...raspberry.actions,
            [action]: 'sending',
        },
    }),
    [actionSent]: (raspberry, { changes, action }) => ({
        ...raspberry,
        ...changes,
        actions: {
            ...raspberry.actions,
            [action]: null,
        },
        ...updateFromAction(action),
    }),
});

const raspberryHandler = (raspberries, action) => {
    if (!action.id) throw new Error(`Missing action.id, ${action.type}`);
    return raspberries.map(raspberry => {
        if (raspberry.id !== action.id) return raspberry;
        return raspberryReducer(raspberry, action);
    });
};

export default createReducer(() => [], {
    [updateAll]: (state, { raspberries }): Array => raspberries,
    [add]: (raspberries, { raspberry }) => [...raspberries, raspberry],
    [remove]: (raspberries, { id }) => raspberries.filter(r => r.id !== id),
    [update]: raspberryHandler,
    [updateConfig]: raspberryHandler,
    [screenshotUpdated]: raspberryHandler,
    [saving]: raspberryHandler,
    [saved]: raspberryHandler,
    [sendingAction]: raspberryHandler,
    [actionSent]: raspberryHandler,
});
