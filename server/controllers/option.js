const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
const optionModel = require('../models/optionModel');
const common = require('../controllers/common');
const Token = require("../config/token.config")

class Option {
    /**
    * 删除选项
    */
    static async deleteOption(req, res) {
        let params = req.body;
        // 检测参数是否存在为空
        let errors =await common.checkData(params,res);
        if(!errors) return false;

        try {
            const delOption = await optionModel.deleteOption(params);
            if (delOption) {
                res.status = 200;
                res.json({
                    code: 200,
                    msg: "选项删除成功"
                })
            }
        } catch (err) {
            res.status = 500;
            res.json({
                code: 500,
                msg: err
            })
        }
    }

}
module.exports = Option