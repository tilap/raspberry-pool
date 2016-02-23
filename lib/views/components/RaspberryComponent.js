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

var _raspberryActions = require('../raspberryActions');

var _raspberryActions2 = _interopRequireDefault(_raspberryActions);

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

        const availableActions = _raspberryActions2.default.filter(action => action.isVisible(raspberry));

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
                    { className: `raspberry-status label ${ raspberry.online ? 'success' : 'warning' }` },
                    raspberry.online ? `${ raspberry.ip } ${ raspberry.online }` : 'Offline'
                ),
                !raspberry.online ? '' : _react2.default.createElement(
                    'span',
                    { className: 'screen-status', title: raspberry.screenState === 'on' ? 'On' : 'Off' },
                    _react2.default.createElement('span', { className: 'icon' }),
                    _react2.default.createElement('span', { className: `status ${ raspberry.screenState }` })
                )
            ),
            !raspberry.online || !availableActions.length ? '' : _react2.default.createElement(
                'div',
                { className: 'actions' },
                _react2.default.createElement(
                    'div',
                    { className: 'dropdown button' },
                    'Actions',
                    _react2.default.createElement(
                        'ul',
                        { className: 'list' },
                        availableActions.map(action => _react2.default.createElement(
                            'li',
                            { key: action.value,
                                onClick: () => sendAction(raspberry, action.value)
                            },
                            action.name,
                            _react2.default.createElement(_SpinnerComponent2.default, { active: raspberry.actions && raspberry.actions[action.value] === 'sending' })
                        ))
                    )
                )
            ),
            _react2.default.createElement(
                'fieldset',
                null,
                _react2.default.createElement(
                    'legend',
                    null,
                    'Config'
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'row row-responsive spaced' },
                    _react2.default.createElement(
                        'div',
                        { className: 'col', style: { width: '100px', 'flex-basis': '100px', 'flex-grow': 0 } },
                        _react2.default.createElement(
                            'div',
                            { className: 'input select' },
                            _react2.default.createElement(
                                'select',
                                {
                                    id: `raspberry-select-${ raspberry.id }`,
                                    className: `has-value`
                                },
                                _react2.default.createElement(
                                    'option',
                                    null,
                                    'kweb3'
                                )
                            ),
                            _react2.default.createElement(
                                'label',
                                { htmlFor: `raspberry-select-${ raspberry.id }` },
                                'Display'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'col' },
                        _react2.default.createElement(
                            'div',
                            { className: 'input text' },
                            _react2.default.createElement('input', {
                                id: `raspberry-url-${ raspberry.id }`,
                                type: 'url', required: true,
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
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'button-container center' },
                    _react2.default.createElement(
                        'button',
                        { type: 'button', disabled: raspberry.saving || !this.state.url, onClick: () => {
                                const url = this.state.url;
                                this.setState({ url: null, lastUrl: url });
                                changeConfig(raspberry, { url });
                            } },
                        'Save'
                    )
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
