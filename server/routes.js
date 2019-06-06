const express = require('express');
const User = require('./controllers/user')
const Exam = require('./controllers/exam')
const upload=require('./controllers/upload')
// const UploadToken = require('../controllers/UploadToken')
const Routers = express.Router();



/**
 * 用户接口
 */

//  用户注册
Routers.post('/register', User.create);
//  用户登录
Routers.post('/login', User.login);
//  获取用户名单
Routers.post('/users', User.list);
//  获取图形码
Routers.get('/captcha', User.code);
//  获取公钥
Routers.get('/publicKey', User.public_key);

//  提交图片
Routers.post("/Uploadpic",upload.single("img"),User.uploadImg);


/**
 * 问卷接口
 */
//  提交试卷
Routers.post("/ExamTitle",Exam.create)
Routers.post("/ExamQuestions",Exam.ExamQuestions)
Routers.get("/questionnaireList",Exam.getlist)
Routers.get("/questions",Exam.getquestion)



/**
 * 上传token
 */
// Routers.get('/upload/token', UploadToken.token)

module.exports = Routers
