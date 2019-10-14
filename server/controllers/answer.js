const answerModel = require('../models/answerModel');
const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
const optionModel = require('../models/optionModel');
const userexamModel = require('../models/userexamModel');
const common = require('./common');
const Token = require("../config/token.config")

class Answer {
    /**
     * 删除答卷
     * @param {*exam_id} req 
     * @param {*} res 
     */
    static async deleteAnswer(req,res){
        let params = req.body;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        let errors = await common.checkData(params);
        if (!errors) return false;
        try{
            var answerUser=await userexamModel.alterAnswer(params);
            res.status = 200;
            res.json({
                code: 200,
                msg: err
            })
        }catch(err){
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
        }
    }
    /**
     * 修改答卷状态
     * @param {*} req 
     * @param {*} res 
     */
    static  async answerStatus(req,res){
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        let errors = await common.checkData(params);
        if (!errors) return false;
        try {
            var answerStatus = await userexamModel.alterAnswer(params)
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
        }
    }
    /**
     * 问卷答题用户
     * @param {*} req 
     * @param {*} res 
     */
    static async answerUser(req,res){
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        let errors = await common.checkData(params);
        if (!errors) return false;
        try{
            var answerUser=await userexamModel.answerUser(params);

        }catch(err){
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
        }
    }

    /**
     * 根据userid 获得需要的答卷 
     * @param {} req 
     * @param {*} res 
     */
    static async answerList(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        let errors = await common.checkData(params);
        if (!errors) return false;

        try {
            const answerList = await userexamModel.answerList(params);  //根据userid从tbuserExam得到问卷id
            let returndata = [];
            for (let i in answerList) {  
                let value = answerList[i].dataValues;
                let examdata = await examModel.getlistByExamid({ exam_id: value.exam_id, title: params.title, status: -1 });   //根据examid title status 得到问卷信息
                let answerdata = await answerModel.findByExamid({exam_id:value.exam_id,status:params.status}); //得到答卷状态 进行判断  如果没有数据表明还没有作答
                if (examdata != null&&examdata.status>0){
                    if(params.status==-1){
                        returndata.push({
                            title:examdata.title,
                            id:examdata.id,
                            updatedAt:examdata.updatedAt,
                            status:answerdata==null?0:answerdata.status
                        });
                    }else if(params.status==0&&answerdata==null){
                        returndata.push({
                            title:examdata.title,
                            id:examdata.id,
                            updatedAt:examdata.updatedAt,
                            status:answerdata.status
                        });
                    }else if(answerdata!=null){
                        returndata.push({
                            title:examdata.title,
                            id:examdata.id,
                            updatedAt:examdata.updatedAt,
                            status:answerdata.status
                        });
                    }
                    
                }
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
                const answerData=await answerModel.findByExamid({exam_id:params.exam_id,status:-1})
                for (let i in questions) {   //获取问题选项
                    ls_question.push(questions[i].dataValues);
                    ls_option = await optionModel.findAllOption(questions[i].dataValues);
                    ls_question[i].optiondata = ls_option;
                    ls_question[i].question_id = questions[i].dataValues.id;
                    if(answerData==null){
                        ls_question[i].answer='';
                    }else{
                        for(let n in JSON.parse(answerData.questions)){
                            if(ls_question[i].question_id==JSON.parse(answerData.questions)[n].question_id){
                                ls_question[i].answer=JSON.parse(answerData.questions)[n].answer;
                            }
                        }
                    }
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
     * 
     */
    static async submitExam(req, res) {
        let params = req.body;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        params.status=1;
        // 检测参数是否存在为空
        let errors = await common.checkData(params, res);
        if (!errors) return false;

        try {
            await answerModel.alterAnswer(params);   //提交答卷答题情况
            res.status = 200;
            res.json({
                code: 200,
                msg: '创建成功'
            })
        } catch (err) {
            res.status = 500;
            res.json({
                code: 500,
                data: err
            })
        }

    }
}

module.exports = Answer 