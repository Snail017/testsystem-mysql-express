# 问卷系统开发  ---  自动部署

本教程是Vue项目下，利用scp2自动部署到静态文件，使用cross-env跨平台地设置及使用环境变量，设置生产环境还是开发环境。

涉及的配置文件：

1. /deploy/*， 编译部署代码
2. .env.*，项目环境设置文件，打包时区分开发环境，生产环境。
3. package.json中script模块，配置执行命令

## 一 安装

1. 安装scp2:**一个基于ssh2的纯JavaScript安全复制程序**。它是用纯JavaScript编写的，并且可以在每个OS上运行，甚至在Windows上也可以。必须使用Nodejs（v0.8.7或更高版本）才能使其正常工作。
2. 安装cross-env ：**这是一款运行跨平台设置和使用环境变量的脚本**。NODE_ENV=production像这样设置环境变量时，大多数Windows命令提示符都会阻塞 。

```
npm i --save-dev scp2 cross-env
```

## 二 配置测试环境/正式环境

1. 在项目根目录下, 创建 .env.dev 文件 (测试环境变量)

- VUE_APP_SERVER_ID变量表示 当前需部署的测试服务器ID为1
- VUE_APP_CURRENTMODE:当前测试环境
- Vue-cli3项目打包 生产环境和正式环境都是按照正式环境编译NODE_ENV = production

```
// .env.dev文件中
NODE_ENV = production
VUE_APP_CURRENTMODE = development
VUE_APP_SERVER_ID = 1
```

2. 在项目根目录下, 创建 .env.prod 文件 (生产环境变量)

- VUE_APP_SERVER_ID变量表示 当前需部署的正式服务器ID为0
- VUE_APP_CURRENTMODE:当前正式环境

```
// .env.prod文件中
NODE_ENV = production

VUE_APP_CURRENTMODE = production

VUE_APP_SERVER_ID = 0
```

## 三 配置服务器SSH远程登陆账号信息

在根目录下,创建 deploy/products.js 文件,编写服务器账号

```
/*
* 读取env环境变量
*/
const fs = require('fs');
const path = require('path');
// env 文件 判断打包环境指定对应的服务器id
const envfile = process.env.VUE_APP_CURRENTMODE === 'prod' ? '../.env.prod' : '../.env.dev';
// env环境变量的路径
const envPath = path.resolve(__dirname, envfile);
// env对象
const envObj = parse(fs.readFileSync(envPath, 'utf8'));
const SERVER_ID = parseInt(envObj['VUE_APP_SERVER_ID']);

function parse(src) {
  // 解析KEY=VAL的文件
  const res = {};
  src.split('\n').forEach(line => {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    // eslint-disable-next-line no-useless-escape
    const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1];
      let value = keyValueArr[2] || '';

      // expand newlines in quoted values
      const len = value ? value.length : 0;
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n');
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim();

      res[key] = value;
    }
  });
  return res;
}

/*
*定义多个服务器账号 及 根据 SERVER_ID 导出当前环境服务器账号
*/
const SERVER_LIST = [
  {
    id: 0,
    name: 'A-正式环境',
    "host": '******', // IP地址
    "port": '80',            // 服务器端口
    "username": 'root',       // 用户名
    "password": '*******',     // 密码
    "path": '/home/project/landingpage/'  , //服务器项目目录
    'localfile':envObj.VUE_APP_DEV   //本地打包文件名
  },
  {
    id: 1,
    name: 'A-生产环境',
    "host": '******', // IP地址
    "port": '443',            // 服务器端口
    "username": 'root',       // 用户名
    "password": '******',     // 密码
    "path": '/home/project/landingpage/' ,  //服务器项目目录
    'localfile':envObj.VUE_APP_DEV   //本地打包文件名
  },
];
module.exports = SERVER_LIST[SERVER_ID];
  
```

## 四 编译自动化部署脚本

在项目根目录下, 创建 deploy/index.js 文件.
1. 先删除服务器之前的文件。防止一直上传导致冗余文件过多。
2. 再上传新的文件到服务器，替换到原来的文件夹下。

问题：在文件上传的过程中，如果文件过大，上传时间过久。会导致服务器有一段时间差打不开。

```
const scpClient = require('scp2');
const ora = require('ora');
const chalk = require('chalk');
const server = require('./products');
const spinner = ora(
  '正在发布到' +
    (process.env.VUE_APP_CURRENTMODE === 'prod' ? '生产' : '测试') +
    '服务器...'
);

var Client = require('ssh2').Client;

var conn = new Client();
conn
  .on('ready', function() {
    // rm 删除dist文件，\n 是换行 换行执行 重启nginx命令 我这里是用docker重启nginx
    conn.exec('rm -rf '+server.path+'\ndocker restart nginx', function(
      err,
      stream
    ) {
      if (err) throw err;
      stream
        .on('close', function(code, signal) {
          // 在执行shell命令后，把开始上传部署项目代码放到这里面
          spinner.start();
          scpClient.scp(
            server.localfile,
            {
              host: server.host,
              // port: server.port,
              username: server.username,
              password: server.password,
              path: server.path
            },
            function(err) {
              spinner.stop();
              if (err) {
                console.log(chalk.red('发布失败.\n'));
                throw err;
              } else {
                console.log(
                  chalk.green(
                    'Success! 成功发布到' +
                      (process.env.NODE_ENV === 'prod'
                        ? '生产'
                        : '测试') +
                      '服务器! \n'
                  )
                );
              }
            }
          );

          conn.end();
        })
        .on('data', function(data) {
          console.log('STDOUT: ' + data);
        })
        .stderr.on('data', function(data) {
          console.log('STDERR: ' + data);
        });
    });
  })
  .connect({
    host: server.host,
    // port: server.port,
    username: server.username,
    password: server.password
    //privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
  });
```

## 五 添加 package.json 中的 scripts 命令, 自定义名称为 "deploy"

使用cross-env跨平台地设置及使用环境变量。发布到测试环境命令为 npm run deploy:dev,生产环境为 npm run deploy:prod

```
 "scripts": {
    "serve": "vue-cli-service serve  --open ",
    "app": "npm run serve && npm run node",
    "build": "vue-cli-service build",
    "node": "node ./server/app.js",
    "deploy:dev": "npm run build && cross-env VUE_APP_CURRENTMODE=dev node ./deploy",
    "deploy:prod": "npm run build && cross-env VUE_APP_CURRENTMODE=prod node ./deploy",
    "test:unit": "vue-cli-service test:unit"
  },
```

## 六 优化版编译自动化部署脚本：为了解决上传过程中服务器打不开的问题
1. 先安装compressing插件，将打包文件夹压缩。
  ```
  npm i compressing --save-dev
  ```
2. 再将压缩文件上传服务器。
3. 最后链接服务器，将原文件删除后，解压最新上传的文件。
```
const scpClient = require('scp2');
const chalk = require('chalk');
const server = require('./products');
const Client = require('ssh2').Client;
const conn = new Client();
const ora = require('ora');
var compressing = require("compressing");
const { localpath } = require('./products');
const environment = server.path+server.localpath
const spinner = ora('正在发布到' + environment + '服务器...');
const ziping = ora('正在压缩' + environment);
//压缩
ziping.start()
compressing.zip.compressDir( server.localpath + "/", "dist.zip")
  .then((e) => {
    console.log(chalk.green('压缩成功'));
    ziping.stop()
    spinner.start();
    scpClient.scp(
      'dist.zip',
      {
        host: server.host,
        // port: server.port,
        username: server.username,
        password: server.password,
        path: server.path
      },
      (err) => {
        spinner.stop();
        if (err) {
          console.log(chalk.red('发布失败.\n'));
          throw err;
        } else {
          conn.on('ready', () => {
            conn.exec('cd '+server.path+' \nrm -rf '+server.localpath+'\nunzip -o dist.zip', (err, stream) => {
              if (err) throw err;
              console.log(chalk.green('Success! 成功发布到' + environment + '服务器! \n'));
              conn.end()
            })
          }).connect({
            host: server.host,
            // port: server.port,
            username: server.username,
            password: server.password
            //privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
          });
        }
      }
    );
  })
  .catch(err => {
    console.error('zip', err);
  });


```

---

---

摸索学习，有什么不对的欢迎指教。
