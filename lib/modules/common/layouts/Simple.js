'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Html extends _react.Component {

    render() {
        return _react2.default.createElement(
            'html',
            null,
            _react2.default.createElement(
                'head',
                null,
                _react2.default.createElement('meta', { charSet: 'utf-8' }),
                _react2.default.createElement('meta', { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' }),
                _react2.default.createElement(
                    'title',
                    null,
                    this.props.title
                ),
                _react2.default.createElement('meta', { name: 'description', content: this.props.description }),
                _react2.default.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }),
                _react2.default.createElement('link', { href: 'https://fonts.googleapis.com/css?family=Roboto:400,700,500,300,100,500italic,400italic,700italic', rel: 'stylesheet', type: 'text/css' }),
                _react2.default.createElement('link', { rel: 'stylesheet', href: '/index.css' })
            ),
            _react2.default.createElement(
                'body',
                null,
                this.props.preBody,
                _react2.default.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: this.props.body } }),
                this.props.postBody
            )
        );
    }
}
exports.default = Html;
Html.propTypes = {
    title: _react.PropTypes.string,
    description: _react.PropTypes.string,
    body: _react.PropTypes.string.isRequired,
    preBody: _react.PropTypes.element,
    postBody: _react.PropTypes.element,
    context: _react.PropTypes.object.isRequired
};
Html.defaultProps = {
    title: '',
    description: ''
};
//# sourceMappingURL=Simple.js.map
