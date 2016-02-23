export function updateFromAction(action) {
    switch (action) {
        case 'self-update':
            return { updating: true };
        case 'screen-on':
            return { nextExpectedScreenState: 'on' };
        case 'screen-off':
            return { nextExpectedScreenState: 'off' };
    }
}
