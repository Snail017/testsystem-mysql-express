const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const Exam = Sequelize.import('../schema/exam.js')
const Op = Sequelize.Op;

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
        }, {
                where: {
                    id: exam_id
                }
            })
        return true
    }


    /**
     * @param user_id
     * @param status
     * @returns 
     * 筛选问卷列表
     */
    static async getlist(exam) {
        let { user_id, status, title, page, pagecount } = exam;
        return await Exam.findAll(
            {
                where: {
                    user_id: user_id,
                    status: status == -1 ? { [Op.lt]: 3 } : status,
                    [Op.or]: {
                        title: {
                            [Op.like]: "%" + title + "%"
                        },
                        id: {
                            [Op.like]: "%" + title + "%"
                        }
                    }

                },
                offset: (Number(pagecount) - 1) * page,
                limit: Number(page),
                order: [
                    ['id', 'DESC']
                ],
            },
        )
    }
    /**
     * 通过status title id 查找问卷
     * @param {status,title,id} exam 
     */
    static async getlistByExamid(exam) {
        let { exam_id, status, title} = exam;
        return await Exam.find(
            {
                where: {
                    id: exam_id,
                    status: status == -1 ? { [Op.lt]: 3 } : status,
                    [Op.or]: {
                        title: {
                            [Op.like]: "%" + title + "%"
                        },
                        id: {
                            [Op.like]: "%" + title + "%"
                        }
                    }

                },
            },
        )
    }

    static async findExam(exam) {
        let { exam_id } = exam;
        let sql = await Exam.findAll({
            where: {
                id: exam_id
            }
        })
        return sql
    }
    static async findByuserExam(exam) {
        let { exam_id ,user_id} = exam;
        let sql = await Exam.findOne({
            where: {
                id: exam_id,
                user_id:user_id
            }
        })
        return sql
    }
    static async deleteExam(exam_id) {
        await Exam.destroy({
            where: {
                id: exam_id
            }
        })
        return true
    }

    static async changeStatus(exam) {
        let { user_id, exam_id, status } = exam;
        let sql = await Exam.update({
            status
        }, {
                where: {
                    user_id: user_id,
                    id: exam_id
                }
            })
        return sql;
    }
}

module.exports = ExamModel
