var lr = require('tiny-lr'),
     server     = lr(),
     gulp       = require('gulp'),
     sass       = require('gulp-sass'),
     livereload = require('gulp-livereload'),
     uglify     = require('gulp-uglify'), //js压缩
     minifycss  = require('gulp-minify-css'), //css压缩
     plumber    = require('gulp-plumber'), //阻止 gulp 插件发生错误导致进程退出并输出错误日志
     webserver  = require('gulp-webserver'),
     opn        = require('opn'),
     concat     = require('gulp-concat'),//合并文件
     clean      = require('gulp-clean'), //清空文件夹
     imagemin   = require('gulp-imagemin'),
     pngquant   = require('imagemin-pngquant'),
     rename     = require("gulp-rename"),
     zip        = require('gulp-zip'),
     copy       = require("gulp-copy"),
     connect    = require('gulp-connect');

var config = {
    localserver:{
        host:'localhost',
        port:'8888'
    }

}

//压缩JS
gulp.task('minifyjs', function() {
    gulp.src('lib/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/temp_js'))
});

//合并JS  
gulp.task('alljs', function() {
    return gulp.src('build/temp_js/*.js')
        .pipe(concat('xxtppt.min.js'))
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

//重命名project.md 文件
gulp.task('rename', function() {
    return gulp.src("./Project.md")
        .pipe(rename("README.md"))
        .pipe(gulp.dest("./build"));
});

//开启本地 Web 服务器功能
gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(
            webserver({
                host: config.localserver.host,
                port: config.localserver.port,
                livereload: true,
                open:false, //开打浏览器
                directoryListing: false //显示目录
            })
        );
});

//通过浏览器打开本地 Web服务器 路径
gulp.task('openbrowser', function() {
    opn('http://' + config.localserver.host + ':' + config.localserver.port);
});


//SASS编译
gulp.task('sass', function() {
    gulp.src('develop/sass/*.scss')
        .pipe(sass())
        .pipe(plumber())
        .pipe(rename("pwBox.css"))
        .pipe(gulp.dest('release'))
});

// 监听任务 运行语句 gulp watch
gulp.task('watch', function() {
    // 监听css
    gulp.watch('develop/sass/*.scss', function(){
        gulp.run('sass');
    });


    // gulp.watch('./sass/*.scss', function(e) {
    //     gulp.run('sass');
    //     server.changed({
    //         body: {
    //             files: [e.path]
    //         }
    //     });
    // });

    // gulp.watch(['./sass/*.scss', './*.html', './*.php', './*.css', './js/*.js'], function(e) {
    //     server.changed({
    //         body: {
    //             files: [e.path]
    //         }
    //     });
    // });

});

//默认任务
gulp.task('default', function() {
    // gulp.run('sass');
    gulp.run('watch');
    // gulp.run('webserver');
    // gulp.run('openbrowser');
});

//多余文件删除
gulp.task('clean', function() {
    return gulp.src(['build/temp_js/*','build/temp_css/*'],{read:false})
        .pipe(clean({
            force: true
        }))
});


//项目完成提交任务
gulp.task('build', function() {
    gulp.run('imagemin');
    gulp.run('sass');
    gulp.run('minifyjs');
    gulp.run('alljs');
    gulp.run('buildfiles');
    gulp.run('rename');
    //gulp.run('clean');
});

//项目完成提交任务
gulp.task('build2', function() {
    gulp.run('tinypng');
    gulp.run('sass');
    gulp.run('minifyjs');
    gulp.run('alljs');
    gulp.run('buildfiles');
    gulp.run('rename');
    //gulp.run('clean');
});

