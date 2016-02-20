'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _SpinnerComponent = require('./SpinnerComponent');

var _SpinnerComponent2 = _interopRequireDefault(_SpinnerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

let UnknownRaspberryComponent = (_temp = _class = class UnknownRaspberryComponent extends _react.Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = _function2.default;
        this.state = {};
    }

    render() {
        var _props = this.props;
        const raspberry = _props.raspberry;
        const saveUnknown = _props.saveUnknown;
        const sendAction = _props.sendAction;

        _objectDestructuringEmpty(this.state);

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
                { className: `status label` },
                raspberry.ip
            ),
            _react2.default.createElement(
                'div',
                { className: 'input text' },
                _react2.default.createElement('input', { type: 'text', required: true, autoComplete: 'off',
                    className: `${ this.state.name === undefined ? '' : `has-value${ this.state.name ? '' : ' has-empty-value' }` }`,
                    value: this.state.name,
                    onChange: e => this.setState({ name: e.target.value })
                }),
                _react2.default.createElement(
                    'label',
                    { htmlFor: `raspberry-url-${ raspberry.id }` },
                    'Name'
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'button-container' },
                _react2.default.createElement(
                    'button',
                    { type: 'button', disabled: !this.state.name || !!raspberry.saving, onClick: () => {
                            saveUnknown(raspberry, { name: this.state.name });
                        } },
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
}, _class.propTypes = {
    raspberry: _react.PropTypes.object.isRequired,
    saveUnknown: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
}, _temp);
exports.default = UnknownRaspberryComponent;
//# sourceMappingURL=UnknownRaspberryComponent.js.map
