'use strict';

var path = require('path');
var fs = require('fs');

var istanbul = require('../..');
var Instrumenter = istanbul.Instrumenter;

describe('Instrumenter', function () {
  describe('#instrumentSync', function () {
    it('should instrument successfully', function () {
      var instrumenter = new Instrumenter();

      var filePath = path.resolve(__dirname + '/../resources/es6.js');
      var content = fs.readFileSync(filePath, 'utf8');

      instrumenter.instrumentSync(content);
    });
  });
});
