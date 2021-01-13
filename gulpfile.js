/// <binding Clean='clean' />
"use strict";

var gulp = require('gulp');
var angularTemplateCache = require('gulp-angular-templatecache');
var autoprefixer = require('gulp-autoprefixer');
var args = require('yargs').argv;
var bump = require('gulp-bump');
var del = require('del');
var filter = require('gulp-filter');
var gulpPrint = require('gulp-print');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var less = require('gulp-less');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-csso');
var nodemon = require('gulp-nodemon');
var ngAnnotate = require('gulp-ng-annotate')
var plumber = require('gulp-plumber');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var tasklisting = require('gulp-task-listing');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var useref = require('gulp-useref');
var watch = require('gulp-watch');


var config = require('./gulp.config')();


gulp.task('watchme', function () {
    log('watchme starting..');
    return gulp
    .src(config.allJs)
    .pipe(watch('./src/**/*.js'))
    .pipe(plumber());
    
});

gulp.task('optimize', ['inject', 'images', 'fonts'], function () {
    log('Optimize javascript, html, css');

    //    var assets = useref.assets({searchPath: './'});
    var templateCache = config.temp + config.templateCache.file;
    var indexFilter = filter(['**/*', '!**/index.html'], { restore: true });


    return gulp
        .src(config.index)
        .pipe(plumber())
        .pipe(inject(gulp.src(templateCache, { read: false }), { starttag: '<!-- inject:templates:js -->' }))
        .pipe(useref({
            searchPath:
            ['./bower_components', '']
        }))
        .pipe(gulpIf('./bower_components/*.js', ngAnnotate({
            add: true
        })))
        .pipe(gulpIf('**/app.js', ngAnnotate({
            add: true
        })))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', minifyCss()))
        .pipe(indexFilter)
        .pipe(rev())
        .pipe(indexFilter.restore)
        .pipe(revReplace())
        .pipe(gulp.dest(config.build))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.root))

});

gulp.task('bump', function () {
    var msg = 'bumping version..';
    var type = args.type;
    var version = args.version;
    var options = {};

    if (version) {
        options.version = version;
        msg += ' to ' + version;
    } else {
        options.type = type;
        msg += ' for a ' + type;
    }
    log(msg);

    return gulp
        .src(config.packages)
        .pipe(bump(options))
        .pipe(gulp.dest(config.root))

});


gulp.task('vet', function () {
    log("--- Start JsHint")
    return gulp
        .src(config.allJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function (done) {
    log('cleaning temp and buld folders...');
    var delConfig = [].concat(config.build, config.temp);
    return del(delConfig, done)
});


gulp.task('styles', ['clean-styles'], function () {
    log("--- Start less")
    return gulp
        .src(config.styles)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles', function (done) {
    return clean(config.temp + '**/*.css', done);
});


gulp.task('styles-watcher', function () {
    return gulp.watch([config.styles], ['styles']);
});

gulp.task('fonts', ['clean-fonts'], function () {
    log('copying fonts..')
    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('clean-fonts', function (done) {
    log('cleaning fonts...');
    return clean(config.build + 'fonts/**/*.*', done);
});


gulp.task('images', function () {
    log('copying and compressing images..');
    return gulp
        .src(config.images)
        .pipe(imagemin({ optimizationLevel: 4 }))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean-images', function (done) {
    log('cleaning images...');
    return clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-code', function (done) {
    log('cleaning build code...');
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    return clean(files, done);
});

gulp.task('templateCache', ['clean-code'], function () {
    log('Angular $templateCache start...');

    return gulp
        .src(config.htmlTemplates)
        .pipe(minifyHtml({ empty: true }))
        .pipe(angularTemplateCache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});


gulp.task('wiredep', function () {
    log('wire up BOWER css, js and app into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client))
});

gulp.task('inject', ['wiredep', 'styles', 'templateCache'], function () {
    log('wire up ALL css, js and app into the html');
    return gulp
        .src(config.index)
        .pipe(inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client))
});

gulp.task('help', tasklisting);
gulp.task('default', ['help']);

///// other functions
function clean(path, done) {
    log('cleaning files..' + util.colors.blue(path));
    return del(path, done);

}

function errorlogger(error) {
    log('errorLogger Start');
    log(error);
    log('errorLogger End');
    this.emit('end');
}

function log(msg) {
    if (typeof (msg) === "object") {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                log(util.colors.blue(msg[item]));
            }
        }
    } else {
        util.log(util.colors.red(msg));
    }
}


