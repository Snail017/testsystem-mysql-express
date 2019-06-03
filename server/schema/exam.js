const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tbQuestionnaire', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 用户id
        user_id: {
            type: Number,
            field: 'userid',
            allowNull: false
        },
        //指定人
        designated:{
            type: JSON,
            field: 'designated',
            allowNull: false
        },
        // 试卷标题
        title: {
            type: DataTypes.STRING(255),
            field: 'title',
            allowNull: false
        },
        // 试卷说明
        explain: {
            type: DataTypes.STRING(255),
            field: 'introduce',
            allowNull: false
        },
        // 考试时间
        testtime: {
            type: DataTypes.STRING(100),
            field: 'testtime',
            allowNull: false
        },
        // 考试状态（是否发布）
        status: {
            type: Number,
            field: 'status',
            allowNull: false
        },
        // 是否隐藏考题
        sort:{
            type:Boolean,
            field:'sort',
            allowNull:true
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_id',
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
            }
        },
        updatedAt: {
            field: 'updated_id',
            type: DataTypes.DATE,
            get() {
                return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD');
            }
        }
    }, {
        // 如果为 true 则表的名称和 model 相同，即 user
        // 为 false MySQL创建的表名称会是复数 users
        // 如果指定的表名称本就是复数形式则不变
        timestamps: true,
        freezeTableName: true,
    })
}
