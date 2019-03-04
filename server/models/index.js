/*实例化sequelize*/
import Sequelize from 'sequelize'
import config from '../databse.config'

// 实例化，并指定配置
export const sequelize = new Sequelize(config)
// 导入
export const User = sequelize.import(__dirname + '/User')

// 测试连接
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })



// 标准同步
// 只有当数据库中不存在与模型同名的数据表时，才会同步
sequelize.sync()
// 动态同步
// 修改同名数据表结构，以适用模型。

// sequelize.sync({alter: true})
// 强制同步
// 删除同名数据表后同步，谨慎使用，会导致数据丢失
// sequelize.sync({force: true})

// 另外，当你指定表与表之间的关联后，修改被关联的表结构时会抛出异常。
// 需要先注释掉关联代码，然后更新同步模型后，再取消掉注释即可。
// 再另外，当你有新的关联时必须使用动态同步才会生效。
