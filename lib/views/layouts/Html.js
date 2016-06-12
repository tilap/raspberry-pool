"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = HtmlLayout;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _fodyHtmlLayout = require("fody-html-layout");

var _fodyHtmlLayout2 = _interopRequireDefault(_fodyHtmlLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HtmlLayout(props) {
    return _react2.default.createElement(_fodyHtmlLayout2.default, _extends({ preBody: _react2.default.createElement(
            "div",
            { id: "disconnected" },
            _react2.default.createElement(
                "div",
                null,
                "disconnected"
            )
        ) }, props));
}
//# sourceMappingURL=Html.js.map
