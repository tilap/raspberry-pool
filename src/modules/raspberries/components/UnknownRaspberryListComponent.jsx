import { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import UnknownRaspberry from './UnknownRaspberryComponent';

export default class UnknownRaspberryListComponent extends Component {
    static propTypes = {
        raspberries: PropTypes.array.isRequired,
        offlineRaspberries: PropTypes.array.isRequired,
        registerUnknown: PropTypes.func.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberries, offlineRaspberries, registerUnknown, sendAction } = this.props;

        if (!raspberries.length) {
            return null;
        }

        return (<ul className="raspberry-list">
            {raspberries.map(raspberry => <li key={raspberry.id} className="raspberry-item">
                <UnknownRaspberry
                    raspberry={raspberry}
                    offlineRaspberries={offlineRaspberries}
                    registerUnknown={registerUnknown}
                    sendAction={sendAction}
                />
            </li>)}
        </ul>);
    }
}
