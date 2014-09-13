'use strict';

var tryRequire = require('./try-require');
var istanbul = tryRequire('istanbul');

for (var key in istanbul) {
  /* istanbul ignore else */
  if (istanbul.hasOwnProperty(key)) {
    exports[key] = istanbul[key];
  }
}

exports.Instrumenter = require('./instrumenter');
