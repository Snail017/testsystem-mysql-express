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
app.listen(3000,'localhost',function(err,res){
  if(err){
    console.log(err)
  }else{
    console.log('success listen at port:3000......')
  }
})
