import {
    UPDATE_ALL,
    ADD_RASPBERRY,
    UPDATE_RASPBERRY,
    REMOVE_RASPBERRY,
    SCREENSHOT_UPDATED,
    SAVING_RASPBERRY,
    SAVED_RASPBERRY,
    SENDING_ACTION_RASPBERRY,
    ACTION_SENT_RASPBERRY,
} from '../actions/raspberry';
import { updateFromAction } from '../../../common/raspberryActionManager';

function raspberry(raspberry, action) {
    if (action.type === ADD_RASPBERRY) {
        return action.raspberry;
    }

    if (raspberry.id !== action.id) {
        return raspberry;
    }

    switch (action.type) {
        case UPDATE_RASPBERRY:
            return action.raspberry;
        case SCREENSHOT_UPDATED:
            return { ...raspberry };
        case SAVING_RASPBERRY:
            return {
                ...raspberry,
                saving: true,
            };
        case SAVED_RASPBERRY:
            return {
                ...raspberry,
                ...action.changes,
                saving: false,
            };
        case SENDING_ACTION_RASPBERRY:
            return {
                ...raspberry,
                ...action.changes,
                actions: {
                    ...raspberry.actions,
                    [action.action]: 'sending',
                },
            };
        case ACTION_SENT_RASPBERRY:
            return {
                ...raspberry,
                ...action.changes,
                actions: {
                    ...raspberry.actions,
                    [action.action]: null,
                },
                ...updateFromAction(action.action),
            };
        default:
            return raspberry;
    }
}

export default function raspberries(raspberries = [], action) {
    switch (action.type) {
        case ADD_RASPBERRY:
            return [
                ...raspberries,
                raspberry(undefined, action),
            ];
        case REMOVE_RASPBERRY:
            return raspberries.filter(r => r.id !== action.id);
        case UPDATE_ALL:
            return action.raspberries;
        case UPDATE_RASPBERRY:
        case SCREENSHOT_UPDATED:
        case SAVING_RASPBERRY:
        case SAVED_RASPBERRY:
        case SENDING_ACTION_RASPBERRY:
        case ACTION_SENT_RASPBERRY:
            return raspberries.map(r => raspberry(r, action));
        default:
            return raspberries;
    }
}
