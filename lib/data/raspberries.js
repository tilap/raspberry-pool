'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.items = undefined;
exports.getById = getById;
exports.getByMac = getByMac;
exports.setOnline = setOnline;
exports.setOffline = setOffline;
exports.addUnknown = addUnknown;
exports.patchRaspberry = patchRaspberry;
exports.sendAction = sendAction;

var _fs = require('fs');

var _tcpServer = require('../tcp-server');

const dataFilename = `${ __dirname }/../../data/raspberries.json`;

const data = JSON.parse((0, _fs.readFileSync)(dataFilename));
const items = exports.items = Object.keys(data).map(key => Object.assign({ id: key, online: false }, data[key]));
const map = new Map();
const mapByMac = new Map();

const unknown = new Map();

items.forEach(item => {
    map.set(item.id, item);
    Object.keys(item.networks).forEach(mac => {
        if (mapByMac.has(mac)) {
            throw new Error(`Mac defined more than one: ${ mac }`);
        }

        mapByMac.set(mac, item);
    });
});

function save() {
    (0, _fs.writeFileSync)(dataFilename, JSON.stringify(data, null, 4));
}

function getById(id) {
    return map.get(id);
}

function getByMac(mac) {
    return mapByMac.get(mac);
}

function setOnline(raspberry, _ref) {
    let mac = _ref.mac;
    let ip = _ref.ip;

    raspberry.online = true;
    raspberry.networks[mac].ip = ip;
}

function setOffline(raspberry, mac) {
    raspberry.networks[mac].ip = null;
    raspberry.online = Object.keys(raspberry.networks).some(mac => raspberry.networks[mac].ip);
}

function addUnknown(_ref2) {
    let mac = _ref2.mac;
    let ip = _ref2.ip;

    unknown.set(mac, ip);
}

function patchRaspberry(raspberry, changes) {
    const id = raspberry.id;

    changes = Object.assign({}, { url: changes.url.trim() });
    Object.assign(map.get(id), changes);
    Object.assign(data[id], changes);
    save();

    (0, _tcpServer.writeById)(id, { type: 'update-config', config: changes });

    return changes;
}

function sendAction(raspberry, action) {
    const id = raspberry.id;
    (0, _tcpServer.writeById)(id, { type: 'action', action });
}
//# sourceMappingURL=raspberries.js.map
