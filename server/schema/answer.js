const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tbanswer', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 考试id
        exam_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'examid',
            allowNull: false
        },
        //答卷完成状态  ( 0 ==发布中  1==已完成)
        status:{
            type: DataTypes.INTEGER,
            field: 'status'
        },
        score:{
            type: DataTypes.INTEGER,
        },
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'userid',
            allowNull: false
        },
        questions:{
            type: DataTypes.STRING,
            field: 'questions',
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_date',
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_date',
            get() {
                return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
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
