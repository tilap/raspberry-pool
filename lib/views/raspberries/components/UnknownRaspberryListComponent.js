'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _UnknownRaspberryComponent = require('./UnknownRaspberryComponent');

var _UnknownRaspberryComponent2 = _interopRequireDefault(_UnknownRaspberryComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UnknownRaspberryListComponent extends _react.Component {
    constructor() {
        var _temp;

        return _temp = super(...arguments), this.shouldComponentUpdate = _function2.default, _temp;
    }

    render() {
        var _props = this.props;
        const raspberries = _props.raspberries;
        const offlineRaspberries = _props.offlineRaspberries;
        const saveUnknown = _props.saveUnknown;
        const sendAction = _props.sendAction;


        if (!raspberries.length) {
            return null;
        }

        return _react2.default.createElement(
            'ul',
            { className: 'raspberry-list' },
            raspberries.map(raspberry => {
                return _react2.default.createElement(
                    'li',
                    { key: raspberry.id, className: 'raspberry-item' },
                    _react2.default.createElement(_UnknownRaspberryComponent2.default, {
                        raspberry: raspberry,
                        offlineRaspberries: offlineRaspberries,
                        saveUnknown: saveUnknown,
                        sendAction: sendAction
                    })
                );
            })
        );
    }
}
exports.default = UnknownRaspberryListComponent;
UnknownRaspberryListComponent.propTypes = {
    raspberries: _react.PropTypes.array.isRequired,
    offlineRaspberries: _react.PropTypes.array.isRequired,
    saveUnknown: _react.PropTypes.func.isRequired,
    sendAction: _react.PropTypes.func.isRequired
};
//# sourceMappingURL=UnknownRaspberryListComponent.js.map
