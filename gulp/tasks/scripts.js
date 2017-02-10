const gulp = require('gulp');
const config = require('../config');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

function typings() {
  return gulp.src(config.typings, { cwd: config.src })
  .pipe(gulp.dest(config.dest));
}

function build() {
  return gulp.src(config.scripts, { cwd: config.src })
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['es2015', 'stage-0'],
    plugins: ['transform-es2015-modules-commonjs', 'add-module-exports'],
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.dest));
}

gulp.task('build', gulp.parallel(build, typings));

module.exports = build;
