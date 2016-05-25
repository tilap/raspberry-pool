'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp2;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _RaspberryComponent = require('./RaspberryComponent');

var _RaspberryComponent2 = _interopRequireDefault(_RaspberryComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let RaspberryListComponent = (_temp2 = _class = class RaspberryListComponent extends _react.Component {
    constructor() {
        var _temp;

        return _temp = super(...arguments), this.shouldComponentUpdate = _function2.default, _temp;
    }

    render() {
        var _props = this.props;
        const raspberries = _props.raspberries;
        const changeConfig = _props.changeConfig;
        const sendAction = _props.sendAction;

        return _react2.default.createElement(
            'ul',
            { className: 'raspberry-list' },
            raspberries.map(raspberry => {
                return _react2.default.createElement(
                    'li',
                    { key: raspberry.id, className: 'raspberry-item' },
                    _react2.default.createElement(_RaspberryComponent2.default, { raspberry: raspberry, changeConfig: changeConfig, sendAction: sendAction })
                );
            })
        );
    }
}, _class.propTypes = {
    raspberries: _react.PropTypes.array.isRequired,
    changeConfig: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
}, _temp2);
exports.default = RaspberryListComponent;
//# sourceMappingURL=RaspberryListComponent.js.map
