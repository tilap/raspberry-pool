'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _SpinnerComponent = require('../../common/components/SpinnerComponent');

var _SpinnerComponent2 = _interopRequireDefault(_SpinnerComponent);

var _ActionsComponent = require('./raspberry/ActionsComponent');

var _ActionsComponent2 = _interopRequireDefault(_ActionsComponent);

var _reactAlpTranslate = require('react-alp-translate');

var _reactAlpTranslate2 = _interopRequireDefault(_reactAlpTranslate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RaspberryComponent extends _react.Component {

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

        return _react2.default.createElement(
            'div',
            { className: 'raspberry' },
            _react2.default.createElement(
                'div',
                { className: 'img-container' },
                _react2.default.createElement('img', { alt: 'screenshot', src: `/screenshot.jpg?id=${ raspberry.id }&date=${ Date.now() }` })
            ),
            _react2.default.createElement(
                'div',
                { className: 'header-container' },
                _react2.default.createElement(
                    'h2',
                    { className: 'text-title' },
                    _react2.default.createElement(
                        'span',
                        { className: `screen-status ${ raspberry.online ? raspberry.screenState : 'offline' }`, title: raspberry.screenState === 'on' ? 'On' : 'Off' },
                        _react2.default.createElement('span', { className: 'icon' }),
                        _react2.default.createElement('span', { className: 'status' })
                    ),
                    raspberry.data.name
                )
            ),
            _react2.default.createElement(_SpinnerComponent2.default, { active: raspberry.saving }),
            _react2.default.createElement(
                'div',
                { className: 'status-container' },
                _react2.default.createElement(
                    'span',
                    { className: `raspberry-status label ${ raspberry.online ? 'success' : 'warning' }` },
                    raspberry.online ? `${ raspberry.ip }` : _react2.default.createElement(_reactAlpTranslate2.default, { id: 'raspberry.offline' })
                )
            ),
            _react2.default.createElement(_ActionsComponent2.default, { raspberries: [raspberry], sendAction: sendAction }),
            _react2.default.createElement(
                'fieldset',
                null,
                _react2.default.createElement(
                    'legend',
                    null,
                    _react2.default.createElement(_reactAlpTranslate2.default, { id: 'raspberry.config' })
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
                                    value: display || 'kweb3',
                                    id: `raspberry-select-${ raspberry.id }`,
                                    className: 'has-value',
                                    onChange: e => {
                                        return this.setState({
                                            display: raspberry.data.config.display === e.target.value ? null : e.target.value
                                        });
                                    }
                                },
                                _react2.default.createElement(
                                    'option',
                                    { value: 'kweb3' },
                                    'kweb3'
                                ),
                                _react2.default.createElement(
                                    'option',
                                    { value: 'chromium' },
                                    'chromium'
                                ),
                                _react2.default.createElement(
                                    'option',
                                    { value: 'livestreamer' },
                                    'livestreamer'
                                )
                            ),
                            _react2.default.createElement(
                                'label',
                                { htmlFor: `raspberry-select-${ raspberry.id }` },
                                _react2.default.createElement(_reactAlpTranslate2.default, { id: 'raspberry.display' })
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
                                onChange: e => {
                                    return this.setState({
                                        url: raspberry.data.config.url === e.target.value ? null : e.target.value
                                    });
                                }
                            }),
                            _react2.default.createElement(
                                'label',
                                { htmlFor: `raspberry-url-${ raspberry.id }` },
                                _react2.default.createElement(_reactAlpTranslate2.default, { id: 'raspberry.url' })
                            )
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
                            disabled: raspberry.saving || this.state.url == null && this.state.display == null,
                            onClick: () => {
                                const display = this.state.display || raspberry.data.config.display;
                                const url = this.state.url || raspberry.data.config.url;
                                this.setState({ url: null, lastUrl: url, display: null, lastDisplay: display });
                                changeConfig(raspberry, { display: display, url: url });
                            }
                        },
                        _react2.default.createElement(_reactAlpTranslate2.default, { id: 'raspberry.save' })
                    )
                )
            )
        );
    }
}
exports.default = RaspberryComponent;
RaspberryComponent.propTypes = {
    raspberry: _react.PropTypes.object.isRequired,
    changeConfig: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
};
//# sourceMappingURL=RaspberryComponent.js.map
