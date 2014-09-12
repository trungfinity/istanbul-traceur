'use strict';

var path = require('path');
var fs = require('fs');

var Instrumenter = requireLib('instrumenter');

describe('Instrumenter', function () {
  describe('#instrumentSync', function () {
    it('should instrument successfully', function () {
      var instr = new Instrumenter();

      var filePath = path.resolve(__dirname + '/../resources/es6.js');
      var content = fs.readFileSync(filePath, 'utf8');

      instr.instrumentSync(content);
    });
  });
});
