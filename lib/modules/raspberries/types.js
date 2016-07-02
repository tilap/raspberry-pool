"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const RaspberryConfig = exports.RaspberryConfig = function () {
    function RaspberryConfig(input) {
        return input != null && (input.time === undefined || typeof input.time === 'number') && (input.display === undefined || typeof input.display === 'string') && (input.url === undefined || typeof input.url === 'string');
    }

    ;
    Object.defineProperty(RaspberryConfig, Symbol.hasInstance, {
        value: function value(input) {
            return RaspberryConfig(input);
        }
    });
    return RaspberryConfig;
}();

const RaspberryData = exports.RaspberryData = function () {
    function RaspberryData(input) {
        return input != null && typeof input.id === 'string' && typeof input.name === 'string' && Array.isArray(input.macAddresses) && input.macAddresses.every(function (item) {
            return typeof item === 'string';
        }) && RaspberryConfig(input.config);
    }

    ;
    Object.defineProperty(RaspberryData, Symbol.hasInstance, {
        value: function value(input) {
            return RaspberryData(input);
        }
    });
    return RaspberryData;
}();

const Raspberry = exports.Raspberry = function () {
    function Raspberry(input) {
        return input != null && typeof input.id === 'string' && (input.data === undefined || RaspberryData(input.data)) && (input.registered === undefined || typeof input.registered === 'boolean') && (typeof input.online === 'boolean' || typeof input.online === 'string') && (typeof input.ip === 'string' || input.ip == null) && (typeof input.screenState === 'string' || input.screenState == null);
    }

    ;
    Object.defineProperty(Raspberry, Symbol.hasInstance, {
        value: function value(input) {
            return Raspberry(input);
        }
    });
    return Raspberry;
}();
//# sourceMappingURL=types.js.map
