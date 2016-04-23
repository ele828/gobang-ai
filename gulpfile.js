var gulp = require('gulp');
var browserify = require('gulp-browserify');
var less = require('gulp-less');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('scripts', function() {
  return gulp.src('./scripts/app.js')
    .pipe(browserify({transform: ['reactify']}))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('builds'));
});

gulp.task('styles', function() {
  return gulp.src('./styles/styles.less')
    .pipe(less())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('builds'));
});

gulp.task('watch', function() {
  gulp.watch('./scripts/app.js', ['scripts']);
  gulp.watch('./scripts/ai.js', ['scripts']);
  gulp.watch('./styles/styles.less', ['styles']);
});
