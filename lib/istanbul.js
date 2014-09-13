'use strict';

var parentRequire = require('parent-require');
var istanbul = parentRequire('istanbul');

for (var key in istanbul) {
  /* istanbul ignore else */
  if (istanbul.hasOwnProperty(key)) {
    exports[key] = istanbul[key];
  }
}

exports.Instrumenter = require('./instrumenter');
