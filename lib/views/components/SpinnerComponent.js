'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let SpinnerComponent = (_temp = _class = class SpinnerComponent extends _react.Component {

    render() {
        return _react2.default.createElement(
            'div',
            { className: `spinner${ this.props.active ? ' active' : '' }` },
            _react2.default.createElement('div', { className: 'double-bounce1' }),
            _react2.default.createElement('div', { className: 'double-bounce2' })
        );
    }
}, _class.propTypes = {
    active: _react.PropTypes.bool
}, _temp);
exports.default = SpinnerComponent;
//# sourceMappingURL=SpinnerComponent.js.map
