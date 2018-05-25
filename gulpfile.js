const gulp         	= require('gulp'),
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
	notify 			= require("gulp-notify"),
    babel           = require('gulp-babel'),
    wait            = require('gulp-wait');

const dirs = {
    libs: 'libs/',
    scss: 'scss',
    css: 'css',
    es6: 'es6',
    js: 'js'
}

gulp.task('browser-sync', () => {
    browserSync.init({
        proxy: 'localhost',
        notify: false
    });
});

gulp.task('sass', () => {
    return gulp.src(dirs.scss + '/**/*.+(scss|sass)')
    .pipe(wait(500))
	.pipe(sourcemaps.init())
	.pipe(plumber({errorHandler: notify.onError((error) => {
		return {
			title: 'Error',
			message: error.message
		}
	})}))
	.pipe(sass({
        includePaths: ['node_modules']
    }))
    .pipe(autoprefixer({
        browsers: ['last 2 version'],
        remove: false
    }))
    .pipe(cssnano({
        zindex: false,
        autoprefixer: {
            remove: false
        }
    }))
    .pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest(dirs.css))
	.pipe(browserSync.stream({match: '**/*.css'}))
});

gulp.task('es6', () => {
    return gulp.src(dirs.es6 + '/**/*.js')
    .pipe(plumber({errorHandler: notify.onError((error) => {
		return {
			title: 'Error',
			message: error.message
		}
	})}))
    .pipe(babel({
        presets: ['es2015', 'babili']
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(dirs.js));
});

gulp.task('scripts', () => {
    return gulp.src([
        //dirs.libs + 'jQuery-viewport-checker/dist/jquery.viewportchecker.min.js',
    ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dirs.js));
});

gulp.task('css:libs', () => {
    return gulp.src('css/libs/*.css')
    .pipe(concat('libs.min.css'))
    .pipe(cssnano({zindex: false}))
    .pipe(gulp.dest(dirs.css));
});

gulp.task('watch', ['browser-sync', 'scripts', 'css:libs'], () => {
	gulp.watch(dirs.scss + '/**/*.+(scss|sass)', ['sass']);
	gulp.watch(dirs.es6 + '/**/*.js', ['es6']);
    gulp.watch(dirs.js + '/**/*.js', browserSync.reload);
});

gulp.task('default', ['watch']);
