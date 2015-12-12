/// <binding AfterBuild='default' />
'use strict';

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    Config = require('./gulpfile.config'),
    tsProject = tsc.createProject('tsconfig.json'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch');
var config = new Config();

/**
    * Lint all custom TypeScript files.
    */
gulp.task('ts-lint', function () {
    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
});

/**
   * Compile TypeScript and include references to app .d.ts files.
   */
gulp.task('compile-ts', function () {
    var sourceTsFiles = [config.allTypeScript,                //path to typescript files
                     config.libraryTypeScriptDefinitions];    //reference to d.ts files

    var tsResult = gulp.src(sourceTsFiles)
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
    return tsResult.js
                    .pipe(sourcemaps.write('.'))
                    .pipe(gulp.dest(config.tsOutputPath));
});

/**
  *   Compress all the js into 1 minified file for appcode
  */
gulp.task('compress-app-js', ['compile-ts'], function () {
    return gulp.src([
            '!./www/scripts/Tempjs/**/*.map.js', //Make sure these are in the correct order
            './www/scripts/Tempjs/Controllers/*.js', //Have the builder and startup last
            './www/scripts/Tempjs/RouteConfig.js',
            './www/scripts/Tempjs/AppBuilder.js',
            './www/scripts/Tempjs/Startup.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./www/scripts/'));
});

gulp.task('watch', function() {
    watch(config.allTypeScript, batch(function(events, done) {
        gulp.start('compile-ts', done);
    }));
});

/**
    * Cleanup the tempjs folder
    */
gulp.task('cleanup-js', ['compress-app-js'], function() {
    return gulp.src('./www/scripts/Tempjs/', { read: false })
        .pipe(rimraf());
});

/**
 * bundle CSS
 */
gulp.task('bundle-css', function() {
    return gulp.src(config.cssFiles)
        .pipe(gulp.dest('./www/built/local/'));
});

/**
 * Bundle jquery libs
 */
gulp.task('bundle-jquery', function () {
    return gulp.src('./node_modules/jquery/dist/jquery.min.js')
        .pipe(concat('jquery-bundle.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./www/scripts/libs/jquery/'));
});

/**
 * Bundle phaser libs
 */
gulp.task('bundle-phaser', function() {
    return gulp.src('./node_modules/phaser/build/phaser.min.js')
        .pipe(concat('phaser-bundle.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./www/scripts/libs/phaser/'));
});

/**
*  Bundle the vendor libs
*/
gulp.task('bundle-lib', ['bundle-phaser', 'bundle-jquery']);

gulp.task('default', ['ts-lint', 'compile-ts', 'compress-app-js', 'cleanup-js', 'bundle-lib']);