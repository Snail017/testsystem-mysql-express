const UserModel = require('../models/userModel');
const svgCaptcha = require('svg-captcha');
const crypto = require("crypto")

class User {
    /**
     * 创建用户
     * @param   Nickname     用户名字
     * @param   password     用户密码
     * @param   email        用户邮箱  暂时没
     *
     * @returns 创建成功返回用户信息，失败返回错误信息
     */
    static async create(req, res) {
        let {Nickname, password, /*email,*/ usertoken} = req.body;

        let params = {
            Nickname,
            password,
            // email,
            usertoken
        }

        // 检测参数是否存在为空
        let errors = [];
        for (let item in params) {
            if (params[item] === undefined) {
                let index = errors.length + 1;
                errors.push("错误" + index + ": 参数: " + item + "不能为空")
            }
        }

        if (errors.length > 0) {
            res.status = 412;
            res.json({
                code: 412,
                msg: errors
            })
            return false;
        }

        // 查询用户名是否重复
        const existUser = await UserModel.Nickname(params.Nickname);
        console.log(existUser)

        if (existUser) {
            res.status = 403;
            res.json({
                code: 403,
                msg: "用户已经存在"
            })

        } else {

            try {
                // 加密密码
                params.password = crypto.privateDecrypt(global.private_key, Buffer.from(params.password, 'base64')).toString();

                // 创建用户
                await UserModel.create(params);
                console.log(params)
                const newUser = await UserModel.Nickname(params.Nickname)

                // 签发token
                const token = this.setToken(newUser.id, newUser.Nickname)

                res.status = 200;
                res.json({
                    code: 200,
                    msg: `创建用户成功`,
                    data: token
                })

            } catch (err) {
                res.status = 500;
                res.json({
                    code: 500,
                    msg: err
                })
            }
        }

    }

    /**
     * 根据用户名 ，密码设置token
     * */
    static async setToken(userid, name) {
        var header = {
                type: "jwt",
                alg: 'hs256',
            },
            playload = {
                iss: '1670644339@qq.com',   // JWT的签发者
                sub: name,    // JWT所面向的用户
                aud: "1670644339@qq.com",  //接收JWT的一方
                exp: new Date().getTime() + 60 * 60 * 24 * 1, //JWT的过期时间1t
                nbf: new Date().getTime() + 60 * 60 * 24 * 2,  //在xxx日期之间，该JWT都是可用的2t
                iat: new Date().getTime(),  // 该JWT签发的时间
            };

        var encodedString = header.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_") + '.' + playload.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
        var token = crypto.createHmac('sha256', global.private_key).update(encodedString).digest('hex');
        global.client.set(userid, token, redis.print);
        return token
    }

    static async code(req, res) {
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
    }

    static async getPublicKey(req, res) {
        res.json({
            code: 200,
            msg: global.public_key
        })
    }

}

module.exports = User