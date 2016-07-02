'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _ActionsComponent = require('./raspberry/ActionsComponent');

var _ActionsComponent2 = _interopRequireDefault(_ActionsComponent);

var _reactAlpTranslate = require('react-alp-translate');

var _reactAlpTranslate2 = _interopRequireDefault(_reactAlpTranslate);

var _reactAlpLink = require('react-alp-link');

var _reactAlpLink2 = _interopRequireDefault(_reactAlpLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HeaderComponent extends _react.Component {
    constructor() {
        var _temp;

        return _temp = super(...arguments), this.shouldComponentUpdate = _function2.default, _temp;
    }

    render() {
        var _props = this.props;
        const raspberries = _props.raspberries;
        const sendAction = _props.sendAction;


        return _react2.default.createElement(
            'header',
            { className: 'header' },
            _react2.default.createElement(
                'div',
                { className: 'left' },
                _react2.default.createElement(_reactAlpTranslate2.default, { id: 'raspberry-pool.title' })
            ),
            _react2.default.createElement(
                'div',
                { className: 'right' },
                _react2.default.createElement(
                    _reactAlpLink2.default,
                    { to: 'default', params: { controller: 'install' }, className: 'button flat' },
                    _react2.default.createElement(_reactAlpTranslate2.default, { id: 'header.installClientLink' })
                ),
                _react2.default.createElement(_ActionsComponent2.default, { raspberries: raspberries, sendAction: sendAction })
            )
        );
    }
}
exports.default = HeaderComponent;
HeaderComponent.propTypes = {
    raspberries: _react.PropTypes.array,
    sendAction: _react.PropTypes.func.isRequired
};
HeaderComponent.contextTypes = {
    context: _react.PropTypes.object.isRequired
};
//# sourceMappingURL=HeaderComponent.js.map
