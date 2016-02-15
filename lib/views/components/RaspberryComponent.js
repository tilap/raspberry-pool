'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp;

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SpinnerComponent = require('./SpinnerComponent');

var _SpinnerComponent2 = _interopRequireDefault(_SpinnerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let RaspberryComponent = (_temp = _class = class RaspberryComponent extends _react.Component {

    constructor(props) {
        super(props);
        this.shouldComponentUpdate = _function2.default;
        this.state = { urlChanged: false };
    }

    render() {
        var _props = this.props;
        const raspberry = _props.raspberry;
        const save = _props.save;
        const sendAction = _props.sendAction;
        const urlChanged = this.state.urlChanged;

        const url = urlChanged || raspberry.saving ? this.state.url : raspberry.url;

        return _react2.default.createElement(
            'div',
            { className: 'raspberry' },
            _react2.default.createElement(
                'h2',
                { className: 'text-title' },
                raspberry.name
            ),
            _react2.default.createElement(_SpinnerComponent2.default, { active: raspberry.saving }),
            _react2.default.createElement(
                'span',
                { className: `status label ${ raspberry.online ? 'success' : 'warning' }` },
                raspberry.online ? Object.keys(raspberry.networks).map(mac => raspberry.networks[mac].ip).filter(Boolean).join(', ') : 'Offline'
            ),
            _react2.default.createElement(
                'span',
                { className: 'text-caption' },
                raspberry.mac
            ),
            _react2.default.createElement(
                'div',
                { className: 'input text' },
                _react2.default.createElement('input', { type: 'url', required: true,
                    value: url,
                    onChange: e => this.setState({ urlChanged: true, url: e.target.value })
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
                    { type: 'button', disabled: raspberry.saving || url == raspberry.url, onClick: () => {
                            save(raspberry, { url });
                            this.setState({ urlChanged: false });
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
    save: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
}, _temp);
exports.default = RaspberryComponent;
//# sourceMappingURL=RaspberryComponent.js.map
