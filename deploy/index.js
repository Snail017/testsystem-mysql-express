const scpClient = require('scp2');
const chalk = require('chalk');
const server = require('./products');
const Client = require('ssh2').Client;
const conn = new Client();
const ora = require('ora');
var compressing = require("compressing");
const environment = server.path+server.localpath
const spinner = ora('正在发布到' + environment + '服务器...');
const ziping = ora('正在压缩' + environment);
//压缩
ziping.start()
compressing.zip.compressDir( server.localpath + "/", "dist.zip")
  .then((e) => {
    console.log(chalk.green('压缩成功'));
    ziping.stop()
    spinner.start();
    scpClient.scp(
      'dist.zip',
      {
        host: server.host,
        // port: server.port,
        username: server.username,
        password: server.password,
        path: server.path
      },
      (err) => {
        spinner.stop();
        if (err) {
          console.log(chalk.red('发布失败.\n'));
          throw err;
        } else {
          conn.on('ready', () => {
            conn.exec('cd '+server.path+' \nrm -rf '+server.localpath+'\nunzip -o dist.zip', (err, stream) => {
              if (err) throw err;
              console.log(chalk.green('Success! 成功发布到' + environment + '服务器! \n'));
              conn.end()
            })
          }).connect({
            host: server.host,
            // port: server.port,
            username: server.username,
            password: server.password
            //privateKey: require('fs').readFileSync('/home/admin/.ssh/id_dsa')
          });
        }
      }
    );
  })
  .catch(err => {
    console.error('zip', err);
  });
