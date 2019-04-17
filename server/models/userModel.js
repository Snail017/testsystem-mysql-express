const db = require('../config/sequelize.config')
const Sequelize = db.sequelize;
const User = Sequelize.import('../schema/user.js')

User.sync({force: false});

class UserModel {
    /**
     * 创建用户
     * @param user
     * @returns {Promise<boolean>}
     */
    static async create(user) {
        let {Nickname, Password,/* email, Usertoken*/} = user;

        await User.create({
            Nickname,
            Password,
            // email,
            // Usertoken,
        })
        return true
    }

    /**
     * 删除用户
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async delete(id) {
        await User.destroy({
            where: {
                id,
            }
        })
        return true
    }

    /**
     * 查询用户列表
     * @returns {Promise<*>}
     */
    static async findAllUserList() {
        return await User.findAll({
            attributes: ['id', 'Nickname', 'email']
        })
    }


    /**
     * 查询用户信息
     * @param Nickname  姓名
     * @returns {Promise.<*>}
     */
    static async Nickname(Nickname) {
        return await User.findOne({
            where: {
                Nickname
            }
        })
    }
}

module.exports = UserModel
