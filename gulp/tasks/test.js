const gulp = require('gulp');
const mocha = require('gulp-mocha');
const config = require('../config');
const Bluebird = require('bluebird');

gulp.task('test', () => {
  Bluebird.config({
    longStackTraces: true,
  });
  return gulp.src(`${config.tests}/**/*.spec.js`, { cwd: config.dest, read: false })
  .pipe(mocha());
});
