import { UPDATE_ALL, ADD_RASPBERRY, UPDATE_RASPBERRY, SAVING_RASPBERRY, SAVED_RASPBERRY, SENDING_ACTION_RASPBERRY, ACTION_DONE_RASPBERRY } from '../actions/raspberry';

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
        case ACTION_DONE_RASPBERRY:
            return {
                ...raspberry,
                ...action.changes,
                actions: {
                    ...raspberry.actions,
                    [action.action]: action.result,
                },
            };
        default:
            return raspberry;
    }
}

export default function raspberries(raspberries = [], action) {
    console.log(action);
    switch (action.type) {
        case ADD_RASPBERRY:
            return [
                ...raspberries,
                raspberry(undefined, action),
            ];
        case UPDATE_ALL:
            return action.raspberries;
        case UPDATE_RASPBERRY:
        case SAVING_RASPBERRY:
        case SAVED_RASPBERRY:
        case SENDING_ACTION_RASPBERRY:
        case ACTION_DONE_RASPBERRY:
            return raspberries.map(r => raspberry(r, action));
        default:
            return raspberries;
    }
}
