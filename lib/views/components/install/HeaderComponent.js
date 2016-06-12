'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = HeaderComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAlpLink = require('react-alp-link');

var _reactAlpLink2 = _interopRequireDefault(_reactAlpLink);

var _reactAlpTranslate = require('react-alp-translate');

var _reactAlpTranslate2 = _interopRequireDefault(_reactAlpTranslate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

HeaderComponent.contextTypes = {
    context: _react.PropTypes.object.isRequired
};

function HeaderComponent(props, _ref) {
    let context = _ref.context;

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
                { to: 'home', className: 'button flat' },
                'Your raspberries'
            )
        )
    );
}
//# sourceMappingURL=HeaderComponent.js.map
