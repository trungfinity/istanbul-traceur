'use strict';

var parentRequire = require('parent-require');

module.exports = function peerRequire(moduleName) {
  /* istanbul ignore next */
  try {
    return require(moduleName);
  }
  catch (_) {
    return parentRequire(moduleName);
  }
};
