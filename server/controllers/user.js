const UserModel = require('../models/userModel');
const svgCaptcha = require('svg-captcha');
const crypto = require("crypto")
const Token = require("./token")

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
        let params = {
            Nickname:req.body.name,
            Password:req.body.password,
            // email,
            // usertoken
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

        if (existUser) {
            res.status = 403;
            res.json({
                code: 403,
                msg: "用户已经存在"
            })

        } else {
            try {
                // 解密密码
                params.Password = crypto.privateDecrypt(global.private_key, Buffer.from(params.Password, 'base64')).toString();

                // 创建用户
                await UserModel.create(params);
                const newUser = await UserModel.Nickname(params.Nickname);

                // 签发token
                const access_token =Token.setToken(newUser.id,10*60, newUser.Nickname);
                const refresh_token =Token.setToken(newUser.id,30*24*60*60, newUser.Nickname);
                global.client.set(newUser.id,refresh_token);
            
                res.status = 200;
            
                res.json({
                    code: 200,
                    msg: `创建用户成功`,
                    data: {
                        access_token:access_token,
                        user_id:existUser.id
                    },
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
     * 登录
     * */
    static async login(req,res){
        let params = {
            Nickname:req.body.name,
            Password:req.body.password,
            // email,
            // usertoken
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
        // 解密密码
        params.Password = crypto.privateDecrypt(global.private_key, Buffer.from(params.Password, 'base64')).toString();

       // 查询用户名是否重复
       const existUser = await UserModel.Password(params.Nickname,params.Password);
       if(existUser){      
        try {
           
            // 签发token
            const access_token =Token.setToken(existUser.id,10*60, existUser.Nickname);
            const refresh_token =Token.setToken(existUser.id,30*24*60*60, existUser.Nickname);
            global.client.set(existUser.id,refresh_token);
        
            res.status = 200;
            res.json({
                code: 200,
                msg: `用户登录成功`,
                data: {
                    access_token:access_token,
                    user_id:existUser.id
                },
            })

        } catch (err) {
            res.status = 500;
            res.json({
                code: 500,
                msg: err
            })
        }
       }else{
           res.json({
               code:404,
               msg:"用户名或密码错误"
           })
       }
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