var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var cssnano = require('gulp-cssnano');

/*********************************************************************************
CSS
*********************************************************************************/

gulp.task('less', function() {
  return gulp.src('src/less/app.less')
    .pipe(less())
    .pipe(gulp.dest('public/css'));
});

gulp.task('minifyCss', ['less'], function() {
	return gulp.src('public/css/app.css')
	.pipe(cssnano())
	.pipe(rename('app.min.css'))
	.pipe(gulp.dest('public/css'));
});

/*********************************************************************************
JAVASCRIPT
*********************************************************************************/

gulp.task('concatJs', function() {
	return gulp.src([
		'src/js/app_module.js',
		'src/js/_controller_auth.js',
		'src/js/_factory_auth.js',
		'src/js/_controller_companies.js',
		'src/js/_factory_companies.js',
		'src/js/_controller_mailing.js',
		'src/js/_factory_mailing.js'
		])
	.pipe(concat('app.js'))
	.pipe(gulp.dest('public/js'));
});

gulp.task('minifyJs', ['concatJs'], function(){
	return gulp.src('public/js/app.js')
	.pipe(uglify())
	.pipe(rename('app.min.js'))
	.pipe(gulp.dest('public/js'))
})

/*********************************************************************************
PHP
*********************************************************************************/

gulp.task('php', function(){
	return gulp.src('src/php/**/*.php')
	.pipe(gulp.dest('public/php'));
});

/*********************************************************************************
WATCH
*********************************************************************************/

gulp.task('watch', function(){
	gulp.watch('src/js/**/*.js', ['minifyJs']);
	gulp.watch('src/less/**/*.less', ['minifyCss']);
	gulp.watch('src/php/**/*.php', ['php']);
});

/*********************************************************************************
DEFAULT
*********************************************************************************/

gulp.task('default', ['minifyCss', 'minifyJs', 'php', 'watch']);