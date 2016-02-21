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

let RaspberryComponent = (_temp = _class = class RaspberryComponent extends _react.Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = _function2.default;
        this.state = {};
    }

    render() {
        var _props = this.props;
        const raspberry = _props.raspberry;
        const changeConfig = _props.changeConfig;
        const sendAction = _props.sendAction;

        let url;
        if (this.state.url != null) {
            url = this.state.url;
        } else if (raspberry.saving) {
            url = this.state.lastUrl;
        } else {
            url = raspberry.data.config.url;
        }

        return _react2.default.createElement(
            'div',
            { className: 'raspberry' },
            _react2.default.createElement(
                'h2',
                { className: 'text-title' },
                raspberry.data.name
            ),
            _react2.default.createElement(_SpinnerComponent2.default, { active: raspberry.saving }),
            _react2.default.createElement(
                'div',
                { className: 'status-container' },
                _react2.default.createElement(
                    'span',
                    { className: `status label ${ raspberry.online ? 'success' : 'warning' }` },
                    raspberry.online ? `${ raspberry.ip } ${ raspberry.online }` : 'Offline'
                ),
                !raspberry.online ? '' : _react2.default.createElement(
                    'span',
                    { className: 'screen-status' },
                    _react2.default.createElement('span', { className: 'icon' }),
                    _react2.default.createElement(
                        'span',
                        { className: `label ${ raspberry.screenState === 'on' ? 'success' : 'warning' }` },
                        raspberry.screenState === 'on' ? 'On' : 'Off'
                    )
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'input text' },
                _react2.default.createElement('input', { type: 'url', required: true,
                    className: `has-value${ url ? '' : ' has-empty-value' }`,
                    value: url,
                    autoComplete: 'off',
                    onChange: e => this.setState({
                        url: raspberry.data.config.url === e.target.value ? null : e.target.value
                    })
                }),
                _react2.default.createElement(
                    'label',
                    { htmlFor: `raspberry-url-${ raspberry.id }` },
                    'URL'
                )
            ),
            _react2.default.createElement(
                'div',
                { className: 'button-container' },
                _react2.default.createElement(
                    'button',
                    { type: 'button', disabled: raspberry.saving || !this.state.url, onClick: () => {
                            const url = this.state.url;
                            this.setState({ url: null, lastUrl: url });
                            changeConfig(raspberry, { url });
                        } },
                    'Save'
                ),
                _react2.default.createElement(
                    'button',
                    { type: 'button', disabled: !raspberry.online || raspberry.refresh === 'sending',
                        onClick: () => sendAction(raspberry, 'refresh') },
                    'Refresh page on screen'
                )
            )
        );
    }
}, _class.propTypes = {
    raspberry: _react.PropTypes.object.isRequired,
    changeConfig: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
}, _temp);
exports.default = RaspberryComponent;
//# sourceMappingURL=RaspberryComponent.js.map
