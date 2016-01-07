var gulp = require('gulp');
var minify = require('gulp-minify');

gulp.task('compress', function() {
    gulp.src('codename.linker.js')
        .pipe(minify({
            exclude: ['tasks'],
            ignoreFiles: []
        }))
        .pipe(gulp.dest('.'))
});

gulp.task('default', function() {
    console.log ('working');
});