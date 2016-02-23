const actions = [
    // { name: 'Test', value: 'test', isVisible: r => true },
    { name: 'Refresh', value: 'refresh', isVisible: r => r.screenState === 'on' },
    { name: 'Screen on', value: 'screen-on', isVisible: r => r.screenState === 'off' },
    { name: 'Screen off', value: 'screen-off', isVisible: r => r.screenState === 'on' },
    { name: 'Update client', value: 'self-update', isVisible: () => true },
];

export default actions;
