const answerModel = require('../models/answerModel');
const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
const optionModel = require('../models/optionModel');
const common = require('./common');
const Token = require("../config/token.config")

class Answer {
    static async answerList(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        let errors = await common.checkData(params);
        if (!errors) return false;

        try {
            const answerList = await answerModel.answerList(params);  //根据userid从tbuserExam得到问卷id
            let returndata = [];
            for (let i in answerList) {   //根据examid title status 得到问卷信息
                let value = answerList[i].dataValues;
                let answerdata = await examModel.getlistByExamid({ exam_id: value.examid, title: params.title, status: params.status });
                if (answerdata != null) returndata.push(answerdata.dataValues);
            }
            res.status = 200;
            res.json({
                code: 200,
                data: returndata,
            })
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
        }
    }

    /**
    * 根据exam_id , user_id 获取试卷和题目
    * @param {*} req 
    * @param {*} res 
    */
    static async personalPage(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        // 检测参数是否存在为空
        let errors = await common.checkData(params, res);
        if (!errors) return false;

        const title = await examModel.findExam(params);
        const questions = await quesModel.selectQues(params.exam_id);

        try {
            if (title) {
                let ls_title = title[0].dataValues, ls_question = [], ls_option = [];
                for (let i in questions) {   //获取问题选项
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
}

module.exports = Answer 