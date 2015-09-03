var lr = require('tiny-lr'),
     server     = lr(),
     gulp       = require('gulp'),
     sass       = require('gulp-sass'),
     // livereload = require('gulp-livereload'),
     uglify     = require('gulp-uglify'), //js压缩
     minifycss  = require('gulp-minify-css'), //css压缩
     plumber    = require('gulp-plumber'), //阻止 gulp 插件发生错误导致进程退出并输出错误日志
     // webserver  = require('gulp-webserver'),
     opn        = require('opn'),
     concat     = require('gulp-concat'),//合并文件
     clean      = require('gulp-clean'), //清空文件夹
     imagemin   = require('gulp-imagemin'),
     pngquant   = require('imagemin-pngquant'),
     rename     = require("gulp-rename"),
     zip        = require('gulp-zip'),
     copy       = require("gulp-copy"),
     connect    = require('gulp-connect');

//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

var browserify = require('browserify');
var b = browserify();


var src  = "./develop";
var dest = "./release";
var config = {
    localserver: {
        host: 'localhost',
        port: '8888'
    },
    sass: {
        src: src + "/sass/*.{sass,scss}",
        dest: dest
    },
    browserify:{

    },
    html: {
        dest: dest + "/*.html"
    }
}


//SASS编译
gulp.task('sass', function() {
    gulp.src(config.sass.src)
        .pipe(sass())
        .pipe(plumber())
        .pipe(rename("pwBox.css"))
        .pipe(gulp.dest(config.sass.dest))
        .pipe(reload({stream: true}));
});

//CommonJs
gulp.task('browserify',function(){

});

// web服务 Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: dest
    });
    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.develop_js, ['script']);
    gulp.watch(config.html.dest).on('change', reload);
});

gulp.task('setWatch', function() {
    global.isWatching = true;
});

gulp.task('watch', ['setWatch', 'browserify'], function() {
    gulp.run('serve');
});

gulp.task('default', ['watch'])

// ===========================================================
// 
// 
// 
// ==========================================================


//开启本地 Web 服务器功能
gulp.task('webserver', function() {
    gulp.src('release')
        .pipe(
            webserver({
                host: config.localserver.host,
                port: config.localserver.port,
                livereload: true,
                open:true, //开打浏览器
                directoryListing: false //显示目录
            })
        );
});

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



//通过浏览器打开本地 Web服务器 路径
gulp.task('openbrowser', function() {
    opn('http://' + config.localserver.host + ':' + config.localserver.port);
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

