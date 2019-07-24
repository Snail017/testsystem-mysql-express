/*实例化sequelize*/
const Sequelize =require("sequelize")
const models = require('../config/databse.config')

// 实例化，并指定配置
//实例化sequelize
var sequelize = new Sequelize(models.mysql.database, models.mysql.user, models.mysql.password, {
    host: models.mysql.host,
    dialect: 'mysql',
    operatorsAliases: false,
    dialectOptions: {
        charset: "utf8mb4",
        // collate: "utf8mb4_unicode_ci",
        supportBigNumbers: true,
        bigNumberStrings: true
    },

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+08:00' //东八时区
})

// 测试连接
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

module.exports={
    sequelize
}