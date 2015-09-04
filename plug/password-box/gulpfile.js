var gulp = require('gulp');

//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


// web服务 Server + watching scss/html files
gulp.task('web-server', function() {
    browserSync.init({
        server: 'app'
    });
    gulp.watch('app/*.css', function(){
        gulp.src('app/*.css')
            .pipe(reload({
                stream: true
            }));
    });
    gulp.watch('app/*.js', function() {
        gulp.src('app/*.js')
            .pipe(reload({
                stream: true
            }));
    });
});

gulp.task('watch', function() {
    gulp.run('web-server');
});

gulp.task('default', ['watch'])
