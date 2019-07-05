const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const answer = Sequelize.import('../schema/answer.js')

answer.sync({ force: false });

class AnswerModel {
    static async answerList(res) {
        let { user_id, exam_id, content } = res;
        return answer.findAll({
            where: {
                
                examid: exam_id,
                id: content,
                or:[
                    {
                        userid:content
                    },
                    {
                        userid:user_id
                    }
                ]
            }
        })

    }
}

module.exports = AnswerModel
