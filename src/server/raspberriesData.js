import { readFileSync, writeFileSync } from 'fs';
import type { RaspberryData, RaspberryConfig } from './types';
/* import { slugify as _slugify } from 'transliteration';

function slugify(string) {
    return _slugify(string, { lowercase: true, separator: '-' });
} */

const dataFilename = `${__dirname}/../../data/raspberries.json`;

export const items: Array<RaspberryData> = JSON.parse(readFileSync(dataFilename));
const map = new Map(items.map(item => [item.id, item]));

if (map.size !== items.length) {
    throw new Error('Duplicated id');
}

function save() {
    writeFileSync(dataFilename, JSON.stringify(items, null, 4));
}

export function getById(id: string) {
    return map.get(id);
}

export function changeConfig(id, config: RaspberryConfig) {
    if (!map.has(id)) {
        throw new Error('Invalid id');
    }

    // TODO configManager
    config = Object.assign({}, {
        time: Date.now(),
        display: config.display || 'kweb3',
        url: config.url.trim(),
    });
    map.get(id).config = config;
    save();

    return config;
}
// ip should not be written
export function addNew(id: string, mac: string, name: string) {
    const newRaspberryItem = {
        id,
        name,
        macAddresses: [mac],
        config: {},
    };

    if (map.has(newRaspberryItem.id)) {
        throw new Error(`Already has id: ${newRaspberryItem.id}`);
    }

    items.push(newRaspberryItem);
    map.set(newRaspberryItem.id, newRaspberryItem);
    save();

    return newRaspberryItem;
}

export function replaceMacAddresses(id: string, newMacAddresses: Array<string>) {
    if (!map.has(id)) {
        throw new Error('Invalid id');
    }

    map.get(id).macAddresses = newMacAddresses;
    save();
}

export function addMacAddress(id: string, newMacAddress: string) {
    if (!map.has(id)) {
        throw new Error('Invalid id');
    }

    map.get(id).macAddresses.push(newMacAddress);
    save();
}
