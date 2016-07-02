'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _HeaderComponent = require('./components/HeaderComponent');

var _HeaderComponent2 = _interopRequireDefault(_HeaderComponent);

var _RaspberryListComponent = require('./components/RaspberryListComponent');

var _RaspberryListComponent2 = _interopRequireDefault(_RaspberryListComponent);

var _UnknownRaspberryListComponent = require('./components/UnknownRaspberryListComponent');

var _UnknownRaspberryListComponent2 = _interopRequireDefault(_UnknownRaspberryListComponent);

var _raspberry = require('./actions/raspberry');

var raspberriesActions = _interopRequireWildcard(_raspberry);

var _websocket = require('../../websocket');

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

    componentDidMount() {
        const dispatch = this.props.dispatch;

        if ((0, _websocket.isConnected)()) {
            (0, _websocket.emit)('subscribe:raspberries', _ref => {
                let raspberries = _ref.raspberries;

                dispatch(raspberriesActions.updateAll(raspberries));
            });
        }
        this._handlerConnected = (0, _websocket.on)('connect', () => {
            (0, _websocket.emit)('subscribe:raspberries', _ref2 => {
                let raspberries = _ref2.raspberries;

                dispatch(raspberriesActions.updateAll(raspberries));
            });
        });
    }

    componentWillUnmount() {
        (0, _websocket.emit)('unsubscribe:raspberries');
        (0, _websocket.off)('connect', this._handlerConnected);
    }

    render() {
        var _props = this.props;
        const unknownRaspberries = _props.unknownRaspberries;
        const registeredRaspberries = _props.registeredRaspberries;

        const title = this.context.context.t('raspberry-pool.title');
        this.context.setTitle(title);
        return _react2.default.createElement(
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
exports.default = (0, _reactRedux.connect)(_ref3 => {
    let raspberries = _ref3.raspberries;
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
