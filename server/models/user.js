export default (sequelize, DataTypes) =>
    // define() 方法接受三个参数
    // 表名，表字段的定义和表的配置信息
    sequelize.define('user', {
        id: {
            // Sequelize 库由 DataTypes 对象为字段定义类型
            type: DataTypes.INTEGER(11),
            // 允许为空
            allowNull: false,
            // 主键
            primaryKey: true,
            // 自增
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            // 唯一
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    })
