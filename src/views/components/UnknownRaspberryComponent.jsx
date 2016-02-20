import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Spinner from './SpinnerComponent';

export default class UnknownRaspberryComponent extends Component {
    static propTypes = {
        raspberry: PropTypes.object.isRequired,
        saveUnknown: PropTypes.func.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberry, saveUnknown, sendAction } = this.props;
        const {} = this.state;

        return (<div className="raspberry unknown">
            <h2 className="text-title">{raspberry.online}</h2>
            <Spinner active={raspberry.saving} />
            <span className={`status label`}>{raspberry.ip}</span>

            <div className="input text">
                <input type="text" required autoComplete="off"
                    className={`${this.state.name === undefined ? '' : `has-value${this.state.name ? '' : ' has-empty-value'}`}`}
                    value={this.state.name}
                    onChange={(e) => this.setState({ name: e.target.value })}
                />
                <label htmlFor={`raspberry-url-${raspberry.id}`}>Name</label>
            </div>

            <div className="button-container">
                <button type="button" disabled={!this.state.name || !!raspberry.saving} onClick={() => {
                    saveUnknown(raspberry, { name: this.state.name });
                }}>Add</button>
            </div>
        </div>);
        /*
                <button type="button" onClick={() => {
                    sendAction(raspberry, 'blink');
                    this.setState({ urlChanged: false });
                }}>Blink</button>
        */
    }
}
