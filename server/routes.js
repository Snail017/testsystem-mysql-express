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
// 忘记密码
// Routers.delete('/user/public_key', User.delete);
//  获取二维码
Routers.get('/user/getCaptcha', User.code);
// // 获取公钥
Routers.get('/user/public_key', User.getPublicKey);

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
