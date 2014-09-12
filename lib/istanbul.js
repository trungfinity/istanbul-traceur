'use strict';

var tryRequire = require('./try-require');

var mockery = require('mockery');
var istanbul = tryRequire('istanbul');

for (var key in istanbul) {
  /* istanbul ignore else */
  if (istanbul.hasOwnProperty(key)) {
    exports[key] = istanbul[key];
  }
}

exports.Instrumenter = require('./instrumenter');

exports.mock = function () {
  mockery.enable({
    warnOnUnregistered: false,
    useCleanCache: true
  });
  mockery.registerMock('istanbul', exports);
};

exports.unmock = function () {
  mockery.deregisterMock('istanbul');
  mockery.disable();
};
