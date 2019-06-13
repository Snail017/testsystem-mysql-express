const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tbuser', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 用户名字
        Nickname: {
            type: DataTypes.STRING(100),
            field: 'Nickname',
            allowNull: false
        },
        // 用户密码
        Password: {
            type: DataTypes.STRING(255),
            field: 'Password',
            allowNull: false
        },
        // 用户邮箱
        email: {
            type: DataTypes.STRING(100),
            field: 'email',
            allowNull: true
        },
        // usertoken
        Usertoken: {
            type: DataTypes.STRING(100),
            field: 'Usertoken',
            allowNull: true
        },
        //用户类型
        type:{
            type: DataTypes.STRING(100),
            field: 'type',
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_id',
        },
        updatedAt: {
            field: 'updated_id',
            type: DataTypes.DATE,
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        timestamps: true,
        freezeTableName: true,

    })
}
