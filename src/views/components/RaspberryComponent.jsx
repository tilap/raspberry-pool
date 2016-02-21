import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Spinner from './SpinnerComponent';

const actions = [
    { name: 'Blink', value: 'blink', isVisible: r => true },
    { name: 'Refresh', value: 'refresh', isVisible: r => r.screenState === 'on' },
    { name: 'Screen on', value: 'screen-on', isVisible: r => r.screenState === 'off' },
    { name: 'Screen off', value: 'screen-off', isVisible: r => r.screenState === 'on' },
];

export default class RaspberryComponent extends Component {
    static propTypes = {
        raspberry: PropTypes.object.isRequired,
        changeConfig: PropTypes.func.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberry, changeConfig, sendAction } = this.props;

        let url;
        if (this.state.url != null) {
            url = this.state.url;
        } else if (raspberry.saving) {
            url = this.state.lastUrl;
        } else {
            url = raspberry.data.config.url;
        }

        const availableActions = actions.filter(action => action.isVisible(raspberry));

        return (<div className="raspberry">
            <h2 className="text-title">
                {raspberry.data.name}
            </h2>
            <Spinner active={raspberry.saving} />

            {!raspberry.online || !actions.length ? '' :
                <div className="actions">
                    <div className="dropdown button">
                        Actions
                        <ul className="list">
                            {availableActions.map(action => (
                                <li key={action.value}
                                    onClick={() => sendAction(raspberry, action.value)}
                                >
                                    {action.name}
                                    <Spinner active={raspberry.actions && raspberry.actions[action.value] === 'sending'} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            }

            <div className="status-container">
                <span className={`raspberry-status label ${raspberry.online ? 'success' : 'warning'}`}>
                    {raspberry.online ? `${raspberry.ip} ${raspberry.online}` : 'Offline'}
                </span>
                {
                    !raspberry.online ? '' :
                    <span className="screen-status" title={raspberry.screenState === 'on' ? 'On' : 'Off'}>
                        <span className="icon" />
                        <span className={`status ${raspberry.screenState}`} />
                    </span>
                }
            </div>

            <div className="input text">
                <input type="url" required
                    className={`has-value${url ? '' : ' has-empty-value'}`}
                    value={url}
                    autoComplete="off"
                    onChange={(e) => this.setState({
                        url: raspberry.data.config.url === e.target.value ? null : e.target.value
                    })}
                />
                <label htmlFor={`raspberry-url-${raspberry.id}`}>URL</label>
            </div>

            <div className="button-container">
                <button type="button" disabled={raspberry.saving || !this.state.url} onClick={() => {
                    const url = this.state.url;
                    this.setState({ url: null, lastUrl: url });
                    changeConfig(raspberry, { url });
                }}>Save</button>
            </div>
        </div>);
    }
}
