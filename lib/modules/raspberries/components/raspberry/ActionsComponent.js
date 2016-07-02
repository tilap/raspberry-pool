'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _function = require('react-pure-render/function');

var _function2 = _interopRequireDefault(_function);

var _raspberryActions = require('../../raspberryActions');

var _raspberryActions2 = _interopRequireDefault(_raspberryActions);

var _SpinnerComponent = require('../../../common/components/SpinnerComponent');

var _SpinnerComponent2 = _interopRequireDefault(_SpinnerComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ActionsComponent extends _react.Component {
    constructor() {
        var _temp;

        return _temp = super(...arguments), this.shouldComponentUpdate = _function2.default, _temp;
    }

    render() {
        var _props = this.props;
        const raspberries = _props.raspberries;
        const sendAction = _props.sendAction;


        if (!raspberries || !raspberries.length) {
            return _react2.default.createElement('div', { className: 'actions' });
        }

        const availableActions = _raspberryActions2.default.map(action => {
            return _extends({}, action, {
                raspberries: raspberries.filter(r => {
                    return r.online && action.isVisible(r);
                })
            });
        }).filter(action => {
            return action.raspberries.length > 0;
        });

        if (!availableActions.length) {
            return _react2.default.createElement('div', { className: 'actions' });
        }

        return _react2.default.createElement(
            'div',
            { className: 'actions dropdown button' },
            'Actions',
            _react2.default.createElement(
                'ul',
                { className: 'list' },
                availableActions.map(action => {
                    return _react2.default.createElement(
                        'li',
                        {
                            key: action.value,
                            onClick: () => {
                                const raspberries = action.raspberries.filter(raspberry => {
                                    return !action.isInProgress(raspberry);
                                });
                                if (raspberries.length) {
                                    return sendAction(raspberries, action.value);
                                }
                            }
                        },
                        action.name,
                        _react2.default.createElement(_SpinnerComponent2.default, {
                            active: !!raspberries.filter(raspberry => {
                                return raspberry.actions && raspberry.actions[action.value] === 'sending' || action.isInProgress(raspberry);
                            }).length
                        })
                    );
                })
            )
        );
    }
}
exports.default = ActionsComponent;
ActionsComponent.propTypes = {
    raspberries: _react.PropTypes.array.isRequired,
    sendAction: _react.PropTypes.func.isRequired
};
//# sourceMappingURL=ActionsComponent.js.map
