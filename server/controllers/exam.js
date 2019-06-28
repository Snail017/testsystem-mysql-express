const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
const optionModel = require('../models/optionModel');
const common = require('../controllers/common');
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

        const checkData = await common.checkData(params, res); // 检测参数是否存在为空
        if (!checkData) return false;
        try {
            //exam_id==0  新创建的文件
            if (params.exam_id == 0) {
                const createExam = await examModel.createExam(params);
                if (createExam) {
                    res.status = 200;
                    res.json({
                        code: 200,
                        data: {
                            id: params.exam_id
                        },
                        msg: "提交成功！"
                    })
                }
            } else {
                const createExam = await examModel.alterExam(params);
                if (createExam) {
                    res.status = 200;
                    res.json({
                        code: 200,
                        data: {
                            id: params.exam_id
                        },
                        msg: "修改成功"
                    })
                }
            }
        } catch (err) {
            res.status = 412;
            res.json({
                code: 412,
                msg: err
            })
            return false;
        }
    }


    /**
     * 获取问卷列表  
     * @param {*} req 
     * @param {*} res 
     */
    static async getlist(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;

        let checkdata=await common.checkData(params, res);
        if(!checkdata) return false;

        const users = await examModel.getlist(params);
        try {
            res.status = 200;
            res.json({
                code: 200,
                data: {
                    users: users,
                    data_total: "2",
                    p: "1",
                    page_rows: "10",
                    page_total: 1
                }
            })
        } catch (errors) {
            res.status = 412;
            res.json({
                code: 412,
                msg: errors
            })
            return false;
        }

    }

     /**
     * 根据exam_id 获取试卷和题目
     * @param {*} req 
     * @param {*} res 
     */
    static async getExam(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        // 检测参数是否存在为空
        let errors = await common.checkData(params,res);
        if(!errors) return false;

        const title = await examModel.findExam(params);
        const questions = await quesModel.selectQues(params);

        try {
            if (title) {
                let ls_title = title[0].dataValues, ls_question = [], ls_option = [];
                for (let i in questions) {
                    ls_question.push(questions[i].dataValues);
                    ls_option = await optionModel.findAllOption(questions[i].dataValues);
                    ls_question[i].optiondata = ls_option;
                    ls_question[i].question_id = questions[i].dataValues.id;
                }
                ls_title.list = ls_question;
                res.status = 200;
                res.json({
                    code: 200,
                    data: ls_title
                })
            }
        } catch (err) {
            res.status = 500;
            res.json({
                code: 500,
                data: err
            })
            return false;
        }
    }

    /**
     * 修改考卷状态
     * @param {*exam_id} req 
     * @param {*status}  ==0 结束本次考试   ==1 发布本次考试  ==2作废本次考试  ==3删除本次试卷 
     * @param {*} res 
     */
    static async patchExam(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;

        let checkdata=await common.checkData(params, res);
        if(!checkdata) return false;



    }

    /**
     * 删除试卷
     * @param {status==3} req 
     * @param {*} res 
     */
    static async deleteExam(req, res) {
        let params = req.body;
        // 检测参数是否存在为空
        let checkdata=await common.checkData(params, res);
        if(!checkdata) return false;
        
        const delExam = await examModel.deleteExam(params);

        try {
            if (delExam) {
                await Exam.deleteQuestionByExamid(params.exam_id);
                res.status = 200;
                res.json({
                    code: 200,
                    msg: "问卷删除成功"
                })
            }

        } catch (err) {
            res.status = 500;
            res.json({
                code: 500,
                data: err
            })
        }
    }

}

module.exports = Exam 