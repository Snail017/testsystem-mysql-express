const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const answer = Sequelize.import('../schema/answer.js')
const userExam = Sequelize.import('../schema/user_exam.js')
const Op = Sequelize.Op;
answer.sync({ force: false });

class AnswerModel {
    static async answerList(res) {
        let { user_id, status, title, page, pagecount } = res;
        return await userExam.findAll(
            {
                where: {
                    userid: user_id
                },
                offset: (Number(pagecount) - 1) * page,
                limit: Number(page),
                order: [
                    ['examid', 'DESC']
                ],
            },
        )
    }
}

module.exports = AnswerModel
