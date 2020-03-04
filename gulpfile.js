const gulp = require('gulp');
const connect = require('gulp-connect');
const concat = require('gulp-concat');

gulp.task('html', function() {
  return gulp.src(['src/*.html'])
    .pipe(gulp.dest('dist'))
});

gulp.task('js', function() {
  return gulp.src(['src/*.js', '!src/*.test.js'])
    .pipe(concat('script.js'))
    .pipe(gulp.dest('dist'))
});

gulp.task('serve', function() {
  return connect.server({
    root: 'dist',
    livereload: false
  })
});

gulp.task('run', gulp.series('html', 'js', 'serve'));
