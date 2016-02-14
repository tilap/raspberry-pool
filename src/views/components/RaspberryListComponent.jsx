import React, { Component, PropTypes } from 'react';
import Raspberry from './RaspberryComponent';

export default class RaspberryListComponent extends Component {
    static propTypes = {
        raspberries: PropTypes.array.isRequired,
        save: PropTypes.func.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    render() {
        const { raspberries, save, sendAction } = this.props;
        return (<ul className="raspberry-list">
            {raspberries.map(raspberry => <li key={raspberry.id} className="raspberry-item">
                <Raspberry raspberry={raspberry} save={save} sendAction={sendAction} />
            </li>)}
        </ul>);
    }
}
