const path = require('path');

function resolve(_dir) {
	return path.join(__dirname, _dir)
}
const webpack = require("webpack")
let webpackConfig = {
    configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				$: "jquery",
				jQuery: "jquery",
				"windows.jQuery": "jquery"
			}),
		]
	},

    chainWebpack: config => {
		config.resolve.alias.set('@', resolve('/src'));
		config.resolve.symlinks(true);
	},

    devServer: {
		hot: true,
		disableHostCheck: true,
		// 设置代理
		proxy: {
			'/': {
				ws: false,
				target: 'http://localhost:3000',
				changeOrigin: true,
				pathRewrite: {
					'^/': '/'
				}
			},
		}
	},

    css: {
      extract: false
    }
}
module.exports = webpackConfig;
