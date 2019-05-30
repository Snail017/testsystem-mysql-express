const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const Exam = Sequelize.import('../schema/exam.js')

Exam.sync({ force: false });

class ExamModel {
    /**
     *创建问卷
     * @param title
     * @returns {Promise<boolean>}
     */
    static async create(exam) {
        let { title, user_id, explain, testtime, status, sort, designated } = exam;
        let examCreate = await Exam.create({
            title,
            user_id,
            explain,
            testtime,
            status,
            sort,
            designated
        })
        return examCreate
    }
    static async alter(exam) {
        let { title, user_id, explain, testtime, status, sort, designated, exam_id } = exam;
        let examCreate = await Exam.update({
            title,
            user_id,
            explain,
            testtime,
            status,
            sort,
            designated,
        }, {
                where: {
                    id: exam_id
                }
            })
        return examCreate
    }

}

module.exports = ExamModel
