var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    concatCss = require('gulp-concat-css'),
    less = require('gulp-less'),
    path = require('path'),
    gulpif = require('gulp-if'),
    minimist = require('minimist'),
    replacer = require('gulp-replace'),
    stripDebug = require('gulp-strip-debug'),
    gutil = require('gulp-util'),
    csso = require('gulp-csso'),
    usemin = require('gulp-usemin'),
    cssnano = require('gulp-cssnano');

gulp.task('buildJsPlugin', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/lodash/lodash.js', //https://lodash.com/
            'node_modules/angular/angular.js',
            'node_modules/angular-cookies/angular-cookies.js',
            'node_modules/angular-touch/angular-touch.js',
            'node_modules/angular-sanitize/angular-sanitize.js',
            'node_modules/angular-ui-router/release/angular-ui-router.js', //https://github.com/angular-ui/ui-router
            'node_modules/angular-cache/dist/angular-cache.js',
            'node_modules/angular-auto-validate/dist/jcs-auto-validate.js', //http://jonsamwell.github.io/angular-auto-validate/
            'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js', //https://angular-ui.github.io/bootstrap/
            'node_modules/crypto-js/crypto-js.js', //https://github.com/brix/crypto-js

            //animate libs
            'node_modules/angular-animate/angular-animate.js', //https://github.com/angular/bower-angular-animate
            'node_modules/angular-ui-router-anim-in-out/anim-in-out.js', //https://github.com/homerjam/angular-ui-router-anim-in-out
            'node_modules/angular-loaders/dist/angular-loaders.js', //https://github.com/alexjoffroy/angular-loaders
            'node_modules/angular-loading-bar/build/loading-bar.js', //https://github.com/chieffancypants/angular-loading-bar
            'node_modules/angular-svg-round-progressbar/build/roundProgress.js', //https://github.com/crisbeto/angular-svg-round-progressbar     

            'node_modules/angular-slick-carousel/dist/angular-slick.js', //https://github.com/vasyabigi/angular-slick
            'node_modules/slick-carousel/slick/slick.js', //http://kenwheeler.github.io/slick/
            'node_modules/card/dist/card.js', //http://jessepollak.github.io/card/
            'node_modules/d3/d3.js', //https://github.com/d3/d3/wiki/Gallery
            'node_modules/ng-intl-tel-input/dist/ng-intl-tel-input.js', //https://github.com/hodgepodgers/ng-intl-tel-input

            'plugins/**/*.js',
            'src/modules/**/*.js',
            'src/pages/**/*.js',
            'src/modules.filters/**/*.js',
            'src/modules.services/**/*.js',
            'src/modules.utilities/**/*.js',
        ])
        .pipe(plumber())
        .pipe(concat('ly.dev.plugin.build.js'))
        // For production minify the js
        // .pipe(uglify({
        //     mangle: true,
        //     compress: true,
        //     output: { beautify: false }
        // }))
        // .pipe(stripDebug())
    .pipe(gulp.dest('build/'))
});

gulp.task('buildLessPlugin', function() {
    return gulp.src('styles/less/**/*.less')
        .pipe(less({
            paths: [path.join('../', 'less', 'includes')]
        }))
        .pipe(gulp.dest('styles/css'));
});

gulp.task('buildCssPlugin', function() {
    return gulp.src([
            'node_modules/slick-carousel/slick/slick.css',
            'node_modules/slick-carousel/slick/slick-theme.css',
            'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
            'node_modules/card/lib/card.css',
            //animate libs
            'node_modules/angular-ui-router-anim-in-out/css/anim-in-out.css',
            'node_modules/angular-loading-bar/build/loading-bar.min.css',
            'node_modules/loaders.css/loaders.min.css',

            'styles/css/plugins/**/*.css',
            'styles/css/**/*.css'
        ])
        // For production minify the css
        //.pipe(csso())
        .pipe(concatCss("ly.plugin.build.css"))
        .pipe(replacer('../../../styles/css/plugins/bootstrap/glyphicons-halflings-regular', '../build/fonts/glyphicons-halflings-regular'))
        .pipe(replacer('../../../styles/images', '../images'))

    // For production minify the css
    // .pipe(usemin())
    // .pipe(cssnano())
    .pipe(gulp.dest('build/'))
});

gulp.task('docs', [], function() {
    var gulpDocs = require('gulp-ngdocs');

    var options = {
        html5Mode: true,
        title: "Lotto Yard API Docs",
        titleLink: "http://wp.icelotto.dev/wp-content/plugins/lotto-yard/readme/index.html",
        inlinePartials: false,
        bestMatch: false,
    }

    return gulp.src('src/**/*.js')
        .pipe(gulpDocs.process(options))
        .pipe(gulp.dest('./../readme'));
});

gulp.task('watch', ['buildJsPlugin', 'buildLessPlugin', 'buildCssPlugin'], function() {
    //plugins watch js
    gulp.watch(['src/**/*.js'], ['buildJsPlugin']);

    //plugins watch less
    gulp.watch(['styles/less/**/*.less'], ['buildLessPlugin']);

    //plugins watch css
    gulp.watch(['styles/css/**/*.css'], ['buildCssPlugin']);
});

gulp.task('r', ['watch', 'buildJsPlugin', 'buildLessPlugin', 'buildCssPlugin']);