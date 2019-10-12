const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
const userModel = require('../models/userModel');
const userExamModel = require('../models/userexamModel');
const optionModel = require('../models/optionModel');
const common = require('../controllers/common');
const Token = require("../config/token.config")

class Ques {

    /**
     * 根据question_id 删除某个题目
     * @param {id} req 
     * @param {*} res 
     */
    static async deletequestion(req, res) {
        let params = req.body;
        // 检测参数是否存在为空
        let errors = await common.checkData(params, res);
        if (!errors) return false;

        try {
            await optionModel.deleteOptionByQuesid(params.id);
            await quesModel.delQues(params);
            res.status = 200;
            res.json({
                code: 200,
                msg: '题目删除成功'
            })
        } catch (err) {
            res.status = 500;
            res.json({
                code: 500,
                data: err
            })
        }
    }


    /**
     * 创建题目 
     * @param {*question_id} req  question_id==0 创建题目
     * @param {*} res 
     */
    static async create(req, res) {
        let params = req.body;

        // 检测参数是否存在为空
        let errors = common.checkData(params, res);
        if (!errors) return false;

        try {
            const createQues = await quesModel.createQues(params);
            if (createQues) {
                //questionType  判断题目类型  非简答题才有选项
                if (params.questionType != 0) {
                    for (let i in params.optiondata) {
                        let ls_option = params.optiondata[i];
                        ls_option.exam_id = params.exam_id;
                        ls_option.question_id = createQues.id;
                        await optionModel.createOption(ls_option);
                    }
                }
                res.status = 200;
                res.json({
                    code: 200,
                    msg: "上传成功"
                })
            }
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
            return false;
        }

    }

    /**
     * 修改题目
     * @param {*question_id} question_id !=0
     * @param {*option_id} option_id ==0创建选项  option_id !=0修改选项
     */
    static async patchQues(req, res) {
        let params = req.body;

        // 检测参数是否存在为空
        let errors = common.checkData(params, res);
        if (!errors) return false;

        try {
            //修改问题  
            const alterQues = await quesModel.alterQues(params);
            if (params.questionType != 0) {
                //修改选项   当option_id==0是该选项为新建
                for (let i in params.optiondata) {
                    params.optiondata[i].question_id = params.question_id;
                    params.optiondata[i].exam_id = params.exam_id;
                    if (params.optiondata[i].option_id == 0) {
                        var createOption = await optionModel.createOption(params.optiondata[i]);
                        if (!createOption) {
                            res.status = 500;
                            res.json({
                                code: 500,
                                msg: "题目上传错误"
                            })
                            return false;
                        }
                    } else {
                        var alterOption = await optionModel.alterOption(params.optiondata[i]);
                        if (!alterOption) {
                            res.status = 500;
                            res.json({
                                code: 500,
                                msg: "题目上传错误"
                            })
                            return false;
                        }
                    }
                }
            }
            if (alterQues) {
                res.status = 200;
                res.json({
                    code: 200
                })
            }
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
        }
    }

    /**
   * 根据exam_id 获取试卷和题目
   * @param {*} req 
   * @param {*} res 
   */
    static async getQuestions(req, res) {
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
                for (let i in questions) {
                    ls_question.push(questions[i].dataValues);
                    ls_option = await optionModel.findAllOption(questions[i].dataValues);
                    ls_question[i].optiondata = ls_option;
                    ls_question[i].question_id = questions[i].dataValues.id;
                }
                ls_title.list = ls_question;
                let ls_designated=await userExamModel.findUser(params.exam_id);   //根据examid 得到指定用户有哪些
                ls_title.designated=[];
                for(let i in ls_designated){
                    ls_title.designated.push(ls_designated[i].user_id)
                }
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
module.exports = Ques