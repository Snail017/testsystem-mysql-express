
const path = require('path')

const resolve = dir => path.join(__dirname, dir)
const CompressionPlugin = require('compression-webpack-plugin');//引入gzip压缩插件
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = {
    // 基本路径
    publicPath: "./",
    // 输出文件目录
    outputDir: "dist",
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    // use the full build with in-browser compiler?
    // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
    // compiler: false,
    // webpack配置
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("_A", resolve("src/assets"))
            .set("_CSS", resolve("src/assets/css"))
            .set("_IMG", resolve("src/assets/images"))
        const oneOfsMap = config.module.rule('scss').oneOfs.store

        // 编译sass scss文件
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: [
                        './src/assets/css/config.scss',
                    ],
                })
                .end()
        })
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end();

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
        //压缩图片
        config.module.rule('images')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })

        //压缩文件
        config.plugin('compressionPlugin')
            .use(new CompressionPlugin({
                test: /\.js$|\.html$|\.css/,//匹配文件名 
                threshold: 10240, // 对超过10k的数据压缩
                deleteOriginalAssets: false // 不删除源文件
            }))

    },

    configureWebpack: config => {
        config.module.rules.push({
            test: /\.pdf$/,
            use: [{
                loader: 'file-loader', // pdf支持
                options: {
                    name: 'pdf/[name].[hash:8].[ext]'
                }
            }]
        })
    },

    // vue-loader 配置项
    // https://vue-loader.vuejs.org/en/options.html
    // vueLoader: {},
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    // css相关配置
    css: {
        // 是否使用css分离插件 ExtractTextPlugin
        extract: false,
        // 开启 CSS source maps?
        sourceMap: false,
        // css预设器配置项
        loaderOptions: {
            //向所有 Sass/Less 样式传入共享的全局变量
            scss:{
                additionalData:'@import "~@/assets/css/config.scss";'
            },
        },
        // 启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true,
    },
    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    // parallel: require('os').cpus().length > 1,
    // 是否启用dll
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
    // dll: false,
    // PWA 插件相关配置
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},
    // webpack-dev-server 相关配置
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

};
