const gulp = require('gulp');
const config = require('../config');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const del = require('del');
const mergeStream = require('merge-stream');

function test() {
  const tsProject = ts.createProject('tsconfig.json');
  const tsResult = gulp.src('*.ts', { cwd: 'test' }).pipe(tsProject());

  return mergeStream(
    tsResult.js.pipe(
      babel({
        presets: [
          [
            'env',
            {
              targets: {
                node: '8.9.0',
              },
            },
          ],
        ],
      }),
    ),
    tsResult.dts,
  ).pipe(gulp.dest('testbuild'));
}

function cleanTest() {
  return del(['testbuild']);
}

gulp.task('testbuild', test);
gulp.task('testclean', cleanTest);
gulp.task('test', gulp.series('testclean', 'testbuild'));

module.exports = test;
