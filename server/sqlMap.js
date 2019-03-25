/**
 * Created by xiaoze on 2017/12/5.
 */
// sql语句
var sqlMap = {
  // 用户
  user: {
    add: 'insert into tbUser(Nickname, Password) values (?, ?)',
    sel:' SELECT id,Nickname,Usertoken FROM tbUser where Nickname=?',
    login:' SELECT Nickname,Password FROM tbUser where Nickname=? and  Password=?',
    setToken: 'UPDATE tbUser SET Usertoken=? WHERE Nickname=? ',
  }
}
module.exports = sqlMap
