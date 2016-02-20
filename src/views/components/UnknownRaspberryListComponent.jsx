import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import UnknownRaspberry from './UnknownRaspberryComponent';

export default class UnknownRaspberryListComponent extends Component {
    static propTypes = {
        raspberries: PropTypes.array.isRequired,
        saveUnknown: PropTypes.func.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberries, saveUnknown, sendAction } = this.props;

        if (!raspberries.length) {
            return <div/>;
        }

        return (<ul className="raspberry-list">
            {raspberries.map(raspberry => <li key={raspberry.id} className="raspberry-item">
                <UnknownRaspberry raspberry={raspberry} saveUnknown={saveUnknown} sendAction={sendAction} />
            </li>)}
        </ul>);
    }
}
