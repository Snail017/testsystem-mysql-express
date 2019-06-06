const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const Ques = Sequelize.import('../schema/question.js')

Ques.sync({ force: false });

class QuesModel {
    /**
     *创建题目
     * @param title
     * @returns {Promise<boolean>}
     */
    static async createQues(exam) {
        let { answer, exam_id, score, type, parsing, problem, prompt, extid } = exam;
        let sql = await Ques.create({
            answer, exam_id, score, type, parsing, problem, prompt, extid
        })
        return sql;
    }

    static async alterQues(exam) {
        let { answer, exam_id, score, type, parsing, problem, prompt, extid, question_id } = exam;
        let sql = await Ques.update({
            answer, exam_id, score, type, parsing, problem, prompt, extid
        }, {
                where: {
                    id: question_id
                }
            })
        return sql;
    }

    static async selectQues(exam) {
        let { exam_id } = exam;
        let sql = await Ques.findAll({
            where: {
                exam_id: exam_id
            }
        })
        return sql
    }
    
}

module.exports = QuesModel
