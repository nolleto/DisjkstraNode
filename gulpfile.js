var gulp = require('gulp')
	, fs = require('fs')
	, babel = require("gulp-babel")
	, browserify = require('browserify')
	, server = require('gulp-express')
	, source = require('vinyl-source-stream')
	, babelify = require('babelify')
	, concatCss = require('gulp-concat-css')
	, less = require('gulp-less')
	, path = require('path');

gulp.task('app', function() {
	gulp.src('./server/**/*.js')
		.pipe(babel({presets: ['es2015']}))
		.pipe(gulp.dest('./build/server/'));

	return gulp.src('./app.js')
		.pipe(babel({presets: ['es2015']}))
		.pipe(gulp.dest('./build/'));
});

gulp.task('scripts', function() {
	browserify({ debug: true })
	  .transform(babelify, {presets: ['es2015']})
	  .require("./src/js/app.js", { entry: true })
	  .bundle()
	  .on("error", function (err) { console.log("Error: " + err.message); })
	  .pipe(fs.createWriteStream('./build/js/app.bundled.js'));
});

gulp.task('html', function() {
	gulp.src('./src/html/index.html')
		.pipe(gulp.dest('./build/html/'));

	gulp.src('./src/html/directives/*.html')
		.pipe(gulp.dest('./build/html/directives/'));
});

gulp.task('css', function() {
	gulp.src('./node_modules/bootstrap/dist/css/*.css')
			.pipe(concatCss('css/app.css'))
			.pipe(gulp.dest('./build'));
	gulp.src('./src/css/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./build/css'));
})

gulp.task('server', function () {
    //server.run(['./build/app.js']);
		server.run(['./app.js']);
});

gulp.task('watch', function() {
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/html/index.html', ['html']);
	gulp.watch('src/html/directives/**/*.html', ['html']);
	gulp.watch('./src/css/**/*.less', ['css']);
});

gulp.task('web', ['html', 'scripts', 'css']);
gulp.task('default', ['app', 'web', 'watch', 'server']);
