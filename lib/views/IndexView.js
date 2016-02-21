'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _RaspberryListComponent = require('./components/RaspberryListComponent');

var _RaspberryListComponent2 = _interopRequireDefault(_RaspberryListComponent);

var _UnknownRaspberryListComponent = require('./components/UnknownRaspberryListComponent');

var _UnknownRaspberryListComponent2 = _interopRequireDefault(_UnknownRaspberryListComponent);

var _raspberry = require('./actions/raspberry');

var raspberriesActions = _interopRequireWildcard(_raspberry);

var _index = require('../webSocket/index');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let IndexView = (_temp = _class = class IndexView extends _react.Component {

    constructor(props) {
        super(props);
        this.changeConfig = raspberriesActions.changeConfig.bind(null, props.dispatch);
        this.sendAction = raspberriesActions.sendAction.bind(null, props.dispatch);
        this.saveUnknown = raspberriesActions.saveUnknown.bind(null, props.dispatch);
    }

    componentDidMount() {
        const dispatch = this.props.dispatch;

        this._handlerHello = (0, _index.on)('hello', _ref => {
            let version = _ref.version;
            let raspberries = _ref.raspberries;

            console.log(version);
            if (version !== window.VERSION) {
                return location.reload(true);
            }
            dispatch(raspberriesActions.updateAll(raspberries));
        });
        this._handlerAdd = (0, _index.on)('raspberry:add', raspberry => {
            dispatch(raspberriesActions.add(raspberry));
        });
        this._handlerUpdate = (0, _index.on)('raspberry:update', raspberry => {
            dispatch(raspberriesActions.update(raspberry));
        });
        this._handlerDelete = (0, _index.on)('raspberry:delete', id => {
            dispatch(raspberriesActions.remove(id));
        });
    }

    componentWillUnmount() {
        (0, _index.off)('hello', this._handlerHello);
        (0, _index.off)('raspberry:add', this._handlerAdd);
        (0, _index.off)('raspberry:update', this._handlerUpdate);
        (0, _index.off)('raspberry:delete', this._handlerDelete);
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
            _react2.default.createElement(_UnknownRaspberryListComponent2.default, {
                raspberries: unknownRaspberries,
                saveUnknown: this.saveUnknown,
                sendAction: this.sendAction
            }),
            _react2.default.createElement(_RaspberryListComponent2.default, {
                raspberries: registeredRaspberries,
                changeConfig: this.changeConfig,
                sendAction: this.sendAction
            })
        );
    }
}, _class.propTypes = {
    registeredRaspberries: _react.PropTypes.array.isRequired,
    unknownRaspberries: _react.PropTypes.array.isRequired,
    dispatch: _react.PropTypes.func.isRequired
}, _class.contextTypes = {
    setTitle: _react.PropTypes.func.isRequired,
    context: _react.PropTypes.object.isRequired
}, _temp);
exports.default = (0, _reactRedux.connect)(_ref2 => {
    let raspberries = _ref2.raspberries;
    return {
        registeredRaspberries: raspberries.filter(r => r.registered),
        unknownRaspberries: raspberries.filter(r => !r.registered)
    };
})(IndexView);
//# sourceMappingURL=IndexView.js.map
