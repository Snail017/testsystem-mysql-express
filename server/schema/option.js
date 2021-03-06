const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tboption', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 考试id
        exam_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'exam_id',
            allowNull: false
        },
        // 问题id
        question_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'question_id',
            allowNull: false
        },
        //内容
        text: {
            type: DataTypes.STRING(255),
            field: 'content',
            allowNull: true
        },
        // 选项排序
        sort: {
            type: DataTypes.STRING(11),
            field: 'sort',
            allowNull: true
        },
        isUrl: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'isUrl',
            allowNull: true
        },
        //选项图片
        img: {
            type: DataTypes.STRING(255),
            field: 'img',
            allowNull: true
        },
        //选项介绍
        introduce: {
            type: DataTypes.STRING(255),
            field: 'introduce',
            allowNull: true
        },
        //答案
        answer: {
            type: DataTypes.STRING(255),
            field: 'answer',
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_date',
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_date',
        }
    }, {
            // 如果为 true 则表的名称和 model 相同，即 user
            // 为 false MySQL创建的表名称会是复数 users
            // 如果指定的表名称本就是复数形式则不变
            timestamps: true,
            freezeTableName: true,
        })
}
