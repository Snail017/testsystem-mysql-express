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
    static async createExam(exam) {
        let { title, user_id, explain, testtime, status, sort, designated } = exam;
        let sql = await Exam.create({
            title,
            user_id,
            explain,
            testtime,
            status,
            sort,
            designated
        })
        return sql
    }
    static async alterExam(exam) {
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
        return true
    }

    static async createQues(exam) {
        let { answer, child_number, exam_id, score, type, parsing, problem, prompt, extid, father_number } = exam;
        let sql = await Exam.create({
            answer, child_number, exam_id, score, type, parsing, problem, prompt, extid, father_number
        })
        return sql;

    }
    static async alterQues(exam) {
        let { answer, child_number, exam_id, score, type, parsing, problem, prompt, extid, father_number, question_id } = exam;
        let sql = await Exam.update({
            answer, child_number, exam_id, score, type, parsing, problem, prompt, extid, father_number
        }, {
                where: {
                    id: question_id
                }
            })
        return sql;
    }

    /**
     * @param user_id
     * @param status
     * @returns 
     * 筛选问卷列表
     */
    static async getlist(exam) {
        let { user_id, status } = exam;
        let sql = await Exam.findAll(
            {
                limit: 3,
            }, {
                where: {
                    userid: user_id,
                    status: status
                }
            })

        return sql
    }

    static async findExam(exam) {
        let { exam_id } = exam;
        let sql= await Exam.findAll({
            where:{
                id:exam_id
            }
        })
        return sql
    }
}

module.exports = ExamModel
