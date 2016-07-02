'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = SpinnerComponent;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

SpinnerComponent.propTypes = {
    active: _react.PropTypes.bool
};

function SpinnerComponent(_ref) {
    let active = _ref.active;

    return _react2.default.createElement(
        'div',
        { className: `spinner${ active ? ' active' : '' }` },
        _react2.default.createElement('div', { className: 'double-bounce1' }),
        _react2.default.createElement('div', { className: 'double-bounce2' })
    );
}
//# sourceMappingURL=SpinnerComponent.js.map
