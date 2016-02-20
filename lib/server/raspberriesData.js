'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.items = undefined;
exports.getById = getById;
exports.changeConfig = changeConfig;
exports.addNew = addNew;

var _fs = require('fs');

/* import { slugify as _slugify } from 'transliteration';

function slugify(string) {
    return _slugify(string, { lowercase: true, separator: '-' });
} */

const dataFilename = `${ __dirname }/../../data/raspberries.json`;

const items = exports.items = JSON.parse((0, _fs.readFileSync)(dataFilename));
const map = new Map(items.map(item => [item.id, item]));

if (map.size !== items.length) {
    throw new Error('Duplicated id');
}

function save() {
    (0, _fs.writeFileSync)(dataFilename, JSON.stringify(items, null, 4));
}

function getById(id) {
    return map.get(id);
}

function changeConfig(id, config) {
    if (!map.has(id)) {
        throw new Error('Invalid id');
    }

    // TODO configManager
    config = Object.assign({}, { url: config.url.trim() });
    map.get(id).config = config;
    save();

    return config;
}
// ip should not be written
function addNew(id, mac, name) {
    const newRaspberryItem = {
        id,
        name,
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
//# sourceMappingURL=raspberriesData.js.map
