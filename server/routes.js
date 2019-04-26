const express = require('express');
const User = require('./controllers/user')
const Exam = require('./controllers/exam')
// const UploadToken = require('../controllers/UploadToken')
const Routers = express.Router();
/**
 * 用户接口
 */

// 用户注册
Routers.post('/user/register', User.create);
// 用户登录
Routers.post('/user/login', User.login);
// 获取用户名单
Routers.post('/User/list', User.list);
//  获取图形码
Routers.get('/user/getCaptcha', User.code);
// // 获取公钥
Routers.get('/user/public_key', User.public_key);

/**
 * 问卷接口
 */
//提交试卷
Routers.post("/Exam/EditTitle",Exam.create)


/**
 * 上传token
 */
// Routers.get('/upload/token', UploadToken.token)

module.exports = Routers
