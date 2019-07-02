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
        let {  problem, analysis, note , score ,questionType,exam_id ,answer} = exam;
        let sql = await Ques.create({
            problem, analysis, note , score ,questionType,exam_id,answer
        })
        return sql;
    }

    static async alterQues(exam) {
        let { problem, analysis, note , score ,questionType,exam_id ,answer ,question_id} = exam;
        await Ques.update({
            problem, analysis, note , score ,questionType,exam_id ,answer
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
    static async delQuesByExamid(exam_id) {
        await Ques.destroy({
            where: {
                exam_id: exam_id
            }
        })
        return true
    }
    static async findAllQuesByExamid(exam_id){
        let sql= await Ques.findAll({
            where:{
                exam_id:exam_id
            }
        })
        return sql;
    }
}

module.exports = QuesModel
