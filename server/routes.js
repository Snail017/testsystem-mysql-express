const express = require('express');
const User = require('./controllers/user')
const Exam = require('./controllers/exam')
const Answer = require('./controllers/answer')
const Ques = require('./controllers/question')
const Option = require('./controllers/option')
const upload=require('./controllers/upload')
// const UploadToken = require('../controllers/UploadToken')
const Routers = express.Router();

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


// 问卷接口
Routers.post("/ExamTitle",Exam.create)
Routers.post("/questions",Ques.create)
Routers.patch("/questions",Ques.patchQues)      
Routers.get("/questionnaireList",Exam.getlist)
Routers.get("/questions",  Ques.getQuestions)
Routers.delete("/questions",Ques.deletequestion);
Routers.delete("/option",Option.deleteOption)
Routers.patch("/Exam",Exam.patchExam)
Routers.delete("/Exam",Exam.deleteExam)

//答卷接口
Routers.get("/answerList",Answer.answerList)
Routers.get("/personalPage",Answer.personalPage)

/**
 * 上传token
 */
// Routers.get('/upload/token', UploadToken.token)

module.exports = Routers
