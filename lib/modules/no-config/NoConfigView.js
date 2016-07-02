'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Simple = require('../common/layouts/Simple');

var _Simple2 = _interopRequireDefault(_Simple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NoConfigView extends _react.Component {

    render() {
        this.context.setTitle('No Config');

        var _props = this.props;
        const url = _props.url;
        const ip = _props.ip;

        return _react2.default.createElement(
            'div',
            { className: 'no-config' },
            _react2.default.createElement('div', { className: 'install-picture' }),
            _react2.default.createElement(
                'div',
                { className: 'container-fixed' },
                _react2.default.createElement(
                    'h1',
                    { className: 'page-title' },
                    'Not configured'
                ),
                _react2.default.createElement(
                    'p',
                    null,
                    'Go to ',
                    _react2.default.createElement(
                        'a',
                        { href: url },
                        url
                    ),
                    ' to configure this raspberry'
                ),
                !ip ? '' : _react2.default.createElement(
                    'p',
                    { className: 'ip' },
                    'IP: ',
                    ip
                )
            )
        );
    }
}
exports.default = NoConfigView;
NoConfigView.Layout = _Simple2.default;
NoConfigView.propTypes = {
    url: _react.PropTypes.string.isRequired,
    ip: _react.PropTypes.string.isRequired
};
NoConfigView.contextTypes = {
    setTitle: _react.PropTypes.func.isRequired,
    setMeta: _react.PropTypes.func.isRequired,
    context: _react.PropTypes.object.isRequired
};
//# sourceMappingURL=NoConfigView.js.map
