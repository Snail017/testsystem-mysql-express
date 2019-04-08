const svgCaptcha = require('svg-captcha');
const crypto = require("crypto")

//用户登录
global.router.post('/user/login', (req, res) => {
    var params = req.body;
    var ls_pw = crypto.privateDecrypt(private_key, Buffer.from(params.password, 'base64')).toString();
    global.conn.query(global.$sql.user.sql_login, [params.name, ls_pw], function (err, result, fields) {
        if (result != undefined && result.length == 0) {
            res.json({
                code: 404,
                msg: "用户名和密码不匹配，请重新输入",
            })
        } else {
            setToken(result.id);
            res.json({
                code: 200,
                msg: "登录成功",
            })
        }
    })

});

//增加用户接口
global.router.post('/user/register', (req, res) => {
    var params = req.body;
    var ls_pw = crypto.privateDecrypt(private_key, Buffer.from(params.password, 'base64')).toString();
    global.conn.query(global.$sql.user.sql_sel, [params.name], function (err, result, fields) {
        if (err) return false;
        if (result != undefined && result.length > 0) {
            res.json({
                code: 404,
                msg: "用户名已存在",
            })
        } else {
            global.conn.query(global.$sql.user.sql_add,[params.name,ls_pw],function (err,result) {
                if(err) return false;
                console.log(result)
                setToken(result.id);
                res.json({
                    code: 200,
                    msg: "注册成功"
                })
            })
        }
    })
});

//得到公钥
global.router.get("/user/public_key", (req, res) => {
    res.json({
        code: 200,
        msg: global.public_key
    })
});

// 获取验证码
global.router.get('/user/getCaptcha', function (req, res, next) {
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
        code: 200,
        img: captcha.data,
        msg: req.session
    });
})

//根据用户名 ，密码设置token
function setToken(userid) {
    var header = {
            type: "jwt",
            alg: 'hs256',
        },
        playload = {
            iss: '1670644339@qq.com',   // JWT的签发者
            sub:name,    // JWT所面向的用户
            aud:"1670644339@qq.com",  //接收JWT的一方
            exp:new Date().getTime()+60*60*24*1, //JWT的过期时间1t
            nbf:new Date().getTime()+60*60*24*2,  //在xxx日期之间，该JWT都是可用的2t
            iat: new Date().getTime()   ,  // 该JWT签发的时间
        };

    var encodedString = header.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")+ '.' + playload.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    var token = crypto.createHmac('sha256', private_key).update(encodedString).digest('hex');
    global.client.set(userid,token, redis.print);
}

module.exports = global.router;