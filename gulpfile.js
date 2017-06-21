'use strict';

const gulp = require('gulp');
const rimraf = require('gulp-rimraf');
const shell = require('gulp-shell');
const tslint = require('gulp-tslint');
const gulpSequence = require('gulp-sequence');

/**
 * Remove build directory.
 */
gulp.task('clean', function () {
  return gulp.src('build', { read: false })
    .pipe(rimraf());
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
  return gulp.src('src/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript.
 */
gulp.task('compile', shell.task([
  'npm run tsc',
]))

/**
 * Copy configuration files
 */
 gulp.task('configs', (cb) => {
   return gulp.src("src/configurations/*.json")
     .pipe(gulp.dest('./build/configurations'));
 });

/**
 * Build the project.
 */
 gulp.task('build', ['tslint', 'clean', 'compile'], () => {
   console.log('Building the project ...');
     return gulp.src("src/configurations/*.json")
       .pipe(gulp.dest('./build/configurations/'));
 });
