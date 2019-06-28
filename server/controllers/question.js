const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
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
            const delQues = await quesModel.delQues(params);
            if (delQues) {
                await Exam.deleteOption(req, res);
                res.status = 200;
                res.json({
                    code: 200,
                    msg: '题目删除成功'
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
            //questionType  判断题目类型  非简答题才有选项
            if (params.questionType != 0) {
                for (let i in params.optiondata) {
                    let ls_option = params.optiondata[i];
                    ls_option.question_id = createQues.id;
                    var createOption = await optionModel.createOption(ls_option);
                    if (!createOption) {
                        res.status = 500;
                        res.json({
                            code: 500,
                            msg: "题目上传错误"
                        })
                        return false;
                    }
                }
            }
            if (createQues) {
                res.status = 200;
                res.json({
                    code: 200,
                    msg: "上传成功"
                })
            }
        } catch (err) {
            res.status=412;
            res.json({
                code: 500,
                msg: err
            })
            return false;
        }

    }

    /**
     * 修改题目
     * @param {*} exam_id 
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
                    for (let i in params.optiondata) {
                        params.optiondata[i].question_id = params.question_id;
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
                            var createOption = await optionModel.alterOption(params.optiondata[i]);
                            if (!createOption) {
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
    * 删除问卷题目
    * 删除题目选项
    * @param {exam_id} req 
    */
    static async deleteQuestionByExamid(exam_id) {
        if (exam_id != '') {
            const delQuesData = await quesModel.delQuesByExamid(exam_id);
            try {
                if (delQuesData) {

                }
            } catch (err) {
                return err
            }
        }
    }
}
module.exports = Ques