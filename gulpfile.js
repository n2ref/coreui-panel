const gulp       = require('gulp');
const concat     = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify     = require('gulp-uglify');
const minifyHtml = require("gulp-htmlmin");
const html2js    = require('gulp-html2js');
const cleanCSS   = require('gulp-clean-css');
const wrapFile   = require('gulp-wrap-file');
const rename     = require("gulp-rename");



var conf = {
    dist: "./dist",
    js: {
        file: 'coreui-panel.min.js',
        src: [
            'src/js/coreui.panel.js',
            'src/js/coreui.panel.templates.js',
            'src/js/coreui.panel.instance.js',
            'src/js/coreui.panel.ejs.js'
        ]
    },
    js_dependents: {
        dist: './src/js',
        src: [
            'node_modules/ejs/ejs.min.js'
        ],
        rename: {
            'ejs.min' : 'coreui.panel.ejs'
        },
        wrapper: function(content, file) {
            if (file.path.indexOf('ejs.min.js') >= 0) {
                return "(function() {" +
                           "\"use strict\";" +
                           content + ";" +
                           "CoreUI.panel.ejs = ejs;" +
                           "delete window.ejs;" +
                       "})();"
            }

            console.warn('!!! not found dependent wrapper for file: ' + file.path)
            return '';
        }
    },
    tpl: {
        file: 'coreui.panel.templates.js',
        dist: './src/js',
        variable: 'CoreUI"]["panel"]["tpl',
        src: [
            'src/html/**/*.html',
            'src/html/*.html'
        ]
    },
    css: {
        file: 'coreui-panel.min.css',
        src: [
            'node_modules/bootstrap-5-vertical-tabs/dist/b5vtabs.min.css',
            'src/css/coreui.panel.css'
        ]
    }
};



gulp.task('build_css', function(){
    return gulp.src(conf.css.src)
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(concat(conf.css.file))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_css_fast', function(){
    return gulp.src(conf.css.src)
        .pipe(sourcemaps.init())
        .pipe(concat(conf.css.file))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.dist));
});


gulp.task('build_js', function() {
    return gulp.src(conf.js.src)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat(conf.js.file, {newLine: ";\n"}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_js_fast', function() {
    return gulp.src(conf.js.src)
        .pipe(sourcemaps.init())
        .pipe(concat(conf.js.file, {newLine: ";\n"}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(conf.dist));
});

gulp.task('build_dependents', function() {

    return gulp.src(conf.js_dependents.src)
        .pipe(wrapFile({
            wrapper: conf.js_dependents.wrapper
        }))
        .pipe(rename(function (path) {
            if (conf.js_dependents.rename.hasOwnProperty(path.basename)) {
                path.basename = conf.js_dependents.rename[path.basename];
            }
        }))
        .pipe(gulp.dest(conf.js_dependents.dist));
});


gulp.task('build_tpl', function() {
    return gulp.src(conf.tpl.src)
        .pipe(minifyHtml({
            collapseWhitespace: false,
            ignoreCustomFragments: [ /<%[^%]+%>/ ]
        }))
        .pipe(html2js(conf.tpl.file, {
            adapter: 'javascript',
            base: 'templates',
            name: conf.tpl.variable,
            rename: function (moduleName) {
                return moduleName.replace('../src/html/', '');
            }
        }))
        .pipe(gulp.dest(conf.tpl.dist));
});


gulp.task('build_watch', function() {
    gulp.watch(conf.css.src, gulp.series(['build_css_fast']));
    gulp.watch(conf.tpl.src, gulp.series(['build_tpl', 'build_js_fast']));
    gulp.watch(conf.js.src, gulp.parallel(['build_js_fast']));
});

gulp.task("default", gulp.series([ 'build_tpl', 'build_js', 'build_css']));