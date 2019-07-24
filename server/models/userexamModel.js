const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const userExam = Sequelize.import('../schema/user_exam.js')
const Op = Sequelize.Op;
userExam.sync({ force: false });

class userexamModel {
    static async create(res) {
        let { user_id, exam_id } = res;
        return userExam.create({
            userid: user_id,
            examid: exam_id,
        })
    }

    static async delByExam(exam_id){
        return userExam.destroy({
            where:{
                examid:exam_id
            }
        })
    }

    static async delByUser(user_id){
        return userExam.destroy({
            where:{
                userid:user_id
            }
        })
    }

    static async findUser(exam_id) {
        return userExam.findAll({
            where: {
                examid: exam_id
            }
        })
    }
    static async findExam(user_id) {
        return userExam.findAll({
            where: {
                userid: user_id
            }
        })
    }
}

module.exports = userexamModel
