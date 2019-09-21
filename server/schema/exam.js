const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tbquestionnaire', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 用户id
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'userid',
            allowNull: false
        },
        //指定人
        designated: {
            type: DataTypes.STRING(255),
            field: 'designated',
            allowNull: true
        },
        // 试卷标题
        title: {
            type: DataTypes.STRING(255),
            field: 'title',
            allowNull: true
        },
        // 试卷说明
        explain: {
            type: DataTypes.STRING(255),
            field: 'explain',
            allowNull: true
        },
        // 考试时间
        testtime: {
            type: DataTypes.STRING(100),
            field: 'testtime',
            allowNull: false
        },
        // 考试状态（是否发布）  未发布为1  发布为2  已结束 3
        status: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'status',
            allowNull: false
        },
        // 是否隐藏考题
        sort: {
            type: DataTypes.BOOLEAN,
            field: 'sort',
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_date',
        },
        updatedAt: {
            field: 'updated_date',
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
