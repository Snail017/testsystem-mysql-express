# 问卷系统开发  ---前端
## rem适配
1. 在assets目录下加入flexible.js文件。flexible.js为阿里团队开源的一个库。根据屏幕宽度，给根元素确定一个px字号，页面中的制作稿则统一使用rem这个单位来制作。使用flexible.js轻松搞定各种不同的移动端设备兼容自适应问题。
2. 在assets/css目录下创建config.scss。在config.scss里编写需要使用的scss方法，混入,变量等等.
```
// 将px转化为rem。设计稿以iphone7为模版，宽度为375px,所以是 $px / 12.5
@function rem ($px) {
    @return $px / 12.5+rem;
}
```
3. 安装sass-loader ，node-sass。 编译scss样式文件
 ```
 npm install --save-dev sass-loader
 npm install --save-dev node-sass
 ```
 4. vue.config.js中配置config.scss。全局配置最好只放入css变量，配置普通css会导致样式重复。
 ```
    // vue.config -> module.css
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
                 // 如果 sass-loader 版本 = 8，这里使用 `prependData` 字段
                 // 如果 sass-loader 版本 < 8，这里使用 `data` 字段
                additionalData:'@import "~@/assets/css/config.scss";'
            },
        },
        // 启用 CSS modules for all css / pre-processor files.
        requireModuleExtension: true,
    },
 ```

 ## 打包文件的压缩优化 
 1. 安装压缩文件,压缩图片 插件
 ```
 npm i compression-webpack-plugin --save-dev
 npm i image-webpack-loader --save-dev
 ```
 2. 编写vue.config ,使vue项目运行时对文件进行压缩
 ```
 //vue.config -->module.chainWebpack
 const CompressionPlugin = require('compression-webpack-plugin');//引入gzip压缩插件

 // webpack配置
   chainWebpack: config => {

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
   }

 ```

 ## 滚动行为在组件之间相互影响的解决办法
 使用路由提供的钩子函数
 ```
    router.afterEach((to,from,next) => {
        window.scrollTo(0,0)
    });
 ```

 ## 多个组件中监听vuex中同一个action的回调，如何避免重复执行方法
 多个组件同时发出请求，第一个请求赋值给该变量，其他情况直接返回该变量
 ```
 //store.js 文件
    const state={
        web3:null
    };
    var flag=false;
    var fun=null;
    const action={
        myFunction(){
            //如果有数据直接返回
            if (state.web3) {   
                Promise.resolve(state.web3)
                    return   
                }else{
                    //如果没有数据且是第一次请求则执行函数
                    if(!falg){
                        falg=true;
                        fun=new Promise((resolve,reject)=>{
                            ajax('*****').then(res=>{
                                state.web3=res
                                resolve(res)
                            }).catch(err=>{
                                //报错情况下可以再次执行函数
                                    falg=false;
                            })
                        })
                    }
                    //如果没有数据但是不是第一次请求直接返回promise函数
                return fun
            }
        }
    }
 ```

 ## 滚动行为在组件之间相互影响的解决办法
 使用路由提供的钩子函数,在路由离开时滚动到最顶部。
``` 
//router.js 
router.afterEach((to,from,next) => {
    window.scrollTo(0,0)
});
```