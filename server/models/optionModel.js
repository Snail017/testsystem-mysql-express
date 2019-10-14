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
        let { question_id, exam_id, text, answer, sort, img, introduce } = exam;
        let sql = await Option.create({
            question_id, exam_id, text, answer, sort, img, introduce: introduce.editorTxt, isUrl: Number(introduce.isUrl)
        })
        return sql;
    }

    /**
     * 修改选项
     */
    static async alterOption(exam) {
        let { option_id, question_id, exam_id, text, answer, sort, img, introduce } = exam;
        await Option.update({
            text, answer: String(answer), sort, img, introduce: introduce.editorTxt, isUrl: Number(introduce.isUrl)
        }, {
                where: {
                    question_id: question_id,
                    id: option_id,
                    exam_id: exam_id
                }
            })
        return true;
    }

    /**
     * 获取选项
     */
    static async findAllOption(exam) {
        let { id } = exam;
        let sql = await Option.findAll({
            attributes: ['question_id', 'isUrl', 'img', 'introduce', 'text', 'id'],
            where: {
                question_id: id
            }
        })
        return sql;
    }
    /**
     * @return {option_id}
     * 删除选项
     */
    static async deleteOption(res) {
        let { option_id } = res;
        await Option.destroy({
            where: {
                id: option_id
            }
        })
        return true;
    }
    /**
     * 根据question_id 删除所有选项
     * @param {*} question_id 
     */
    static async deleteOptionByQuesid(question_id) {
        await Option.destroy({
            where: {
                question_id: question_id
            }
        })
        return true;
    }
    /**
     * 根据exam_id 删除所有选项
     * @param {*} 根据exam_id 
     */
    static async deleteOptionByExamid(exam_id) {
        await Option.destroy({
            where: {
                exam_id: exam_id
            }
        })
        return true;
    }
}

module.exports = OptionModel
