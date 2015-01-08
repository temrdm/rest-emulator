'use strict';

var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var cover = require('gulp-coverage');

gulp.task('test', function () {
    return gulp.src('tests/**/*-spec.js')
        .pipe(cover.instrument({
            pattern: ['./lib/**/*.js', './index.js']
        }))
        .pipe(jasmine())
        .pipe(cover.gather())
        .pipe(cover.format())
        .pipe(gulp.dest('reports'));
});
