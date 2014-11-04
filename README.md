# istanbul-traceur

[![NPM version][meta-img-npm]][meta-url-npm]
[![Build status][meta-img-travis]][meta-url-travis]
[![Coveralls status][meta-img-coveralls]][meta-url-coveralls]
[![Support us][meta-img-gratipay]][meta-url-gratipay]

[Istanbul][url-istanbul] is a robust code coverage tool, could be run on both
[Node.js][url-node] and browsers, provides many report formats
(HTML, LCOV, etc.) to have testing and continuous integration done right. But
[Istanbul][url-istanbul] could not understand JavaScript of the future
(e.g. [ECMCScript 6][url-es6]). The next JavaScript provides new language
features which help development process goes faster and produces less bugs.

Fortunately, we have [Traceur][url-traceur], which is a transpiler
(source-to-source compiler) which could convert JavaScript of the future to
current JavaScript.

This module is here to help connecting these two awesome thing together.
It stands as an alternative to [Istanbul][url-istanbul], enables you to use
[Traceur][url-traceur] to write applications in modern JavaScript without
worrying about code coverage.

## Installation

This module can be installed easily with [npm][url-npm]:

```sh
$ npm install istanbul-traceur
```

## Usage

### Directly

**main.js**:

```js
var fs = require('fs');

var istanbul = require('istanbul-traceur');
var instrumenter = new istanbul.Instrumenter();

var content = fs.readFileSync('es6.js', 'utf8');
var code = instrumenter.instrumentSync(content, '/path/to/file.js');

eval(code);
//=> prints "You have done right!"
```

**es6.js**:

```js
import assert from 'assert';

export var isOdd = (n) => {
  return !!(n & 1);
};

assert(isOdd(7), '7 is odd.');
assert(!isOdd(4), '4 is even.');

console.log('You have done right!');
```

### With [Gulp][url-gulp]

**gulpfile.js**:

```js
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

var istanbulTraceur = require('istanbul-traceur');

gulp.task('test', function (cb) {
  var usedIstanbul = require('gulp-istanbul/node_modules/istanbul');
  var Instrumenter = usedIstanbul.Instrumenter;

  // Overrides `Instrumenter`
  usedIstanbul.Instrumenter = istanbulTraceur.Instrumenter;

  gulp.src([ 'lib/**/*.js' ])
    .pipe(istanbul())
    .on('finish', function () {
      gulp.src([ 'test/**/*.js' ])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', function (err) {
          // Restores original `Instrumenter`
          usedIstanbul.Instrumenter = Instrumenter;
          cb(err);
        });
    });
});
```

**`gulp test` in Terminal**:

![gulp test in Terminal][repo-img-gulp-test]

**HTML report**:

![HTML report][repo-img-html-report]

### With [Grunt][url-grunt]

**Gruntfile.js**:

```js
var istanbulTraceur = require('istanbul-traceur');

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-istanbul');

  grunt.initConfig({
    instrument: {
      files: 'lib/**/*.js',
      options: {
        basePath: 'coverage/instrumented',
        lazy: true
      }
    },
    mochaTest: [
      'test/**/*.js'
    ],
    storeCoverage: {
      options: {
        dir: 'coverage/reports'
      }
    },
    makeReport: {
      src: 'coverage/reports/**/*.json',
      options: {
        type: 'lcov',
        dir: 'coverage/reports',
        print: 'detail'
      }
    }
  });

  var usedIstanbul;
  var Instrumenter;

  grunt.registerTask('istanbul:override', function () {
    usedIstanbul = require('grunt-istanbul/node_modules/istanbul');
    Instrumenter = usedIstanbul.Instrumenter;

    // Overrides `Instrumenter`
    usedIstanbul.Instrumenter = istanbulTraceur.Instrumenter;
  });

  grunt.registerTask('istanbul:restore', function () {
    // Restores original `Instrumenter`
    usedIstanbul.Instrumenter = Instrumenter;
  });

  grunt.registerTask('test', [
    'istanbul:override',
    'instrument',
    'mochaTest',
    'storeCoverage',
    'makeReport',
    'istanbul:restore',
  ]);
};
```

When using with [Grunt][url-grunt]:

> _**NOTE**: Because instrumented copies of your source files lie in different
directory, you have to make sure all `require` methods in your test files
pointing to correct source file's locations._

**`grunt test` in Terminal**:

![grunt test in Terminal][repo-img-grunt-test]

HTML report is also available when using with [Grunt][url-grunt].

### Command-line usage

This feature is not available at the moment and will be implemented soon.
If you want to give a hand, [create a pull request][repo-url-pull-request].

## Compatibility

* This module has been tested to run properly with [Traceur][url-traceur]
version **0.0.61** (latest version at the time of writing). It could be broken
in the future if [Traceur][url-traceur] introduces non backward-compatible
changes. In that circumstance, feel free to [create new issue][repo-url-new-issue]
or [create a pull request][repo-url-pull-request].

## Contributing

Before [create a pull request][repo-url-pull-request], make sure that you:

* Followed coding convention as described in
**[.editorconfig][repo-editorconfig]** or **[.jshintrc][repo-jshintrc]** file
(more information can be found at [editorconfig.org][url-editorconfig] and
[www.jshint.com/docs][url-jshint-docs], respectively).

* Added tests for your code.

* Passed all tests!

To execute all tests, simply run:

    $ npm test

### Contributors

* **Author**: [Meo][url-meoguru]

## License

This module is released under [MIT license][repo-license].

[![Analytics][meta-img-ga]][meta-url-ga]

[//]: # (Site URLs)
[url-node]: http://nodejs.org
[url-npm]: https://www.npmjs.org/
[url-editorconfig]: http://editorconfig.org
[url-jshint-docs]: http://www.jshint.com/docs
[url-es6]: http://wiki.ecmascript.org/doku.php?id=harmony:generators
[url-gulp]: http://gulpjs.com/
[url-grunt]: http://gruntjs.com/
[url-traceur]: https://github.com/google/traceur-compiler
[url-istanbul]: https://github.com/gotwarlost/istanbul

[//]: # (Repository URLs and resources)
[repo-url-new-issue]: https://github.com/meoguru/istanbul-traceur/issues/new
[repo-url-pull-request]: https://github.com/meoguru/istanbul-traceur/pulls
[repo-license]: https://github.com/meoguru/istanbul-traceur/blob/master/LICENSE
[repo-editorconfig]: https://github.com/meoguru/istanbul-traceur/blob/master/.editorconfig
[repo-jshintrc]: https://github.com/meoguru/istanbul-traceur/blob/master/.jshintrc
[repo-img-gulp-test]: https://github.com/meoguru/istanbul-traceur/raw/master/assets/gulp-test.png
[repo-img-grunt-test]: https://github.com/meoguru/istanbul-traceur/raw/master/assets/grunt-test.png
[repo-img-html-report]: https://github.com/meoguru/istanbul-traceur/raw/master/assets/html-report.png

[//]: # (Repository meta information)
[meta-url-npm]: https://npmjs.org/package/istanbul-traceur
[meta-img-npm]: https://img.shields.io/npm/v/istanbul-traceur.svg?style=flat
[meta-url-travis]: https://travis-ci.org/meoguru/istanbul-traceur
[meta-img-travis]: https://img.shields.io/travis/meoguru/istanbul-traceur.svg?style=flat
[meta-url-coveralls]: https://coveralls.io/r/meoguru/istanbul-traceur
[meta-img-coveralls]: https://img.shields.io/coveralls/meoguru/istanbul-traceur/master.svg?style=flat
[meta-url-gratipay]: https://gratipay.com/meoguru
[meta-img-gratipay]: https://img.shields.io/gratipay/meoguru.svg?style=flat
[meta-url-ga]: https://github.com/igrigorik/ga-beacon
[meta-img-ga]: https://ga-beacon.appspot.com/UA-54698248-2/repo/README.md

[//]: # (Authors and contributors URLs)
[url-meoguru]: http://meo.guru
