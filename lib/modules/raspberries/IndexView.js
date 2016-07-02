'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _alpReactRedux = require('alp-react-redux');

var _HeaderComponent = require('./components/HeaderComponent');

var _HeaderComponent2 = _interopRequireDefault(_HeaderComponent);

var _RaspberryListComponent = require('./components/RaspberryListComponent');

var _RaspberryListComponent2 = _interopRequireDefault(_RaspberryListComponent);

var _UnknownRaspberryListComponent = require('./components/UnknownRaspberryListComponent');

var _UnknownRaspberryListComponent2 = _interopRequireDefault(_UnknownRaspberryListComponent);

var _raspberry = require('./actions/raspberry');

var raspberriesActions = _interopRequireWildcard(_raspberry);

var _reactAlpSubscribeContainer = require('react-alp-subscribe-container');

var _reactAlpSubscribeContainer2 = _interopRequireDefault(_reactAlpSubscribeContainer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IndexView extends _react.Component {

    constructor(props) {
        super(props);
        this.changeConfig = function () {
            return props.dispatch(raspberriesActions.changeConfig(...arguments));
        };
        this.sendAction = function () {
            return props.dispatch(raspberriesActions.sendAction(...arguments));
        };
        this.registerUnknown = function () {
            return props.dispatch(raspberriesActions.registerUnknown(...arguments));
        };
    }

    render() {
        var _props = this.props;
        const dispatch = _props.dispatch;
        const unknownRaspberries = _props.unknownRaspberries;
        const registeredRaspberries = _props.registeredRaspberries;

        const title = this.context.context.t('raspberry-pool.title');
        this.context.setTitle(title);
        return _react2.default.createElement(
            _reactAlpSubscribeContainer2.default,
            { name: 'raspberries', dispatch: dispatch },
            _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_HeaderComponent2.default, {
                    raspberries: registeredRaspberries,
                    sendAction: this.sendAction
                }),
                _react2.default.createElement(_UnknownRaspberryListComponent2.default, {
                    raspberries: unknownRaspberries,
                    offlineRaspberries: registeredRaspberries.filter(r => {
                        return !r.online;
                    }),
                    registerUnknown: this.registerUnknown,
                    sendAction: this.sendAction
                }),
                _react2.default.createElement(_RaspberryListComponent2.default, {
                    raspberries: registeredRaspberries,
                    changeConfig: this.changeConfig,
                    sendAction: this.sendAction
                })
            )
        );
    }
}

IndexView.propTypes = {
    registeredRaspberries: _react.PropTypes.array.isRequired,
    unknownRaspberries: _react.PropTypes.array.isRequired,
    dispatch: _react.PropTypes.func.isRequired
};
IndexView.contextTypes = {
    setTitle: _react.PropTypes.func.isRequired,
    context: _react.PropTypes.object.isRequired
};
exports.default = (0, _alpReactRedux.connect)(_ref => {
    let raspberries = _ref.raspberries;
    return {
        registeredRaspberries: raspberries.filter(r => {
            return r.registered;
        }),
        unknownRaspberries: raspberries.filter(r => {
            return !r.registered;
        })
    };
})(IndexView);
//# sourceMappingURL=IndexView.js.map
