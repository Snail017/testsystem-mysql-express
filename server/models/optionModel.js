const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const Option = Sequelize.import('../schema/option.js')

Option.sync({ force: false });

class OptionModel {
    /**
     *创建选项
     * @param title
     * @returns {Promise<boolean>}
     */
    static async createOption(exam) {
        let { id, question_id, content, type, parsing, problem, prompt, extid } = exam;
        let sql = await Option.create({
            answer, exam_id, score, type, parsing, problem, prompt, extid
        })
        return sql;
    }

    /**
     * 修改选项
     */
    static async alterOption(res) {
        let { id, question_id, content, label, type } = res;
        let sql = await Option.update({
            content, label, type
        }, {
                where: {
                    question_id: question_id,
                    id: option_id
                }
            })
        return sql;
    }
}

module.exports = OptionModel
