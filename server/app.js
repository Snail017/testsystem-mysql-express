/**
 * node 后端服务器
 * node启动文件
 */
const fs = require('fs');
const models = require('./config/databse.config');
const bodyParser = require('body-parser');
const cookieParase = require('cookie-parser');
const redis = require('redis');
const express = require('express');
const app = express();
// const mysql = require('mysql');
// global.router = express.Router();
// global.$sql = require('./sqlMap');
global.private_key = fs.readFileSync('./pri.key').toString();
global.public_key = fs.readFileSync("./pub.key").toString();

const routes = require('./routes');

app.use('/', routes)   // 后端api路由


app.use(cookieParase());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//连接redis数据库
global.client = redis.createClient(6379, '127.0.0.1');

global.client.on('error', function (err) {
    console.log('redis Error ' + err);
});

global.client.on("connect", function () {
    global.client.set("private_key", global.private_key, redis.print);
    global.client.set("public_key", global.private_key, redis.print);
});

global.client.on('ready', function (res, red) {
    console.log("redis success.....")
});

// 连接数据库
// global.conn = mysql.createConnection(models.mysql);
// global.conn.connect();

// 监听端口
app.listen(3000, 'localhost', function (err, res) {
    if (err) {
        console.log(err)
    } else {
        console.log('success listen at port:3000......')
    }
})




