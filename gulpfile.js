var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var eslint = require('gulp-eslint');

gulp.task('lint', function () {
  return gulp.src(['validate.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('default', ['lint'], function() {
  return gulp.src('validate.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./'));
});