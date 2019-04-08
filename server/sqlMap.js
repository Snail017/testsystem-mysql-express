/**
 * Created by xiaoze on 2017/12/5.
 */
// sql语句
var sqlMap = {
    // 用户
    user: {
        sql_add: 'insert into tbUser(Nickname, Password) values (?, ?)',
        sql_sel: ' SELECT id,Nickname,Usertoken FROM tbUser where Nickname=?',
        sql_login: ' SELECT Nickname,Password ,id,FROM tbUser where Nickname=? and  Password=?',
        sql_setToken: 'UPDATE tbUser SET Usertoken=? WHERE id=?',
    }
}
module.exports = sqlMap
