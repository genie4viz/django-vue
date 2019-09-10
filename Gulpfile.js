var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var minifyJS = require('gulp-minify');
var sass = require('gulp-sass');
var streamqueue = require('streamqueue');

gulp.task('styles', function() {
    var vendorStyles = gulp.src([
            './node_modules/leaflet/dist/leaflet.css',
            './libs/leaflet-marker-cluster-1.0.0/MarkerCluster.Default.css',
            './libs/leaflet-marker-cluster-1.0.0/MarkerCluster.css',
            './libs/leaflet-zoomhome/leaflet.zoomhome.css',
            './node_modules/leaflet-draw/dist/leaflet.draw-src.css',
            './libs/mailchimp/embedcode/horizontal-slim-10_7.css',
            './node_modules/font-awesome/css/font-awesome.css'])
        .pipe(concat('vendor-styles.css'));

    var customStyles = gulp.src('./scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('custom-files.css'));

    if (process.env.NODE_ENV !== 'local') {
        return streamqueue(
                {objectMode: true},
                vendorStyles,
                customStyles)
            .pipe(concat('main.min.css'))
            .pipe(minifyCSS())
            .pipe(gulp.dest('./hikster/static/css/'));
    }
    else {
        return streamqueue(
                {objectMode: true},
                vendorStyles,
                customStyles)
            .pipe(concat('main.min.css'))
            .pipe(gulp.dest('./hikster/static/css/'));
    }
});

gulp.task('vendor-scripts', function() {
    return gulp.src([
            './node_modules/leaflet/dist/leaflet.js',
            './node_modules/esri-leaflet/dist/esri-leaflet.js',
            './libs/leaflet-marker-cluster-1.0.0/leaflet.markercluster.js',
            './libs/leaflet-zoomhome/leaflet.zoomhome.js',
            './libs/leaflet-filelayer/leaflet.filelayer.js',
            './node_modules/leaflet-draw/dist/leaflet.draw.js',
            './libs/classie-1.0.1/classie.js'])
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest('./hikster/static/js/'));
});

gulp.task('scripts', function() {
    if (process.env.NODE_ENV !== 'local') {
        return gulp.src(['./hikster/static/js/bundle.js'])
            .pipe(minifyJS({
                ext: {
                    src: '.js',
                    min: '.min.js'
                }
            }))
            .pipe(gulp.dest('./hikster/static/js/'));
    }
    else {
        return gulp.src(['./hikster/static/js/bundle.js'])
            .pipe(concat('bundle.min.js'))
            .pipe(gulp.dest('./hikster/static/js/'));
    }
});

gulp.task('watch', function() {
    gulp.watch('./scss/**/*.scss',['styles']);
});