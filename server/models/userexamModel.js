const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const userExam = Sequelize.import('../schema/user_exam.js')
const Op = Sequelize.Op;
userExam.sync({ force: false });

class userexamModel {
    static async create(res) {
        let { user_id, exam_id, status } = res;
        return userExam.create({
            user_id: user_id,
            exam_id: exam_id,
            status: status
        })
    }
    //修改答卷状态
    static async alterAnswer(res){
        let {exam_id,user_id,status}=res;
        return await userExam.update({
            status:status
        },{
            where:{
                exam_id:exam_id,
                user_id:user_id,
            }
        })
    }
    //根据examid status 获得答卷人
    static  async answerUser(res){
        let {user_id,status,exam_id}=res;
        return await userExam.findAll({
            where:{
                exam_id:exam_id,
            }
        })
    }
    //答卷列表
    static async answerList(res) {
        let { user_id, status, title, page, pagecount } = res;
        return await userExam.findAll(
            {
                where: {
                    user_id: user_id
                },
                offset: (Number(pagecount) - 1) * page,
                limit: Number(page),
                order: [
                    ['exam_id', 'DESC']
                ],
            },
        )
    }
    static async delByExam(exam_id) {
        return userExam.destroy({
            where: {
                exam_id: exam_id
            }
        })
    }

    static async delByUser(user_id) {
        return userExam.destroy({
            where: {
                user_id: user_id
            }
        })
    }

    static async findUser(exam_id) {
        return userExam.findAll( {
                attributes: ['user_id'],
                where: {
                    exam_id: exam_id
                }
            })
    }
    static async findExam(user_id) {
        return userExam.findAll({
            where: {
                user_id: user_id
            }
        })
    }
}

module.exports = userexamModel
