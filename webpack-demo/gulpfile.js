var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function() {
    gulp.src('src/scripts/app.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist'))
});