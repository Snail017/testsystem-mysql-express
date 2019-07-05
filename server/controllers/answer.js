const answerModel = require('../models/answerModel');
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
            const answerList=await answerModel.answerList(params);
            if(answerList){
                
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
}

module.exports = Answer 