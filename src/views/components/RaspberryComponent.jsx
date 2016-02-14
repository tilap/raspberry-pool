import shouldPureComponentUpdate from 'react-pure-render/function';
import React, { Component, PropTypes } from 'react';
import Spinner from './SpinnerComponent';

export default class RaspberryComponent extends Component {
    static propTypes = {
        raspberry: PropTypes.object.isRequired,
        save: PropTypes.func.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = { urlChanged: false };
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberry, save, sendAction } = this.props;
        const { urlChanged } = this.state;
        const url = urlChanged || raspberry.saving ? this.state.url : raspberry.url;

        return (<div className="raspberry">
            <h2 className="text-title">{raspberry.name}</h2>
            <Spinner active={raspberry.saving} />
            <span className={`status label ${raspberry.online ? 'success' : 'warning'}`}>
                {raspberry.online ? Object.keys(raspberry.networks).map(mac => raspberry.networks[mac].ip).filter(Boolean).join(', ') : 'Offline'}
            </span>
            <span className="text-caption">{raspberry.mac}</span>

            <div className="input text">
                <input type="url" required
                  value={url}
                  onChange={(e) => this.setState({ urlChanged: true, url: e.target.value })}
                />
                <label htmlFor={`raspberry-url-${raspberry.id}`}>URL</label>
            </div>

            <div className="button-container">
                <button type="button" disabled={raspberry.saving || url == raspberry.url} onClick={() => {
                    save(raspberry, { url });
                    this.setState({ urlChanged: false });
                }}>Save</button>
                <button type="button" disabled={!raspberry.online} onClick={() => sendAction(raspberry, 'refresh')}>Refresh page on screen</button>
            </div>
        </div>);
    }
}
