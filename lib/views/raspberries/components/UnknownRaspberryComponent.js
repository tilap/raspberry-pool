'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _SpinnerComponent = require('../../components/SpinnerComponent');

var _SpinnerComponent2 = _interopRequireDefault(_SpinnerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UnknownRaspberryComponent extends _react.Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = _function2.default;
        this.state = {};
    }

    render() {
        var _props = this.props;
        const raspberry = _props.raspberry;
        const saveUnknown = _props.saveUnknown;
        const offlineRaspberries = _props.offlineRaspberries;


        return _react2.default.createElement(
            'div',
            { className: 'raspberry unknown' },
            _react2.default.createElement(
                'h2',
                { className: 'text-title' },
                raspberry.online
            ),
            _react2.default.createElement(_SpinnerComponent2.default, { active: raspberry.saving }),
            _react2.default.createElement(
                'span',
                { className: 'status label' },
                raspberry.ip
            ),
            _react2.default.createElement(
                'div',
                { className: 'row row-responsive spaced' },
                _react2.default.createElement(
                    'div',
                    { className: 'col wp-50' },
                    _react2.default.createElement(
                        'div',
                        { className: 'text-paragraph-title' },
                        'Add a new Raspberry'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'input text' },
                        _react2.default.createElement('input', {
                            type: 'text',
                            required: true,
                            autoComplete: 'off',
                            className: `${ this.state.name === undefined ? '' : `has-value${ this.state.name ? '' : ' has-empty-value' }` }`,
                            value: this.state.name,
                            onChange: e => {
                                return this.setState({ name: e.target.value });
                            }
                        }),
                        _react2.default.createElement(
                            'label',
                            { htmlFor: `raspberry-url-${ raspberry.id }` },
                            'Name'
                        )
                    )
                ),
                !offlineRaspberries.length ? '' : _react2.default.createElement(
                    'div',
                    { className: 'col wp-50' },
                    _react2.default.createElement(
                        'div',
                        { className: 'text-paragraph-title' },
                        'Add to existing raspberry'
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'input radio' },
                        _react2.default.createElement('input', {
                            id: `add-raspberry-${ raspberry.id }`,
                            name: 'addOrReplace',
                            type: 'radio',
                            defaultChecked: true,
                            value: 'add',
                            onChange: e => {
                                return this.setState({ addOrReplace: e.target.value });
                            }
                        }),
                        _react2.default.createElement(
                            'label',
                            { htmlFor: `add-raspberry-${ raspberry.id }` },
                            'Add'
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'input radio' },
                        _react2.default.createElement('input', {
                            id: `replace-raspberry-${ raspberry.id }`,
                            name: 'addOrReplace',
                            type: 'radio',
                            value: 'replace',
                            onChange: e => {
                                return this.setState({ addOrReplace: e.target.value });
                            }
                        }),
                        _react2.default.createElement(
                            'label',
                            { htmlFor: `replace-raspberry-${ raspberry.id }` },
                            'Replace'
                        )
                    ),
                    _react2.default.createElement(
                        'select',
                        { name: 'raspberry', onChange: e => {
                                return this.setState({ id: e.target.value });
                            } },
                        !this.state.id && _react2.default.createElement('option', { key: '__empty' }),
                        offlineRaspberries.map(r => {
                            return _react2.default.createElement(
                                'option',
                                { key: r.id, value: r.id },
                                r.data.name
                            );
                        })
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'button-container center' },
                _react2.default.createElement(
                    'button',
                    {
                        type: 'button',
                        disabled: !(this.state.name || this.state.id) || !!raspberry.saving,
                        onClick: () => {
                            saveUnknown(raspberry, {
                                name: this.state.name,
                                id: this.state.id,
                                addOrReplace: this.state.addOrReplace || this.state.id && 'add'
                            });
                        }
                    },
                    'Add'
                )
            )
        );
        /*
                <button type="button" onClick={() => {
                    sendAction(raspberry, 'blink');
                    this.setState({ urlChanged: false });
                }}>Blink</button>
        */
    }
}
exports.default = UnknownRaspberryComponent;
UnknownRaspberryComponent.propTypes = {
    raspberry: _react.PropTypes.object.isRequired,
    offlineRaspberries: _react.PropTypes.array.isRequired,
    saveUnknown: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
};
//# sourceMappingURL=UnknownRaspberryComponent.js.map
