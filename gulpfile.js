var concat, gulp, gutil, sass, uglify, imagemin,
    browserSync, autoprefixer, gulpSequence, shell, plumber, cleanCSS, uncss, staticHash, version, nunjucksRender;
var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

gulp = require('gulp');
gutil = require('gulp-util');
concat = require('gulp-concat');
uglify = require('gulp-uglify');
sass = require('gulp-sass');
imagemin = require('gulp-imagemin');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell = require('gulp-shell');
plumber = require('gulp-plumber');
cleanCSS = require('gulp-clean-css');
uncss = require('gulp-uncss');
staticHash = require('gulp-static-hash');
version = require('gulp-version-number');
nunjucksRender = require('gulp-nunjucks-render');

var cssFiles = [
    'node_modules/bootstrap/dist/css/bootstrap.css',
    'node_modules/font-awesome/css/font-awesome.min.css',
    'src/css/style.css',
    'src/css/slick.css',
    'src/css/custom.css'
];

var scriptFiles = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.js',
    'node_modules/slick-carousel/slick/slick.min.js',
    'src/js/custom.js'
];

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: "build/"
        },
        options: {
            reloadDelay: 250
        },
        notify: true
    });
});

gulp.task('images', function (tmp) {
    gulp.src(['src/images/*.jpg', 'src/images/*.png'])
        .pipe(plumber())
        .pipe(imagemin({optimizationLevel: 5, progressive: true, interlaced: true}))
        .pipe(gulp.dest('build/images'));
});

gulp.task('css', function () {
    return gulp.src(cssFiles)
        .pipe(plumber())
        .pipe(concat('build.css'))
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function () {
    return gulp.src(scriptFiles)
        .pipe(plumber())
        .pipe(concat('build.js'))
        // .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest('build/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function () {
    return gulp.src(['src/sass/style.scss'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass({
            errLogToConsole: true,
            includePaths: [
                'src/sass'
            ]
        }))
        .pipe(autoprefixer({
            browsers: autoPrefixBrowserList,
            cascade: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('html', function () {
    return gulp.src('src/views/renders/**.html')
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}))
        .on('error', gutil.log);
});


gulp.task('clean', function () {
    return shell.task([
        'rm -rf dist'
    ]);
});

gulp.task('clean-build', function () {
    return shell.task([
        'rm -rf build'
    ]);
});

gulp.task('nunjucks', function () {

    return gulp.src('src/views/pages/*.+(nunjucks)')
        .pipe(nunjucksRender({
            path: ['src/views/']
        }))
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}))
        .pipe(gulp.dest('build/'));

});

gulp.task('copy-assets', function () {

    gulp.src(['src/fonts/**/*', 'node_modules/font-awesome/fonts/*'])
        .pipe(plumber())
        .pipe(gulp.dest('build/fonts'));

    gulp.src('src/svg/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('build/svg'));

    gulp.src('src/images/**/*')
        .pipe(plumber())
        .pipe(gulp.dest('build/images'));

});

gulp.task('deploy', function () {
    gulp.src(scriptFiles)
        .pipe(plumber())
        .pipe(concat('build.js'))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(gulp.dest('build/js'));

    gulp.src(cssFiles)
        .pipe(plumber())
        .pipe(concat('build.css'))
        .pipe(cleanCSS({
            compatibility: 'ie8', level: {
                1: {
                    specialComments: 0
                }
            }
        }))
        .pipe(gulp.dest('build/css'));

    gulp.src('build/*.html')
        .pipe(staticHash({asset: 'static'}))
        .pipe(gulp.dest('build/'));

});

gulp.task('default', function () {
    gulp.start(['clean-build', 'nunjucks', 'scripts', 'sass', 'html', 'css', 'browserSync']);
    gulp.watch("src/views/**/*.+(html|nunjucks)", ['nunjucks', 'copy-assets']);
    gulp.watch('src/js/**', ['scripts']);
    gulp.watch('src/css/**', ['css', 'copy-assets']);
    gulp.watch('src/sass/**', ['sass']);
    gulp.watch('src/images/**', ['images', 'copy-assets']);
    gulp.watch('src/*.html', ['html']);
});
