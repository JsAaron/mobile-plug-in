var lr = require('tiny-lr'),
    server = lr(),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    // livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify'), //js压缩
    minifycss = require('gulp-minify-css'), //css压缩
    plumber = require('gulp-plumber'), //阻止 gulp 插件发生错误导致进程退出并输出错误日志
    // webserver  = require('gulp-webserver'),
    opn = require('opn'),
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹
    // imagemin   = require('gulp-imagemin'),
    // pngquant   = require('imagemin-pngquant'),
    rename = require("gulp-rename"),
    zip = require('gulp-zip'),
    copy = require("gulp-copy"),
    connect = require('gulp-connect') //合并
notify = require('gulp-notify'); //提示

//http://www.browsersync.cn/docs/recipes/
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

//CommonJs
var gulpBrowserify = require('gulp-browserify');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

//webpack
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');


//=====================================
//  webpack打包
//=====================================
gulp.task("webpack", function(callback) {
    var myConfig = Object.create(webpackConfig);
    // run webpack
    webpack(
        // configuration
        myConfig,
        function(err, stats) {
            // if(err) throw new gutil.PluginError("webpack", err);
            // gutil.log("[webpack]", stats.toString({
            //   // output options
            // }));
            callback();
        });
});


//===================================
//  配置文件
//===================================
var src = "./develop";
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
    script: {
        allsrc: src + '/lib/*.js',
        src: src + '/lib/index.js',
        dest: dest
    },
    browserify: {
        debug: true,
        bundleConfigs: [{
            entries: src + '/lib/index.js',
            dest: dest,
            outputName: 'pwBox.js'
        }]
    },
    html: {
        dest: dest + "/*.html"
    }
}


//===================================
//  sass预编译
//===================================
gulp.task('sass', function() {
    gulp.src(config.sass.src)
        .pipe(sass())
        .pipe(plumber())
        .pipe(rename("pwBox.css"))
        .pipe(gulp.dest(config.sass.dest))
        .pipe(reload({
            stream: true
        }));
});


//===================================
//  清理文件
//===================================
gulp.task('clean', function() {
    return gulp.src(['*'], {
            read: false
        })
        .pipe(clean({
            force: true
        }))
});


//===================================
//  CommonJs 打包
//===================================

// 打印日志
var startTime;
var gutil = require('gulp-util');
var prettyHrtime = require('pretty-hrtime');
var bundleLogger = {
    start: function(filepath) {
        startTime = process.hrtime();
        gutil.log('Bundling', gutil.colors.green(filepath) + '...');
    },
    end: function(filepath, bytes) {
        var taskTime = process.hrtime(startTime);
        var prettyTime = prettyHrtime(taskTime);
        gutil.log('Bundled', gutil.colors.green(filepath), 'in', gutil.colors.magenta(prettyTime), bytes, "bytes.");
    }
};

//错误提示
function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    // Send error to notification center with gulp-notify
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};


//CommonJs 1
//browserify + watchify
//https://github.com/guotie/gulp-example/blob/master/gulpfile.js#L142
gulp.task('browserify', function(callback) {

    var bundleQueue = config.browserify.bundleConfigs.length;

    function browserifyThis(bundleConfig) {

        //配置browserify
        var bundler = browserify({
            // Required watchify args
            cache: {},
            packageCache: {},
            fullPaths: true,
            //入口
            entries: bundleConfig.entries,
            //激活source maps调试文件
            debug: config.browserify.debug
        });

        //打包
        var bundle = function() {
            // Log when bundling starts
            bundleLogger.start(bundleConfig.outputName);
            return bundler
                .bundle()
                // 错误编译
                .on('error', handleErrors)
                //转化流
                .pipe(source(bundleConfig.outputName))
                .pipe(gulp.dest(bundleConfig.dest))
                .pipe(reload({
                    stream: true
                }))
                .on('end', reportFinished)
        };

        if (global.isWatching) {
            //通过watchify包含browserify
            bundler = watchify(bundler);
            //更新后重新打包
            bundler.on('update', bundle);
        }

        var bytes;
        bundler.on('bytes', function(b) {
            console.log(11111111111111111)
            bytes = b
        });

        function reportFinished() {
            bundleLogger.end(bundleConfig.outputName, bytes)
            if (bundleQueue) {
                bundleQueue--;
                if (bundleQueue === 0) {
                    // If queue is empty, tell gulp the task is complete.
                    // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
                    callback();
                }
            }
        };

        return bundle();
    }

    config.browserify.bundleConfigs.forEach(browserifyThis);
});


//CommonJs 2 
//gulp-browserify
gulp.task('scripts', function() {
    gulp.src(config.script.src)
        // .pipe(gulpBrowserify({
        //   insertGlobals : true,
        //   debug : !gulp.env.production
        // }))
        .pipe(gulpBrowserify())
        .on('error', function(error) {
            console.log(String(error));
            this.end();
        })
        .pipe(rename('pwBox.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.script.dest))
        .pipe(reload({
            stream: true
        }));
});


//===================================
//  web服务
//===================================

// web服务 Server + watching scss/html files
gulp.task('web-server', ['sass', 'scripts'], function() {
    browserSync.init({
        server: dest
    });
    gulp.watch(config.sass.src, ['sass']);
    gulp.watch(config.script.allsrc, ['scripts']);
    gulp.watch(config.html.dest).on('change', reload);
});

gulp.task('setWatch', function() {
    global.isWatching = true;
});

gulp.task('watch', ['setWatch'], function() {
    gulp.run('web-server');
});

gulp.task('default', ['watch'])






// ===========================================================
//  其他
// ==========================================================


//开启本地 Web 服务器功能
gulp.task('webserver', function() {
    gulp.src('release')
        .pipe(
            webserver({
                host: config.localserver.host,
                port: config.localserver.port,
                livereload: true,
                open: true, //开打浏览器
                directoryListing: false //显示目录
            })
        );
});


//通过浏览器打开本地 Web服务器 路径
gulp.task('openbrowser', function() {
    opn('http://' + config.localserver.host + ':' + config.localserver.port);
});
