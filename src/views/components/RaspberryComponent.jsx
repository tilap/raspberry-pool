import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Spinner from './SpinnerComponent';
import actions from '../raspberryActions';

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

            {!raspberry.online || !availableActions.length ? '' :
                <div className="actions">
                    <div className="dropdown button">
                        Actions
                        <ul className="list">
                            {availableActions.map(action => (
                                <li key={action.value}
                                    onClick={() => !action.isInProgress(raspberry) && sendAction(raspberry, action.value)}
                                >
                                    {action.name}
                                    <Spinner active={raspberry.actions && raspberry.actions[action.value] === 'sending' || action.isInProgress(raspberry)} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            }

            <fieldset>
                <legend>Config</legend>
                <div className="row row-responsive spaced">
                    <div className="col" style={{ width: '100px', 'flex-basis': '100px', 'flex-grow': 0 }}>
                        <div className="input select">
                            <select
                                id={`raspberry-select-${raspberry.id}`}
                                className={`has-value`}
                            >
                                <option>kweb3</option>
                            </select>
                            <label htmlFor={`raspberry-select-${raspberry.id}`}>Display</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="input text">
                            <input
                                id={`raspberry-url-${raspberry.id}`}
                                type="url" required
                                className={`has-value${url ? '' : ' has-empty-value'}`}
                                value={url}
                                autoComplete="off"
                                onChange={(e) => this.setState({
                                    url: raspberry.data.config.url === e.target.value ? null : e.target.value
                                })}
                            />
                            <label htmlFor={`raspberry-url-${raspberry.id}`}>URL</label>
                        </div>
                    </div>
                </div>

                <div className="button-container center">
                    <button type="button" disabled={raspberry.saving || !this.state.url} onClick={() => {
                        const url = this.state.url;
                        this.setState({ url: null, lastUrl: url });
                        changeConfig(raspberry, { url });
                    }}>Save</button>
                </div>
            </fieldset>
        </div>);
    }
}
