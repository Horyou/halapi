'use strict';
var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var coveralls = require('gulp-coveralls');
var istanbul = require('gulp-istanbul');
var eslint = require('gulp-eslint');
var tape = require('gulp-tape');
var tapColorize = require('tap-colorize');

var path = require('path');
require('colors');

var dirs = {
  source: 'source',
  dist: 'build',
  sourceRoot: path.join(__dirname, 'source'),
  testRoot: path.join(__dirname, 'test'),
  testBuild: 'build/test',
  sourceBuild: 'build/source'
};

var files = {
  test: 'test/**/*.js',
  testBuild: path.join(dirs.testBuild, '/**/*.js'),
  source: path.join(dirs.source, '/**/*.js'),
  sourceBuild: path.join(dirs.sourceBuild, '/**/*.js'),
  entryPoint: dirs.sourceBuild + '/index.js'
};



var _build = function (src, dest, srcRoot) {
  return function () {
    return gulp.src(src)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
      .pipe(sourcemaps.init())
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(sourcemaps.write('.', // (C)
        {
          sourceRoot: srcRoot
        }))
      .pipe(gulp.dest(dest));
  };
};

var _test = function () {
  return gulp.src(files.testBuild)
    .pipe(tape({
      reporter: tapColorize()
    }));
};

var _clean = function (dir) {
  return function () {
    return gulp.src(dir, {
        read: false
      })
      .pipe(clean());
  };
};

// Test tasks
gulp.task('source:build', _build(files.source, dirs.sourceBuild, dirs.sourceRoot));
gulp.task('test:build', _build(files.test, dirs.testBuild, dirs.testRoot));
gulp.task('test:fixtures', function () {
  return gulp.src(path.join(dirs.testRoot, 'fixtures/**/*.json'))
    .pipe(gulp.dest(path.join(dirs.testBuild, 'fixtures')));
});

gulp.task('build:all', ['source:build', 'test:build', 'test:fixtures']);


gulp.task('pre-test', ['build:all'], function () {
  return gulp.src([files.sourceBuild])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test:tape', ['build:all', 'pre-test'], function () {
  return _test()
    .pipe(istanbul.writeReports({
      reporters: ['json']
    }));
});

gulp.task('remap-istanbul', ['test:tape'], function (cb) {
  var loadCoverage = require('remap-istanbul/lib/loadCoverage');
  var remap = require('remap-istanbul/lib/remap');
  var writeReport = require('remap-istanbul/lib/writeReport');
  var collector = remap(loadCoverage('coverage/coverage-final.json'));
  var reports = [];
  reports.push(writeReport(collector, 'text'));
  reports.push(writeReport(collector, 'text-summary'));
  reports.push(writeReport(collector, 'json', 'coverage/coverage-final-mapped.json'));
  reports.push(writeReport(collector, 'html', 'coverage/lcov-report'));
  reports.push(writeReport(collector, 'lcovonly', 'coverage/lcov.info'));
  Promise.all(reports).then(function () {
    console.log('Full coverage report on :'.green + ('file://' + path.resolve('./coverage/lcov-report/index.html')).yellow.underline);
    cb();
  });
});


gulp.task('coveralls', ['test-with-reports'], function () {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});


gulp.task('test-with-reports', ['pre-test', 'test:tape', 'remap-istanbul']);
gulp.task('test:all', ['build:all'], _test);

gulp.task('clean:all', _clean('build'));
gulp.task('clean:dist', _clean('dist'));

gulp.task('build', ['clean:dist'], function () {
  return gulp.src(files.source)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch([files.test, files.source], ['test:all']);
});

gulp.task('test', ['clean:all'], function () {
  return gulp.start.apply(this, ['test:all', 'watch']);
});

gulp.task('default', ['clean:all'], function () {
  return gulp.start.apply(this, ['test-with-reports', 'coveralls']);
});
