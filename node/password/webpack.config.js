var path = require('path');
var webpack = require('webpack');

module.exports = function(config) {
    var bulid = config.script.name.replace("js", 'build.js')
    return {
        //页面入口文件配置
        entry: {
            app:[config.script.src] 
                // vendor: ["jquery"]
        },
        // 表示这个依赖项是外部lib，遇到require它不需要编译，
        // 且在浏览器端对应window.React
        // externals: {
        //   'vue': 'window.vue'
        // },
        //出口文件输出配置
        output: {
            path     : config.script.dest,
            filename : config.script.name
        }
        // plugins: [
        //     new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ config.script.name, /* filename= */ bulid)
        // ]
    }

}