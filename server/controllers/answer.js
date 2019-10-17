const userModel = require('../models/userModel');
const answerModel = require('../models/answerModel');
const examModel = require('../models/examModel');
const quesModel = require('../models/quesModel');
const optionModel = require('../models/optionModel');
const userexamModel = require('../models/userexamModel');
const common = require('./common');
const Token = require("../config/token.config")

class Answer {
    /**
     * 修改答卷状态
     * @param {*exam_id} req 
     * @param {*} res 
     */
    static async answerStatus(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        let errors = await common.checkData(params);
        if (!errors) return false;
        try {
            if(params.status==2){  //加入回收站
                let a=await answerModel.AnswerStatus({exam_id:params.exam_id,user_id:params.user_id,status:2});
                res.status = 200;
                res.json({
                    code: 200,
                    msg: '成功加入回收站'
                })
            }else if(params.status==3) {//删除答卷
                await answerModel.deleteAnswer();
                res.status = 200;
                res.json({
                    code: 200,
                    msg: '删除成功'
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
     * 问卷答题用户
     * @param {*} req 
     * @param {*} res 
     */
    static async answerUser(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        let errors = await common.checkData(params);
        if (!errors) return false;
        try {
            let returndata=[];
            var answerUser = await answerModel.findByExamid({exam_id:params.exam_id});
            for (let i in answerUser) {
                let ls_user = await userModel.findNicknameById(answerUser[i].user_id);
                answerUser[i].dataValues.Nickname = ls_user.Nickname;
                //根据id和用户名筛选
                if(params.content==''){
                    returndata.push(answerUser[i]);
                    returndata[i].Nickname=ls_user.Nickname;
                }else if(params.content==ls_user.Nickname||params.content==answerUser[i].user_id){
                    returndata.push(answerUser[i]);
                    returndata[i].Nickname=ls_user.Nickname;
                }
            }
            res.status = 200;
            res.json({
                code: 200,
                data: returndata
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
                let answerdata = await answerModel.findByExamid({ exam_id: value.exam_id,user_id:params.user_id}); //得到答卷状态 进行判断  如果没有数据表明还没有作答
                if (examdata != null && examdata.status > 0) {
                    if (params.status == -1) {
                        if(answerdata.length>0&&answerdata[0].status<2){
                            returndata.push({
                                title: examdata.title,
                                id: examdata.id,
                                updatedAt: examdata.updatedAt,
                                status:answerdata[0].status
                            });
                        }else if(answerdata.length==0){
                            returndata.push({
                                title: examdata.title,
                                id: examdata.id,
                                updatedAt: examdata.updatedAt,
                                status: 0
                            });
                        }
                        
                    } else if (params.status == 0 && answerdata.length==0) {
                        returndata.push({
                            title: examdata.title,
                            id: examdata.id,
                            updatedAt: examdata.updatedAt,
                            status: 0
                        });
                    } else if (answerdata.length> 0&&params.status==answerdata[0].status) {
                        returndata.push({
                            title: examdata.title,
                            id: examdata.id,
                            updatedAt: examdata.updatedAt,
                            status: answerdata[0].status
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
                const answerData = await answerModel.findByExamid({ exam_id: params.exam_id, status: -1 ,user_id:params.user_id})
                for (let i in questions) {   //获取问题选项
                    ls_question.push(questions[i].dataValues);
                    ls_option = await optionModel.findAllOption(questions[i].dataValues);
                    ls_question[i].optiondata = ls_option;
                    ls_question[i].question_id = questions[i].dataValues.id;
                    if (answerData.length != 0) {       //当答卷库有数据表示此试卷已做答  才能返回正确答案
                        ls_question[i].realAnswer = questions[i].dataValues.answer;
                        for (let n in JSON.parse(answerData[0].questions)) {
                            if (ls_question[i].question_id == JSON.parse(answerData[0].questions)[n].question_id) {
                                ls_question[i].answer = JSON.parse(answerData[0].questions)[n].answer;
                            }
                        }
                    } else {
                        ls_question[i].answer = ''
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
     * 批改试卷
     * @param {} req 
     * @param {*} res 
     */
    static async checkAnswer(req, res) {
        let params = req.body;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        params.status=1;
        // 检测参数是否存在为空
        let errors = await common.checkData(params, res);
        if (!errors) return false;
        try{
             //批阅试卷需要先检验用户权限
             let flag=await examModel.findByuserExam({exam_id:params.exam_id,user_id:params.user_id});
             if(flag==null){
                res.status = 200;
                res.json({
                    code: 404,
                    msg: '权限不够'
                })
             }else{
                 await answerModel.alterAnswer(params);
                 res.status = 200;
                 res.json({
                     code: 200,
                     msg: '提交成功'
                 })
             }
        }catch(err){
            res.status = 500;
            res.json({
                code: 500,
                data: err
            })
        }
    }

    /**
     * 提交时间
     */
    static async submitExam(req, res) {
        let params = req.body;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        params.status = 1;
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