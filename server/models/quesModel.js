const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const Exam = Sequelize.import('../schema/question.js')

Exam.sync({ force: false });

class QuesModel {
    /**
     *创建题目
     * @param title
     * @returns {Promise<boolean>}
     */
    static async createQues(exam) {
        let { answer, child_number, exam_id, score, type, parsing, problem, prompt, extid, father_number } = exam;
        let sql =await Exam.create({
            answer, child_number, exam_id, score, type, parsing, problem, prompt, extid, father_number 
        })
        return sql;

    }
    static async alterQues(exam) {
        let { answer, child_number, exam_id, score, type, parsing, problem, prompt, extid, father_number, question_id } = exam;
        let sql = await Exam.update({
            answer, child_number, exam_id, score, type, parsing, problem, prompt, extid, father_number
        },{
            where:{
                id:question_id
            }
        })
        return sql;
    }

}

module.exports = QuesModel
