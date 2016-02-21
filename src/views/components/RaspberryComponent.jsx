import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Spinner from './SpinnerComponent';

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

        return (<div className="raspberry">
            <h2 className="text-title">{raspberry.data.name}</h2>
            <Spinner active={raspberry.saving} />
            <div className="status-container">
                <span className={`status label ${raspberry.online ? 'success' : 'warning'}`}>
                    {raspberry.online ? `${raspberry.ip} ${raspberry.online}` : 'Offline'}
                </span>
                {
                    !raspberry.online ? '' :
                    <span className="screen-status">
                        <span className="icon"/>
                        <span className={`label ${raspberry.screenState === 'on' ? 'success' : 'warning'}`}>
                            {raspberry.screenState === 'on' ? 'On' : 'Off'}
                        </span>
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
                <button type="button" disabled={!raspberry.online || raspberry.refresh === 'sending'}
                        onClick={() => sendAction(raspberry, 'refresh')}>Refresh page on screen</button>
            </div>
        </div>);
    }
}
