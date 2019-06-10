const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tbQuestion', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 考试id
        exam_id: {
            type: Number,
            field: 'exam_id',
            allowNull: false
        },
        //题目
        problem:{
            type: DataTypes.STRING(255),
            field: 'problem',
            allowNull: false
        },
        // 解析
        parsing: {
            type: DataTypes.STRING(255),
            field: 'parsing',
            allowNull: false
        },
        // 试卷说明
        prompt: {
            type: DataTypes.STRING(255),
            field: 'prompt',
            allowNull: false
        },
        // 选项
        extid: {
            type:DataTypes,
            field: 'extid',
            allowNull: false
        },
        // 题目分数
        score: {
            type: Number,
            field: 'score',
            allowNull: false
        },
        // 题目类型    QA==0  radio==1  checkbox==2  judge==3
        type:{
            type:Number,
            field:'type',
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
            type: DataTypes.DATE,
            field: 'updated_id',
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
