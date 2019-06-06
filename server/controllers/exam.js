const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
const Token = require("../config/token.config")

class Exam {
    /**
     * 创建用户
     * @param   title     试卷标题
     * @param   status    试卷状态 （是否发布）
     * @param   explain   试卷说明
     * @param   testtime  考试限制时间
     * @returns 创建成功返回用户信息，失败返回错误信息
     */
    static async create(req, res) {
        let params = req.body;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;

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

        //exam_id==0  新创建的文件
        if (params.exam_id == 0) {
            const createExam = await examModel.createExam(params);
            if (createExam) {
                res.json({
                    status: 200,
                    data: {
                        id: params.exam_id
                    },
                    msg: "提交成功！"
                })
            }
        } else {
            const createExam = await examModel.alterExam(params);
            if (createExam) {
                res.json({
                    status: 200,
                    data: {
                        id: params.exam_id
                    },
                    msg: "修改成功"
                })
            }
        }
    }
    /**
     * 提交题目 
     * @param {*} req 
     * @param {*} res 
     */

    static async question(req, res) {
        let params = req.body;

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

        //根据 question_id  判断题目是新建还是修改  ==0新建
        if (params.question_id == 0) {
            const createQues = await quesModel.createQues(params);
            if(createQues){
                
            }

        } else {
            const alterQues = await quesModel.alterExam(params);
            if(alterQues){
                
            }
        }
    }

    /**
     * 获取问卷列表
     */
    static async getlist(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
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

        const users = await examModel.getlist(params);
        res.json({
            status: 200,
            data: {
                users: users,
                data_total: "2",
                p: "1",
                page_rows: "10",
                page_total: 1
            }
        })
    }

    static async getquestion(req,res){
        let params=req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
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

        const questions=await quesModel.selectQues(params);
        const title=await examModel.getExam(params);
       
        try{
            if(title){
                let data=title[0];
                data.list=questions;
                res.json({
                    status:200,
                    data:data
                })
            }
        }catch(err){
            res.json({
                status:500,
                data:err
            })
        }
    }

}

module.exports = Exam 