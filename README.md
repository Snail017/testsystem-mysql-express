# 问卷系统开发

### 安装
```
cnpm i    //使用淘宝镜像安装更快
```
### 运行
```
npm run serve  //启动前端服务打开页面
npm run node   //启动后端服务
npm run app    //前端，后端同时启动
```
### 编译
```
npm run deploy:dev    //编译同时发布到测试服务器
npm run deploy:prod    //编译同时发布到正式服务器
```
## 前端详解 [🔗](web.md)


## 服务端详解 [🔗](server.md)
1. 数据库：使用sequelize 操作mysql数据库。redis存放token
2. 数据加密：使用RES非对称加密加密用户信息
3. 用户认证:使用JWT方式实现token认证。设置token自动刷新时间，实现用户自动登录

## 自动部署 [🔗](deploy.md)
1. 安装 :  npm i --save-dev scp2 cross-env
2. 配置测试环境/正式环境 :  创建 .env.* 文件
3. 配置服务器SSH远程登陆账号信息 : 创建 deploy/products.js 文件
4. 编译自动化部署脚本 : 创建 deploy/index.js
5. 添加 package.json 中的 scripts 命令, 自定义名称为 "deploy"
