var path = require('path');
var webpack = require('webpack');

module.exports = {
	//页面入口文件配置
    entry: {
    	app:path.resolve(__dirname, 'app/main.js')
    	// vendor: ["jquery"]
    },
    //出口文件输出配置
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
	plugins: [
		new webpack.optimize.CommonsChunkPlugin( /* chunkName= */ "vendor", /* filename= */ "vendor.bundle.js")
	]
};