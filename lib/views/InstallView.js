'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _HeaderComponent = require('./components/install/HeaderComponent');

var _HeaderComponent2 = _interopRequireDefault(_HeaderComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let InstallView = (_temp = _class = class InstallView extends _react.Component {

    render() {
        this.context.setTitle('How to install raspberry client');
        this.context.setMeta('description', 'Install a raspberry to make it work with raspberry-pool');

        const url = this.props.url;

        return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(_HeaderComponent2.default, null),
            _react2.default.createElement('div', { className: 'install-picture' }),
            _react2.default.createElement(
                'div',
                { className: 'container-fixed' },
                _react2.default.createElement(
                    'h1',
                    { className: 'page-title' },
                    'How to install raspberry-client on your raspberry ?'
                ),
                _react2.default.createElement(
                    'h2',
                    null,
                    '1. Install raspbian (wheezy or jessie)'
                ),
                _react2.default.createElement(
                    'h2',
                    null,
                    '2. Install your new raspberry'
                ),
                _react2.default.createElement(
                    'pre',
                    null,
                    `curl ${ url }/install-scripts/install-raspberry.sh | sh`
                )
            )
        );
    }
}, _class.propTypes = {
    url: _react.PropTypes.string.isRequired
}, _class.contextTypes = {
    setTitle: _react.PropTypes.func.isRequired,
    setMeta: _react.PropTypes.func.isRequired,
    context: _react.PropTypes.object.isRequired
}, _temp);
exports.default = InstallView;
//# sourceMappingURL=InstallView.js.map
