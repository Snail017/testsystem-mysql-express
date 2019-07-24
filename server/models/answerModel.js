const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const answer = Sequelize.import('../schema/answer.js')
const userExam = Sequelize.import('../schema/user_exam.js')
const Op = Sequelize.Op;
answer.sync({ force: false });

class AnswerModel {
    static async answerList(res) {
        let { user_id, status, title, page, pagecount } = res;
        return await Exam.findAll(
            {
                where: {
                    userid: user_id,
                    status: status == -1 ? { [Op.lt]: 3 } : status,
                    [Op.or]: {
                        title: {
                            [Op.like]: "%" + title + "%"
                        },
                        id: {
                            [Op.like]: "%" + title + "%"
                        }
                    }
                },
                offset: (Number(pagecount) - 1) * page,
                limit: Number(page),
                order: [
                    ['id', 'DESC']
                ],
            },
        )
    }
}

module.exports = AnswerModel
