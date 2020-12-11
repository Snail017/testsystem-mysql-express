# 问卷系统开发  ---前端
## rem适配
1. 在assets目录下加入flexible.js文件。flexible.js为阿里团队开源的一个库。根据屏幕宽度，给根元素确定一个px字号，页面中的制作稿则统一使用rem这个单位来制作。使用flexible.js轻松搞定各种不同的移动端设备兼容自适应问题。
2. 在assets/css目录下创建config.scss。在config.scss里编写需要使用的scss方法，混入,变量等等.
```
// 将px转化为rem。设计稿的宽度为750px,所以是 $px / 25
@function rem ($px) {
    @return $px / 25+rem;
}
```