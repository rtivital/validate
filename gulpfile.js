var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");

// Compile Sass
gulp.task('sass', function () {
  gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./scss/**/*.scss', ['sass']);
});

// Minify CSS
gulp.task('minify-css', ['sass'], function() {
  return gulp.src('iv.css')
    .pipe(minifyCss({ compatibility: 'ie9' }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
});

// Minify Library
gulp.task('minify-lib', function() {
  return gulp.src('validate.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['minify-css', 'minify-lib']);