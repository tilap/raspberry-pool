'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _websocket = require('../server/websocket');

Object.keys(_websocket).forEach(function (key) {
  if (key === "default") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _websocket[key];
    }
  });
});
//# sourceMappingURL=index.js.map
