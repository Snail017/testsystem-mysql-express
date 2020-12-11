
/*
 *读取env环境变量
 */
const fs = require('fs');
const path = require('path');
// env 文件 判断打包环境指定对应的服务器id
const envfile = process.env.VUE_APP_CURRENTMODE === 'prod' ? '../.env.prod' : '../.env.dev';
// env环境变量的路径
const envPath = path.resolve(__dirname, envfile);
// env对象
const envObj = parse(fs.readFileSync(envPath, 'utf8'));
const SERVER_ID = parseInt(envObj['VUE_APP_SERVER_ID']);

function parse(src) {
  // 解析KEY=VAL的文件
  const res = {};
  src.split('\n').forEach(line => {
    // matching "KEY' and 'VAL' in 'KEY=VAL'
    // eslint-disable-next-line no-useless-escape
    const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
    // matched?
    if (keyValueArr != null) {
      const key = keyValueArr[1];
      let value = keyValueArr[2] || '';

      // expand newlines in quoted values
      const len = value ? value.length : 0;
      if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
        value = value.replace(/\\n/gm, '\n');
      }

      // remove any surrounding quotes and extra spaces
      value = value.replace(/(^['"]|['"]$)/g, '').trim();

      res[key] = value;
    }
  });
  return res;
}

/*
 *定义多个服务器账号 及 根据 SERVER_ID 导出当前环境服务器账号
 */
const SERVER_LIST = [
  {
    id: 0,
    name: 'A-正式环境',
    "host": '******', // IP地址
    "port": '80',            // 服务器端口
    "username": 'root',       // 用户名
    "password": '*******',     // 密码
    "path": '/home/project/landingpage/'  ,
    'localfile':envObj.VUE_APP_DEV   //本地打包文件名
  },
  {
    id: 1,
    name: 'A-生产环境',
    "host": '******', // IP地址
    "port": '443',            // 服务器端口
    "username": 'root',       // 用户名
    "password": '******',     // 密码
    "path": '/home/project/landingpage/'  ,
    'localfile':envObj.VUE_APP_DEV   //本地打包文件名
  },
];
module.exports = SERVER_LIST[SERVER_ID];