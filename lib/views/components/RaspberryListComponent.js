'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RaspberryComponent = require('./RaspberryComponent');

var _RaspberryComponent2 = _interopRequireDefault(_RaspberryComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let RaspberryListComponent = (_temp = _class = class RaspberryListComponent extends _react.Component {

    render() {
        var _props = this.props;
        const raspberries = _props.raspberries;
        const save = _props.save;
        const sendAction = _props.sendAction;

        return _react2.default.createElement(
            'ul',
            { className: 'raspberry-list' },
            raspberries.map(raspberry => _react2.default.createElement(
                'li',
                { key: raspberry.id, className: 'raspberry-item' },
                _react2.default.createElement(_RaspberryComponent2.default, { raspberry: raspberry, save: save, sendAction: sendAction })
            ))
        );
    }
}, _class.propTypes = {
    raspberries: _react.PropTypes.array.isRequired,
    save: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
}, _temp);
exports.default = RaspberryListComponent;
//# sourceMappingURL=RaspberryListComponent.js.map
