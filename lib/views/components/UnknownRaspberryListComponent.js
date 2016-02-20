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

var _UnknownRaspberryComponent = require('./UnknownRaspberryComponent');

var _UnknownRaspberryComponent2 = _interopRequireDefault(_UnknownRaspberryComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UnknownRaspberryListComponent = (_temp2 = _class = class UnknownRaspberryListComponent extends _react.Component {
    constructor() {
        var _temp;

        return _temp = super(...arguments), this.shouldComponentUpdate = _function2.default, _temp;
    }

    render() {
        var _props = this.props;
        const raspberries = _props.raspberries;
        const saveUnknown = _props.saveUnknown;
        const sendAction = _props.sendAction;

        if (!raspberries.length) {
            return _react2.default.createElement('div', null);
        }

        return _react2.default.createElement(
            'ul',
            { className: 'raspberry-list' },
            raspberries.map(raspberry => _react2.default.createElement(
                'li',
                { key: raspberry.id, className: 'raspberry-item' },
                _react2.default.createElement(_UnknownRaspberryComponent2.default, { raspberry: raspberry, saveUnknown: saveUnknown, sendAction: sendAction })
            ))
        );
    }
}, _class.propTypes = {
    raspberries: _react.PropTypes.array.isRequired,
    saveUnknown: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
}, _temp2);
exports.default = UnknownRaspberryListComponent;
//# sourceMappingURL=UnknownRaspberryListComponent.js.map
