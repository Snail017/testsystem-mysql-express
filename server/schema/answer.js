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
        user_id: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'userid',
            allowNull: false
        },
         // 考试状态（是否发布）  未发布为1  发布为2  已结束 3
         status: {
            type: DataTypes.INTEGER.UNSIGNED,
            field: 'status',
            allowNull: false
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
