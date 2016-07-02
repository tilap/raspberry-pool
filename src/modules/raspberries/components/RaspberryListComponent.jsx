import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Raspberry from './RaspberryComponent';

export default class RaspberryListComponent extends Component {
    static propTypes = {
        raspberries: PropTypes.array.isRequired,
        changeConfig: PropTypes.func.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberries, changeConfig, sendAction } = this.props;
        return (<ul className="raspberry-list">
            {raspberries.map(raspberry => <li key={raspberry.id} className="raspberry-item">
                <Raspberry raspberry={raspberry} changeConfig={changeConfig} sendAction={sendAction} />
            </li>)}
        </ul>);
    }
}
