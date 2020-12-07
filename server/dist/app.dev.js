"use strict";

/**
 * node 后端服务器
 * node启动文件
 */
var fs = require('fs');

var path = require("path");

var bodyParser = require('body-parser');

var cookieParase = require('cookie-parser');

var redis = require('redis');

var express = require('express');

var app = express();

var routes = require('./routes');

var Token = require('./config/token.config.js');

global.public_key = fs.readFileSync('./server/key/pub.key', 'UTF-8');
global.private_key = fs.readFileSync('./server/key/pri.key', 'UTF-8');
app.use(cookieParase());
app.use(bodyParser.json()); //对接口过滤检验token

app.all("*", function _callee(req, res, next) {
  var token;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.header("Access-Control-Expose-Headers", "Authorization");
          res.header('Cache-Control', 'no-store');

          if (!(req.path != "/publicKey" && req.path != "/captcha" && req.path != '/login' && req.path != "/register")) {
            _context.next = 9;
            break;
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(Token.checkToken(req.headers.authorization));

        case 5:
          token = _context.sent;

          try {
            if (token.status == 404) {
              res.json({
                code: 401,
                msg: "token已过期，请重新登录"
              });
            } else {
              if (token.status == 202) {
                res.header("Authorization", token.access_token);
              }

              next();
            }
          } catch (err) {
            res.json({
              code: 500,
              msg: err
            });
          }

          _context.next = 10;
          break;

        case 9:
          next();

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.use('/', routes); // 后端api路由
// 监听端口

app.listen(3000, 'localhost', function (err, res) {
  if (err) console.log(err);
  console.log('success listen at port:3000......');
}); //连接redis数据库

global.client = redis.createClient(6379, '127.0.0.1');
global.client.on('error', function (err) {
  console.log('redis Error ' + err);
});
global.client.on("connect", function () {
  global.client.set("private_key", global.private_key, redis.print);
  global.client.set("public_key", global.private_key, redis.print);
});
global.client.on('ready', function (res, req) {
  console.log("redis success.....");
});