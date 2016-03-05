import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Actions from './raspberry/ActionsComponent';

export default class HeaderComponent extends Component {
    static propTypes = {
        raspberries: PropTypes.array.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberries, sendAction } = this.props;

        return (<header className="header">
            <Actions raspberries={raspberries} sendAction={sendAction} />
        </header>);
    }
}
