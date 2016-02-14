import { readFileSync, writeFileSync } from 'fs';
import { writeById } from '../tcp-server';

const dataFilename = `${__dirname}/../../data/raspberries.json`;

const data = JSON.parse(readFileSync(dataFilename));
export const items = Object.keys(data).map(key => Object.assign({ id: key, online: false }, data[key]));
const map = new Map();
const mapByMac = new Map();

const unknown = new Map();


items.forEach(item => {
    map.set(item.id, item);
    Object.keys(item.networks).forEach(mac => {
        if (mapByMac.has(mac)) {
            throw new Error(`Mac defined more than one: ${mac}`);
        }

        mapByMac.set(mac, item);
    });
});

function save() {
    writeFileSync(dataFilename, JSON.stringify(data, null, 4));
}

export function getById(id) {
    return map.get(id);
}

export function getByMac(mac) {
    return mapByMac.get(mac);
}

export function setOnline(raspberry, { mac, ip }) {
    raspberry.online = true;
    raspberry.networks[mac].ip = ip;
}

export function setOffline(raspberry, mac) {
    raspberry.networks[mac].ip = null;
    raspberry.online = Object.keys(raspberry.networks).some(mac => raspberry.networks[mac].ip);
}

export function addUnknown({ mac, ip }) {
    unknown.set(mac, ip);
}

export function patchRaspberry(raspberry, changes) {
    const id = raspberry.id;

    changes = Object.assign({}, { url: changes.url.trim() });
    Object.assign(map.get(id), changes);
    Object.assign(data[id], changes);
    save();

    writeById(id, { type: 'update-config', config: changes });

    return changes;
}

export function sendAction(raspberry, action) {
    const id = raspberry.id;
    writeById(id, { type: 'action', action });
}
