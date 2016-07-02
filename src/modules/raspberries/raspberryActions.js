const actions = [
    // { name: 'Test', value: 'test', isVisible: r => true },
    { name: 'Refresh', value: 'refresh',
        isVisible: r => r.screenState === 'on',
        isInProgress: r => false,
    },
    { name: 'Screen on', value: 'screen-on',
        isVisible: r => r.screenState === 'off',
        isInProgress: r => r.nextExpectedScreenState === 'on',
    },
    { name: 'Screen off', value: 'screen-off',
        isVisible: r => r.screenState === 'on',
        isInProgress: r => r.nextExpectedScreenState === 'off',
    },
    { name: 'Update client', value: 'self-update',
        isVisible: r => true,
        isInProgress: r => !!r.updating,
    },
];

export default actions;
