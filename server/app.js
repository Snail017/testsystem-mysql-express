/**
 * node 后端服务器
 * node启动文件
 */

const userApi = require('./api/userApi')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const cookieParase = require('cookie-parser');
const crypto = require('crypto')
const app = express()

app.use(cookieParase());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 后端api路由
app.use('/', userApi)

// 监听端口
app.listen(3000, 'localhost', function (err, res) {
    if (err) {
        console.log(err)
    } else {
        console.log('success listen at port:3000......')
    }
})

//redis服务器
const redis = require('redis');

const client = redis.createClient(6379, '127.0.0.1');

const private = fs.readFileSync('./pri.key').toString();

const public = fs.readFileSync("./pub.key").toString();

// client.auth(rds_pw,function () {
//     console.log("通过认证")
// })

client.on('error', function (err) {
    console.log('Error ' + err);
});

client.on("connect", function () {
    console.log("redis连接成功");
    client.set("private_key", private, redis.print);
    client.set("public_key", public, redis.print);
});


client.on('ready', function (res, red) {
    console.log("success.....")
});

