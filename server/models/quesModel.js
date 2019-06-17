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
        let {  problem, analysis, note , score ,questionType } = exam;
        let sql = await Ques.create({
            problem, analysis, note , score ,questionType
        })
        return sql;
    }

    static async alterQues(exam) {
        let { question_id, content, label, img, introduce } = exam;
        await Ques.update({
            content, label, img, introduce
        }, {
                where: {
                    id: question_id
                }
            })
        return true;
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
    static async delQues(exam) {
        let { id } = exam;
        await Ques.destroy({
            where: {
                id: id
            }
        })

        return true
    }

}

module.exports = QuesModel
