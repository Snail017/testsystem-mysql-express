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
            const answerList =await answerModel.answerList(params);
            let returndata=[];
            for(let i in answerList){
                let value=answerList[i].dataValues;
                let answerdata=await examModel.findExam({exam_id:value.examid,title:params.title,status:params.status});
                if(answerdata.length>0) returndata.push(answerdata[0].dataValues);
            }
            res.status = 200;
            res.json({
                code: 200,
                data:returndata,
            })
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
        }
    }
}

module.exports = Answer 