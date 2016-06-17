import { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Spinner from '../../components/SpinnerComponent';
import T from 'react-alp-translate';

export default class UnknownRaspberryComponent extends Component {
    static propTypes = {
        raspberry: PropTypes.object.isRequired,
        offlineRaspberries: PropTypes.array.isRequired,
        saveUnknown: PropTypes.func.isRequired,
        sendAction: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate = shouldPureComponentUpdate;

    render() {
        const { raspberry, saveUnknown, offlineRaspberries } = this.props;

        return (<div className="raspberry unknown">
            <h2 className="text-title">{raspberry.online}</h2>
            <Spinner active={raspberry.saving} />
            <span className={'status label'}>{raspberry.ip}</span>


            <div className="row row-responsive spaced">
                <div className="col wp-50">
                    <div className="text-paragraph-title"><T key="unknownRaspberry.title" /></div>
                    <div className="input text">
                        <input
                            type="text"
                            required
                            autoComplete="off"
                            className={`${this.state.name === undefined ? '' : `has-value${this.state.name ? '' : ' has-empty-value'}`}`}
                            value={this.state.name}
                            onChange={(e) => this.setState({ name: e.target.value })}
                        />
                        <label htmlFor={`raspberry-url-${raspberry.id}`}>Name</label>
                    </div>
                </div>
                {!offlineRaspberries.length ? '' :
                    <div className="col wp-50">
                        <div className="text-paragraph-title"><T key="unknownRaspberry.addToExisting" /></div>
                        <div className="input radio">
                            <input
                                id={`add-raspberry-${raspberry.id}`}
                                name="addOrReplace"
                                type="radio"
                                defaultChecked
                                value="add"
                                onChange={(e) => this.setState({ addOrReplace: e.target.value })}
                            />
                            <label htmlFor={`add-raspberry-${raspberry.id}`}><T key="unknownRaspberry.add" /></label>
                        </div>
                        <div className="input radio">
                            <input
                                id={`replace-raspberry-${raspberry.id}`}
                                name="addOrReplace"
                                type="radio"
                                value="replace"
                                onChange={(e) => this.setState({ addOrReplace: e.target.value })}
                            />
                            <label htmlFor={`replace-raspberry-${raspberry.id}`}><T key="unknownRaspberry.replace" /></label>
                        </div>
                        <select name="raspberry" onChange={(e) => this.setState({ id: e.target.value })}>
                            {!this.state.id && <option key="__empty"></option>}
                            {offlineRaspberries.map(r => <option key={r.id} value={r.id}>{r.data.name}</option>)}
                        </select>
                    </div>
                }
            </div>

            <div className="button-container center">
                <button
                    type="button"
                    disabled={!(this.state.name || this.state.id) || !!raspberry.saving}
                    onClick={() => {
                        saveUnknown(raspberry, {
                            name: this.state.name,
                            id: this.state.id,
                            addOrReplace: this.state.addOrReplace || (this.state.id && 'add'),
                        });
                    }}
                >
                    Add
                </button>
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
