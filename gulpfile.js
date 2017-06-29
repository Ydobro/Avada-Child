var gulp         	= require('gulp'),
    sass         	= require('gulp-sass'),
    browserSync  	= require('browser-sync').create(),
    concat       	= require('gulp-concat'),
    uglify       	= require('gulp-uglifyjs'),
    cssnano      	= require('gulp-cssnano'),
    rename       	= require('gulp-rename'),
    autoprefixer 	= require('gulp-autoprefixer'),
	sourcemaps 	 	= require('gulp-sourcemaps'),
	spritesmith  	= require('gulp.spritesmith'),
	plumber 		= require('gulp-plumber'),
	notify 			= require("gulp-notify");

var dist = '',
    libs_dist = dist + 'libs/',
	scss_dist = dist + 'scss',
	css_dist = dist + 'css',
	js_dist = dist + 'js';

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: 'localhost',
        notify: false
    });
});

gulp.task('sass', function() {
    return gulp.src(scss_dist + '/**/*.+(scss|sass)')
	//.pipe(sourcemaps.init())
	.pipe(plumber({errorHandler: notify.onError(function(error) {
		return {
			title: 'Error',
			message: error.message
		}
	})}))
	.pipe(sass())
    .pipe(autoprefixer(['last 50 versions']))
	.pipe(cssnano({zindex: false}))
    .pipe(rename({suffix: '.min'}))
	//.pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest(css_dist))
	.pipe(browserSync.stream({match: '**/*.css'}))
});

gulp.task('scripts', function() {
    return gulp.src([
        libs_dist + 'slick-carousel/slick/slick.min.js',
        libs_dist + 'jQuery-viewport-checker/dist/jquery.viewportchecker.min.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(js_dist));
});

gulp.task('watch', ['browser-sync', 'scripts'], function() {
	gulp.watch(scss_dist + '/**/*.+(scss|sass)', ['sass']);
    gulp.watch(js_dist + '/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);
