const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const answer = Sequelize.import('../schema/answer.js')
const userExam = Sequelize.import('../schema/user_exam.js')
const Op = Sequelize.Op;
answer.sync({ force: false });

class AnswerModel {

    /**
     * 提交试卷
     * @param {*} res 
     */
    static async alterAnswer(res) {
        let { exam_id, user_id, questions, status, } = res;
        questions = JSON.stringify(questions);
        await answer.findAll({
            where: {
                exam_id: exam_id,
                user_id: user_id
            }
        }).then(res => {
            if (res.length > 1) {
                answer.destroy({
                    where: {
                        exam_id: exam_id,
                        user_id: user_id
                    }
                }).then(() => {
                    answer.create({
                        exam_id: exam_id,
                        user_id: user_id,
                        questions: questions,
                        status: status,
                        score:score,
                    })
                })
            } else if (res.length == 1) {
                res = res[0].dataValues;
                answer.update({
                    questions, status,score
                }, {
                        where: {
                            exam_id: exam_id,
                            user_id: user_id,
                            id: res.id
                        }
                    })
            } else {
                answer.create({
                    exam_id: exam_id,
                    user_id: user_id,
                    questions: questions,
                    status: status,
                    score:score
                })
            }
        })
        return true
    }
    /**
     *根据examid得到答卷信息
     * @param {} res 
     */
    static async findByExamid(res) {
        let { exam_id ,status} = res;
        return await answer.findOne({
            where: {
                exam_id: exam_id,
                status:status
            }
        })
    }
}

module.exports = AnswerModel
