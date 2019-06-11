const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tbOption', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 问题id
        question_id: {
            type: Number,
            field: 'question_id',
            allowNull: false
        },
        //内容
        content:{
            type: DataTypes.STRING(255),
            field: 'content',
            allowNull: false
        },
        // 选项排序
        label: {
            type: DataTypes.STRING(11),
            field: 'label',
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
