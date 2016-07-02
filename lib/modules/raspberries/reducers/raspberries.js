'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _alpReactRedux = require('alp-react-redux');

var _raspberry = require('../actions/raspberry');

var _raspberryActionManager = require('../raspberryActionManager');

const raspberryReducer = (0, _alpReactRedux.createReducer)({
    [_raspberry.update]: (state, _ref2) => {
        let raspberry = _ref2.raspberry;
        return raspberry;
    },
    [_raspberry.updateConfig]: (raspberry, _ref3) => {
        let config = _ref3.config;
        return _extends({}, raspberry, { data: _extends({}, raspberry.data, { config: config }) });
    },
    [_raspberry.remove]: (state, _ref4) => {
        let raspberry = _ref4.raspberry;
        return raspberry;
    },
    [_raspberry.screenshotUpdated]: raspberry => {
        return _extends({}, raspberry);
    },
    [_raspberry.saving]: raspberry => {
        return _extends({}, raspberry, { saving: true });
    },
    [_raspberry.saved]: raspberry => {
        return _extends({}, raspberry, { saving: false });
    },
    [_raspberry.sendingAction]: (raspberry, _ref5) => {
        let changes = _ref5.changes;
        let action = _ref5.action;
        return _extends({}, raspberry, changes, {
            actions: _extends({}, raspberry.actions, {
                [action]: 'sending'
            })
        });
    },
    [_raspberry.actionSent]: (raspberry, _ref6) => {
        let changes = _ref6.changes;
        let action = _ref6.action;
        return _extends({}, raspberry, changes, {
            actions: _extends({}, raspberry.actions, {
                [action]: null
            })
        }, (0, _raspberryActionManager.updateFromAction)(action));
    }
});

const raspberryHandler = (raspberries, action) => {
    if (!action.id) throw new Error(`Missing action.id, ${ action.type }`);
    return raspberries.map(raspberry => {
        if (raspberry.id !== action.id) return raspberry;
        return raspberryReducer(raspberry, action);
    });
};

exports.default = (0, _alpReactRedux.createReducer)(() => {
    return [];
}, {
    [_raspberry.updateAll]: (state, _ref7) => {
        let raspberries = _ref7.raspberries;

        function _ref(_id) {
            if (!Array.isArray(_id)) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nArray\n\nGot:\n' + _inspect(_id));
            }

            return _id;
        }

        return _ref(raspberries);
    },
    [_raspberry.add]: (raspberries, _ref8) => {
        let raspberry = _ref8.raspberry;
        return [...raspberries, raspberry];
    },
    [_raspberry.remove]: (raspberries, _ref9) => {
        let id = _ref9.id;
        return raspberries.filter(r => {
            return r.id !== id;
        });
    },
    [_raspberry.update]: raspberryHandler,
    [_raspberry.updateConfig]: raspberryHandler,
    [_raspberry.screenshotUpdated]: raspberryHandler,
    [_raspberry.saving]: raspberryHandler,
    [_raspberry.saved]: raspberryHandler,
    [_raspberry.sendingAction]: raspberryHandler,
    [_raspberry.actionSent]: raspberryHandler
});

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=raspberries.js.map
