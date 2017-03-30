const gulp = require('gulp');
const config = require('../config');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

function build() {
  return gulp.src(config.scripts, { cwd: config.src })
  .pipe(sourcemaps.init())
  .pipe(ts({
    allowSyntheticDefaultImports: true,
    declaration: true,
    lib: [
      'dom',
      'es2015',
    ],
    module: 'es2015',
    moduleResolution: 'node',
    // sourceMap: true,
    target: 'es5',
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(config.dest));
}

gulp.task('build', build);

module.exports = build;
