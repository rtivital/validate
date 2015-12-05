var gulp = require('gulp');
var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  gulp.src('./example/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./example/css'));
});
 
gulp.task('default', function () {
  gulp.watch('./example/scss/**/*.scss', ['sass']);
});