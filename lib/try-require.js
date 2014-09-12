'use strict';

var parentRequire = require('parent-require');

module.exports = function tryRequire(moduleName) {
  /* istanbul ignore next */
  try {
    return require(moduleName);
  }
  catch (_) {
    return parentRequire(moduleName);
  }
};
