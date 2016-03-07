'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let InstallView = (_temp = _class = class InstallView extends _react.Component {

    render() {
        const url = this.props.url;

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'div',
                null,
                'Raspberries - picture'
            ),
            _react2.default.createElement(
                'pre',
                null,
                `curl ${ url }/install-client.sh | sh`
            )
        );
    }
}, _class.propTypes = {
    url: _react.PropTypes.string.isRequired
}, _temp);
exports.default = InstallView;
//# sourceMappingURL=InstallView.js.map
