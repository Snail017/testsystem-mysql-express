const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const userExam = Sequelize.import('../schema/user_exam.js')
const Op=Sequelize.Op;
userExam.sync({ force: false });

class userexamModel {
    static async create(res) {
        let { user_id, exam_id, status } = res;
        return userExam.create({
            user_id, exam_id, status
        })
    }

    static async getExam(res) {
        let {status ,userid}=res;
        return userExam.findAll({
            where: {
                userid: userid,
                status:status==-1?'>0':status
            }
        })
    }

    static async getUser(res) {
        return userExam.findAll({
            where: {
                examid: examid
            }
        })
    }
}

module.exports = userexamModel
