'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.items = undefined;
exports.getById = getById;
exports.changeConfig = changeConfig;
exports.addNew = addNew;
exports.replaceMacAddresses = replaceMacAddresses;
exports.addMacAddress = addMacAddress;
exports.saveScreenshot = saveScreenshot;
exports.screenshotPath = screenshotPath;

var _fs = require('fs');

var _types = require('./types');

var RaspberryData = _types.RaspberryData,
    RaspberryConfig = _types.RaspberryConfig;
/* import { slugify as _slugify } from 'transliteration';

function slugify(string) {
    return _slugify(string, { lowercase: true, separator: '-' });
} */

const dataPath = `${ __dirname }/../../data`;
const dataFilename = `${ dataPath }/raspberries.json`;

const items = exports.items = JSON.parse((0, _fs.readFileSync)(dataFilename));

if (!(Array.isArray(items) && items.every(function (item) {
    return RaspberryData(item);
}))) {
    throw new TypeError('Value of variable "items" violates contract.\n\nExpected:\nArray<RaspberryData>\n\nGot:\n' + _inspect(items));
}

const map = new Map(items.map(item => {
    return [item.id, item];
}));

if (map.size !== items.length) {
    throw new Error('Duplicated id');
}

function save() {
    (0, _fs.writeFileSync)(dataFilename, JSON.stringify(items, null, 4));
}

function getById(id) {
    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    return map.get(id);
}

function changeConfig(id, config) {
    if (!RaspberryConfig(config)) {
        throw new TypeError('Value of argument "config" violates contract.\n\nExpected:\nRaspberryConfig\n\nGot:\n' + _inspect(config));
    }

    if (!map.has(id)) {
        throw new Error('Invalid id');
    }

    // TODO configManager
    config = Object.assign({}, {
        time: Date.now(),
        display: config.display || 'kweb3',
        url: config.url.trim()
    });
    map.get(id).config = config;
    save();

    return config;
}
// ip should not be written
function addNew(id, mac, name) {
    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    if (!(typeof mac === 'string')) {
        throw new TypeError('Value of argument "mac" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(mac));
    }

    if (!(typeof name === 'string')) {
        throw new TypeError('Value of argument "name" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(name));
    }

    const newRaspberryItem = {
        id: id,
        name: name,
        macAddresses: [mac],
        config: {}
    };

    if (map.has(newRaspberryItem.id)) {
        throw new Error(`Already has id: ${ newRaspberryItem.id }`);
    }

    items.push(newRaspberryItem);
    map.set(newRaspberryItem.id, newRaspberryItem);
    save();

    return newRaspberryItem;
}

function replaceMacAddresses(id, newMacAddresses) {
    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    if (!(Array.isArray(newMacAddresses) && newMacAddresses.every(function (item) {
        return typeof item === 'string';
    }))) {
        throw new TypeError('Value of argument "newMacAddresses" violates contract.\n\nExpected:\nArray<string>\n\nGot:\n' + _inspect(newMacAddresses));
    }

    if (!map.has(id)) {
        throw new Error('Invalid id');
    }

    map.get(id).macAddresses = newMacAddresses;
    save();
}

function addMacAddress(id, newMacAddress) {
    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    if (!(typeof newMacAddress === 'string')) {
        throw new TypeError('Value of argument "newMacAddress" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(newMacAddress));
    }

    if (!map.has(id)) {
        throw new Error('Invalid id');
    }

    map.get(id).macAddresses.push(newMacAddress);
    save();
}

function saveScreenshot(id, screenshot) {
    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    if (!(screenshot instanceof Buffer)) {
        throw new TypeError('Value of argument "screenshot" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(screenshot));
    }

    (0, _fs.writeFileSync)(screenshotPath(id), screenshot);
}

function screenshotPath(id) {
    if (!(typeof id === 'string')) {
        throw new TypeError('Value of argument "id" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(id));
    }

    return `${ dataPath }/screenshot-${ id }.png`;
}

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
//# sourceMappingURL=raspberriesData.js.map
