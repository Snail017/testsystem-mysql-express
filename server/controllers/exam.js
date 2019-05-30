const examModel = require('../models/examModel');
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
            const createExam = await examModel.create(params);
            if (createExam) {
                res.json({
                    status: 200,
                    data: {
                        id: createExam.id
                    },
                    msg:"提交成功！"
                })
            }
        } else {
            const createExam = await examModel.alter(params);
            if (createExam) {
                res.json({
                    status: 200,
                    data: {
                        id: createExam.id
                    },
                    msg:"修改成功"
                })
            }
        }
    }
}

module.exports = Exam 