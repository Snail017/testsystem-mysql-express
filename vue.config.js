const path = require('path');
function resolve(_dir) {
    return path.join(__dirname, _dir)
}
const webpack=require("webpack")
let webpackConfig  = {
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $:"jquery",
                jQuery:"jquery",
                "windows.jQuery":"jquery"
            }),
        ]
    },
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src'))
    },
    devServer: {
        disableHostCheck: true,
        // 设置代理
        proxy: {
            //         '/': {
//             target: 'http://zq.schat.weile.com:80/',
//             changeOrigin: true,
//             pathRewrite: {
//                 '^/': '/'
//             }
//         },
            '/': {
                ws: false,
                target: 'http://zq.oss.admin.com:80/',
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/'
                }
            },
        }
    },

    outputDir: undefined,
    assetsDir: undefined,
    runtimeCompiler: undefined,
    productionSourceMap: undefined,
    parallel: undefined,

    css: {
      extract: false
    }
}
module.exports = webpackConfig;