'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = InstallView;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _HeaderComponent = require('../common/components/install/HeaderComponent');

var _HeaderComponent2 = _interopRequireDefault(_HeaderComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

InstallView.propTypes = {
    url: _react.PropTypes.string.isRequired
};

InstallView.contextTypes = {
    setTitle: _react.PropTypes.func.isRequired,
    setMeta: _react.PropTypes.func.isRequired
};

function InstallView(_ref, _ref2) {
    let url = _ref.url;
    let setTitle = _ref2.setTitle;
    let setMeta = _ref2.setMeta;

    setTitle('How to install raspberry client');
    setMeta('description', 'Install a raspberry to make it work with raspberry-pool');

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
//# sourceMappingURL=InstallView.js.map
