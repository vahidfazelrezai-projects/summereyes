var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var exec = require('child_process').exec;

// run nodemon on the server file
gulp.task('server', function () {
    nodemon({script: 'server.js'});
});

// install npm dependencies
gulp.task('install', function () {
    exec('npm install');
});

// copy files from node_modules to lib folder
gulp.task('lib', function () {
    gulp.src('node_modules/materialize-css/dist/**/*')
        .pipe(gulp.dest('static/assets/lib/materialize/'));

    gulp.src('node_modules/jquery/dist/**/*')
        .pipe(gulp.dest('static/assets/lib/jquery/'));
});

// run npm install and copy potentially updated libraries
gulp.task('update', ['install', 'lib']);

// compile sass files into compressed css file
gulp.task('sass', function () {
    gulp.src('static/assets/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('static/assets/css'));
});

// watch for dev changes
gulp.task('watch', function () {
    gulp.watch('static/assets/scss/**/*.scss', ['sass']);
});

// start watching for file changes and run server
gulp.task('default', ['watch', 'server']);
