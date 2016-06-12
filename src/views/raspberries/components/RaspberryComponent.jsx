import { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Spinner from '../../components/SpinnerComponent';
import Actions from './raspberry/ActionsComponent';

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
        let display;
        if (this.state.url != null) {
            url = this.state.url;
        } else if (raspberry.saving) {
            url = this.state.lastUrl;
        } else {
            url = raspberry.data.config.url;
        }

        if (this.state.display != null) {
            display = this.state.display;
        } else if (raspberry.saving) {
            display = this.state.lastDisplay;
        } else {
            display = raspberry.data.config.display;
        }

        return (<div className="raspberry">
            <div className="img-container">
                <img alt="screenshot" src={`/screenshot?id=${raspberry.id}&date=${Date.now()}`} />
            </div>
            <div className="header-container">
                <h2 className="text-title">
                    <span className={`screen-status ${raspberry.online ? raspberry.screenState : 'offline'}`} title={raspberry.screenState === 'on' ? 'On' : 'Off'}>
                        <span className="icon" />
                        <span className="status" />
                    </span>
                    {raspberry.data.name}
                </h2>
            </div>
            <Spinner active={raspberry.saving} />

            <div className="status-container">
                <span className={`raspberry-status label ${raspberry.online ? 'success' : 'warning'}`}>
                    {raspberry.online ? `${raspberry.ip}` : 'Offline'}
                </span>
            </div>

            <Actions raspberries={[raspberry]} sendAction={sendAction} />

            <fieldset>
                <legend>Config</legend>
                <div className="row row-responsive spaced">
                    <div className="col" style={{ width: '100px', 'flex-basis': '100px', 'flex-grow': 0 }}>
                        <div className="input select">
                            <select
                                value={display || 'kweb3'}
                                id={`raspberry-select-${raspberry.id}`}
                                className={'has-value'}
                                onChange={(e) => this.setState({
                                    display: raspberry.data.config.display === e.target.value ? null : e.target.value,
                                })}
                            >
                                <option value="kweb3">kweb3</option>
                                <option value="chromium">chromium</option>
                                <option value="livestreamer">livestreamer</option>
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
                                    url: raspberry.data.config.url === e.target.value ? null : e.target.value,
                                })}
                            />
                            <label htmlFor={`raspberry-url-${raspberry.id}`}>URL</label>
                        </div>
                    </div>
                </div>

                <div className="button-container center">
                    <button
                        type="button"
                        disabled={raspberry.saving || (this.state.url == null && this.state.display == null)}
                        onClick={() => {
                            const display = this.state.display || raspberry.data.config.display;
                            const url = this.state.url || raspberry.data.config.url;
                            this.setState({ url: null, lastUrl: url, display: null, lastDisplay: display });
                            changeConfig(raspberry, { display, url });
                        }}
                    >
                        Save
                    </button>
                </div>
            </fieldset>
        </div>);
    }
}
