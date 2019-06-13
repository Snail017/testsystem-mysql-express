const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
const optionModel = require('../models/optionModel');
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
     * @param {*question_id} req  question_id==0 创建题目
     * @param {*questionType}  questionType!=0 提交选项
     * @param {*} res 
     */

    static async PutQuestions(req, res) {
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

        try {
            //根据 question_id  判断题目是新建还是修改  ==0新建
            if (params.question_id == 0) {
                const createQues = await quesModel.createQues(params);
                //questionType  判断题目类型  非简答题才有选项
                if (params.questionType != 0) {
                    for (let i in params.optiondata) {
                        let ls_option = params.optiondata[i];
                        ls_option.question_id = createQues.id;
                        var createOption = await optionModel.createOption(ls_option);
                        if (!createOption) {
                            res.json({
                                status: 500,
                                msg: "题目上传错误"
                            })
                        }
                        return false;
                    }
                }

                if (createQues) {
                    res.json({
                        status: 200,
                        msg: "上传成功"
                    })
                }
            } else {
                //修改问题  
                const alterQues = await quesModel.alterQues(params);
                if (params.questionType != 0) {
                    //修改选项   当option_id==0是该选项为新建
                    for(let i in params.optiondata){
                        for (let i in params.optiondata) {
                            params.optiondata[i].question_id=params.question_id;
                            var createOption = await optionModel.createOption(params.optiondata[i]);
                            if (!createOption) {
                                res.json({
                                    status: 500,
                                    msg: "题目上传错误"
                                })
                            }
                            return false;
                        }
                    }
                    if (alterQues) {
                        res.json({
                            status: 200
                        })
                    }
                }
            }
        } catch (err) {
            res.json({
                code: 500,
                msg: err
            })
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

    static async getquestion(req, res) {
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

        const questions = await quesModel.selectQues(params);
        const title = await examModel.getExam(params);

        try {
            if (title) {
                let ls_data = title[0].dataValues;
                ls_data.list = [];
                for (let i in questions) {
                    ls_data.list.push(questions[i].dataValues);
                    ls_data.list[i].question_id = questions[i].dataValues.id;
                }
                res.json({
                    status: 200,
                    data: ls_data
                })
            }
        } catch (err) {
            res.json({
                status: 500,
                data: err
            })
        }
    }

    /**
     * 删除题目
     */
    static async deletequestion(req, res) {
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

        try {
            const delQues = await quesModel.delQues(params);
            if (delQues) {
                res.json({
                    status: 200
                })
            }

        } catch (err) {
            res.json({
                status: 500,
                data: err
            })
        }

    }

}

module.exports = Exam 