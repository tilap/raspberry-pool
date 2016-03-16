"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let HeaderComponent = (_temp = _class = class HeaderComponent extends _react.Component {

    render() {
        return _react2.default.createElement(
            "header",
            { className: "header" },
            _react2.default.createElement(
                "div",
                { className: "left" },
                this.context.context.t('raspberry-pool.title')
            ),
            _react2.default.createElement(
                "div",
                { className: "right" },
                _react2.default.createElement(
                    "a",
                    { className: "button flat", href: this.context.context.urlGenerator('home') },
                    "Your raspberries"
                )
            )
        );
    }
}, _class.contextTypes = {
    context: _react.PropTypes.object.isRequired
}, _temp);
exports.default = HeaderComponent;
//# sourceMappingURL=HeaderComponent.js.map
