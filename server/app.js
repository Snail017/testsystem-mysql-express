/**
 * node 后端服务器
 * node启动文件
 */
const fs = require('fs');
const path=require("path")
const bodyParser = require('body-parser');
const cookieParase = require('cookie-parser');
const redis = require('redis');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const Token = require('./config/token.config.js')
const app = express();

global.public_key = fs.readFileSync(__dirname+"/key/pub.key").toString();
global.private_key = fs.readFileSync(__dirname+"/key/pri.key").toString();
app.use(cookieParase());
app.use(bodyParser.json());

const routes = require(__dirname+'/routes');
 
//对接口过滤检验token
app.all("*", async (req, res, next) => {
    res.header("Access-Control-Expose-Headers", "Authorization");
    res.header('Cache-Control', 'no-store');

    if (req.path != "/publicKey" && req.path != "/captcha" && req.path != '/login' && req.path != "/register") {
        const token = await Token.checkToken(req.headers.authorization);
        try {
            if (token.status == 404) {
                res.json({
                    code: 401,
                    msg: "token已过期，请重新登录"
                })
            } else {
                if (token.status == 202) {
                    res.header("Authorization", token.access_token);
                }
                next();
            }
        } catch (err) {
            res.json({
                code: 500,
                msg: err
            })
        }
    } else {
        next()
    }
})

app.use('/', routes);  // 后端api路由

//连接redis数据库

global.client = redis.createClient(6379, '127.0.0.1');

global.client.on('error', function (err) {
    console.log('redis Error ' + err);
});

global.client.on("connect", function () {
    global.client.set("private_key", global.private_key, redis.print);
    global.client.set("public_key", global.private_key, redis.print);
});

global.client.on('ready', function (res, req) {
    console.log("redis success.....")
});

// 连接数据库
// global.conn = mysql.createConnection(models.mysql);
// global.conn.connect();

// 监听端口
app.listen(3000, 'localhost', function (err, res) {
    if (err) console.log(err)
    console.log('success listen at port:3000......')
})

