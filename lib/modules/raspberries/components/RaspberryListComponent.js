'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _RaspberryComponent = require('./RaspberryComponent');

var _RaspberryComponent2 = _interopRequireDefault(_RaspberryComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RaspberryListComponent extends _react.Component {
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
}
exports.default = RaspberryListComponent;
RaspberryListComponent.propTypes = {
    raspberries: _react.PropTypes.array.isRequired,
    changeConfig: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
};
//# sourceMappingURL=RaspberryListComponent.js.map
