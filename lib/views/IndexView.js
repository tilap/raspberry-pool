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

var _raspberry = require('./actions/raspberry');

var _websocket = require('../websocket');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let IndexView = (_temp = _class = class IndexView extends _react.Component {

    constructor(props) {
        super(props);
        this.save = _raspberry.saveRaspberry.bind(null, props.dispatch);
        this.sendAction = _raspberry.sendAction.bind(null, props.dispatch);
    }

    componentDidMount() {
        const dispatch = this.props.dispatch;

        this._handlerUpdateAll = (0, _websocket.on)('update all', _ref => {
            let raspberries = _ref.raspberries;

            dispatch((0, _raspberry.updateAll)(raspberries));
        });
        this._handlerOnline = (0, _websocket.on)('raspberry online', _ref2 => {
            let raspberry = _ref2.raspberry;

            dispatch((0, _raspberry.updateRaspberry)(raspberry));
        });
        this._handlerOffline = (0, _websocket.on)('raspberry offline', _ref3 => {
            let raspberry = _ref3.raspberry;

            dispatch((0, _raspberry.updateRaspberry)(raspberry));
        });
        this._handlerPatch = (0, _websocket.on)('update raspberry', _ref4 => {
            let raspberry = _ref4.raspberry;

            dispatch((0, _raspberry.updateRaspberry)(raspberry));
        });
    }

    componentWillUnmount() {
        (0, _websocket.off)('update all', this._handlerUpdateAll);
        (0, _websocket.off)('raspberry online', this._handlerOnline);
        (0, _websocket.off)('raspberry offline', this._handlerOffline);
        (0, _websocket.off)('update raspberry', this._handlerPatch);
    }

    render() {
        const raspberries = this.props.raspberries;

        const title = this.context.context.t('raspberry-pool.title');
        this.context.setTitle(title);
        return _react2.default.createElement(_RaspberryListComponent2.default, { raspberries: raspberries, save: this.save, sendAction: this.sendAction });
    }
}, _class.propTypes = {
    raspberries: _react.PropTypes.array.isRequired,
    dispatch: _react.PropTypes.func.isRequired
}, _class.contextTypes = {
    setTitle: _react.PropTypes.func.isRequired,
    context: _react.PropTypes.object.isRequired
}, _temp);
exports.default = (0, _reactRedux.connect)(_ref5 => {
    let raspberries = _ref5.raspberries;
    return { raspberries };
})(IndexView);
//# sourceMappingURL=IndexView.js.map
