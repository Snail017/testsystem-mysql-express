/**
 * Created by xiaoze on 2017/12/5.
 */
// sql语句
var sqlMap = {
  // 用户
  user: {
    add: 'insert into TbUser(Nickname, Password,Usertoken) values (?, ?,?)',
    sel:' SELECT id,Nickname,Usertoken FROM TbUser where Nickname=?',
    setToken: 'UPDATE TbUser SET Usertoken=? WHERE Nickname=? ',
  }
}
module.exports = sqlMap
