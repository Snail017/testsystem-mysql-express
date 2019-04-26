const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const Exam = Sequelize.import('../schema/exam.js')

Exam.sync({force: false});

class ExamModel {
    /**
     *创建问卷
     * @param title
     * @returns {Promise<boolean>}
     */
    static async create(exam) {
        let {title,user_id, explain,testtime,status,sort} = exam;
        await Exam.create({
            title,
            user_id,
            explain,
            testtime,
            status,
            sort
        })
        return true
    }

}

module.exports = ExamModel
