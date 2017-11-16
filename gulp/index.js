const gulp = require('gulp');
require('./tasks');
gulp.task('default', gulp.series('clean', 'build'));
gulp.task('maketest', gulp.series('clean', 'build', 'test'));
