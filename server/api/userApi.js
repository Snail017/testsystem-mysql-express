var models = require('../databse.config');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');
var svgCaptcha = require('svg-captcha');

// 连接数据库
var conn = mysql.createConnection(models.mysql);
conn.connect();

//增加用户接口
router.post('/user/register', (req, res) => {
  console.log(req)
  var sel = $sql.user.sel,
      add = $sql.user.add,
    setToken  = $sql.user.setToken ;
  var params = req.body;
    conn.query(sel, [params.name], function(err,result,fields) {
        if(result.length>0){
            res.json({
                code:404,
                msg:'用户名存在'
            })
        }else{
            conn.query(add, [params.name,params.password ], function(err,result) {
                res.json({
                    code:200,
                    msg:"登录成功"
                })
            })
        }
    })

});

// 获取验证码
router.get('/api/getCaptcha', function(req, res, next) {
    var captcha = svgCaptcha.create({
        // 翻转颜色
        inverse: false,
        // 字体大小
        fontSize: 36,
        // 噪声线条数
        noise: 2,
        // 宽度
        width: 80,
        // 高度
        height: 30,
    });
    // 保存到session,忽略大小写
    req.session = captcha.text.toLowerCase();
    // //保存到cookie 方便前端调用验证
    res.cookie('captcha', req.session);
    // res.setHeader('Content-Type', 'image/svg+xml');
    res.json({
        code:200,
        img:captcha.data,
        msg:req.session
    });
})


module.exports = router;