'use strict';

var util = require('util');

var tryRequire = require('./try-require');
var extend = require('extend');

var esprima = require('esprima');

var sourceMap = require('source-map');
var SourceMapConsumer = sourceMap.SourceMapConsumer;

var istanbul = tryRequire('istanbul');

var traceur = tryRequire('traceur');
var Compiler = traceur.Compiler;
var NodeCompiler = traceur.NodeCompiler;

var Instrumenter = module.exports = function () {
  Instrumenter.super_.apply(this, arguments);
};

util.inherits(Instrumenter, istanbul.Instrumenter);

extend(Instrumenter.prototype, {
  instrumentSync: function (code, filename) {
    filename = filename || '<unknown file>';

    var compiled = this._compile(code, filename);
    this._sourceMap = this._createSourceMapConsumer(compiled.map);

    var program = this._parse(compiled.code);

    return this.instrumentASTSync(program, filename, code);
  },

  getPreamble: function () {
    var superGetPreamble = Instrumenter.super_.prototype.getPreamble;

    var coverState = this.coverState;
    var statementMap = coverState.statementMap;
    var branchMap = coverState.branchMap;
    var functionMap = coverState.fnMap;
    var key;
    var location;

    for (key in statementMap) {
      /* istanbul ignore else */
      if (statementMap.hasOwnProperty(key)) {
        location = statementMap[key];
        this._fixLocation(location);
      }
    }

    for (key in branchMap) {
      /* istanbul ignore else */
      if (branchMap.hasOwnProperty(key)) {
        var locations = branchMap[key].locations;
        locations.forEach(this._fixLocation.bind(this));
      }
    }

    for (key in functionMap) {
      /* istanbul ignore else */
      if (functionMap.hasOwnProperty(key)) {
        location = functionMap[key].loc;
        this._fixLocation(location);
      }
    }

    return superGetPreamble.apply(this, arguments);
  },

  _compile: function (code, filename) {
    /* istanbul ignore else */
    if (!this._compiler) {
      this._compiler = this._createCompiler();
    }

    this._compiler.options_.filename = filename;
    var compiled = this._compiler.compile(code);

    return {
      code: compiled,
      map: this._compiler.getSourceMap()
    };
  },

  _createCompiler: function () {
    var options = Compiler.commonJSOptions({
      sourceMaps: true
    });

    return new NodeCompiler(options);
  },

  _createSourceMapConsumer: function (sourceMap) {
    return new SourceMapConsumer(sourceMap);
  },

  _parse: function (code) {
    return esprima.parse(code, {
      loc: true,
      range: true
    });
  },

  _fixLocation: function (location) {
    location.start = this._sourceMap.originalPositionFor(location.start);
    location.end = this._sourceMap.originalPositionFor(location.end);
  }
});
