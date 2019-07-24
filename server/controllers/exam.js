const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
const optionModel = require('../models/optionModel');
const userExam = require("../models/userexamModel")
const common = require('./common');
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
                await userExam.delByExam(createExam.id);
                for (let i in params.designated) {
                    let value = params.designated[i];
                    await userExam.create({ exam_id: createExam.id, user_id: value.id });
                }
                if (createExam) {
                    res.status = 200;
                    res.json({
                        code: 200,
                        data: {
                            id: createExam.id
                        },
                        msg: "提交成功！"
                    })
                }
            } else {
                const alterExam = await examModel.alterExam(params);
                await userExam.delByExam(params.exam_id);
                for (let i in params.designated) {
                    let value = params.designated[i];
                    await userExam.create({ exam_id: params.exam_id, user_id: value.id })
                }
                if (alterExam) {
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

        let checkdata = await common.checkData(params, res);
        if (!checkdata) return false;
        try {
            const users = await examModel.getlist(params);
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
     * 修改考卷状态
     * @param {*exam_id} req 
     * @param {*status}  ==0 结束本次考试   ==1 发布本次考试  ==2作废本次考试  ==3删除本次试卷 
     * @param {*} res 
     */
    static async patchExam(req, res) {
        let params = req.body;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;

        let checkdata = await common.checkData(params, res);
        if (!checkdata) return false;
        try {
            await examModel.changeStatus(params);
            res.status = 200;
            res.json({
                code: 200,
                msg: "状态修改成功"
            })
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
     * 删除试卷
     * @param {status==3} req 
     * @param {*} res 
     */
    static async deleteExam(req, res) {
        let params = req.body;
        // 检测参数是否存在为空
        let checkdata = await common.checkData(params, res);
        if (!checkdata) return false;

        try {
            await optionModel.deleteOptionByExamid(params.exam_id);
            await quesModel.delQuesByExamid(params.exam_id);
            await examModel.deleteExam(params.exam_id);
            res.status = 200;
            res.json({
                code: 200,
                msg: "问卷删除成功"
            })
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                data: err
            })
        }
    }


}

module.exports = Exam 