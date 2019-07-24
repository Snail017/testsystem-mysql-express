/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/app.js":
/*!***********************!*\
  !*** ./server/app.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * node 后端服务器
 * node启动文件
 */
const fs = __webpack_require__(/*! fs */ "fs");
const path=__webpack_require__(/*! path */ "path")
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const cookieParase = __webpack_require__(/*! cookie-parser */ "cookie-parser");
const redis = __webpack_require__(/*! redis */ "redis");
const express = __webpack_require__(/*! express */ "express");
const webpackDevMiddleware = __webpack_require__(/*! webpack-dev-middleware */ "webpack-dev-middleware");
const Token = __webpack_require__(/*! ./config/token.config.js */ "./server/config/token.config.js")
const app = express();

global.public_key = fs.readFileSync(__dirname+"/key/pub.key").toString();
global.private_key = fs.readFileSync(__dirname+"/key/pri.key").toString();
app.use(cookieParase());
app.use(bodyParser.json());

const routes = __webpack_require__(/*! ./routes */ "./server/routes.js");

//对接口过滤检验token
app.all("*", async (req, res, next) => {
    res.header("Access-Control-Expose-Headers", "Authorization");
    res.header('Cache-Control', 'no-store');

    if (req.path != "/publicKey" && req.path != "/captcha" && req.path != '/login' && req.path != "/register") {
        const token = await Token.checkToken(req.headers.authorization);
        try {
            if (token.status == 404) {
                res.json({
                    code: 401,
                    msg: "token已过期，请重新登录"
                })
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
            })
        }
    } else {
        next()
    }
})

app.use('/', routes);  // 后端api路由

//连接redis数据库

global.client = redis.createClient(6379, '127.0.0.1');

global.client.on('error', function (err) {
    console.log('redis Error ' + err);
});

global.client.on("connect", function () {
    global.client.set("private_key", global.private_key, redis.print);
    global.client.set("public_key", global.private_key, redis.print);
});

global.client.on('ready', function (res, req) {
    console.log("redis success.....")
});

// 连接数据库
// global.conn = mysql.createConnection(models.mysql);
// global.conn.connect();

// 监听端口
app.listen(3000, 'localhost', function (err, res) {
    if (err) console.log(err)
    console.log('success listen at port:3000......')
})



/***/ }),

/***/ "./server/config/databse.config.js":
/*!*****************************************!*\
  !*** ./server/config/databse.config.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*数据库配置文件*/
module.exports = {
    // 打开哪个数据库
    mysql:{
        host: '95.169.20.53',//95.169.20.53
        user: 'root',
        password: 'Zq@574839',  //Zq@574839
        database: 'zqq',
        port: '3306',
        // 数据表相关的全局配置
        // define: {
        //     // 是否冻结表名
        //     // 默认情况下，表名会转换为复数形式
        //     freezeTableName: true,
        //     // 是否为表添加 createdAt 和 updatedAt 字段
        //     // createdAt 记录表的创建时间
        //     // updatedAt 记录字段更新时间
        //     timestamps: true,
        //     // 是否为表添加 deletedAt 字段
        //     // 默认情况下, destroy() 方法会删除数据，
        //     // 设置 paranoid 为 true 时，将会更新 deletedAt 字段，并不会真实删除数据。
        //     paranoid: false
        // }
    }
}
    

/***/ }),

/***/ "./server/config/sequelize.config.js":
/*!*******************************************!*\
  !*** ./server/config/sequelize.config.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*实例化sequelize*/
const Sequelize = __webpack_require__(/*! sequelize */ "sequelize")
const models = __webpack_require__(/*! ../config/databse.config */ "./server/config/databse.config.js")

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

/***/ }),

/***/ "./server/config/token.config.js":
/*!***************************************!*\
  !*** ./server/config/token.config.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const jwt=__webpack_require__(/*! jsonwebtoken */ "jsonwebtoken")

/**
 * 设置校验token
 */
class Token{

    /**
     * @param {*key} key 
     * @params {*value} value
     */
    static redisSet(key,val){
        return new Promise((resolve,reject)=>{
            global.client.set(Number(key),val,(err,res)=>{
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    

    /**
     * 
     * @param {key} key 
     * @returns {*value} value 
     */
    static redisGet(key){
        return new Promise((resolve,reject)=>{
            global.client.get(Number(key),(err,res)=>{
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    /**
     * 
     * @param {*用户id} id 
     * @param {*token} token 
     * @returns {*token过期,重新登录}  status 404
     * @returns {*access_token过期，设置新的token} status 202
     * @returns {*token 未过期} status 200
     */
    static async checkToken(token){
        try{
            let nowDate=Number(new Date());
            //获取判断access_token  判断是否过期
            let jwt_access_token=await jwt.verify(token,global.private_key);
            let id=jwt_access_token.sub;
            if(jwt_access_token.exp<nowDate){
                //获取解析refresh_token 判断有效时间
                let old_refresh_token=await Token.redisGet(token);
                let jwt_old_refresh_token=await jwt.verify(old_refresh_token,global.private_key);
                if(jwt_old_refresh_token.exp<nowDate){
                    return {
                        status:404
                    }
                }else{
                    let new_fresh_token=await Token.setToken(id,1*24*60*60);
                    let new_access_token=await Token.setToken(id,60);
                    Token.redisSet(new_fresh_token,new_fresh_token); //设置新的refresh_token 放入redis
                    return {
                        status:202,
                        access_token : new_access_token,
                        uid : id,
                        msg : "更新token"
                    }
                }
            }else{
                return {
                    status:200,
                    uid : id,
                    msg:"token有效中"
                };
            }

        }catch(err){
            return {
                status:404,
                msg:err
            }
        }
   

    }

     /**
      * 设置token
     * @param userid 用户id
     * @param overtime  有效时间
     * @param name 用户名
     * @returns token 
     * */
    static setToken(userid, overtime) {
        var playload = {
                iss: '1670644339@qq.com',   // JWT的签发者
                sub: userid,    // JWT所面向的用户
                exp:new Date().getTime()+overtime*1000,
                aud: "1670644339@qq.com",  //接收JWT的一方
                iat: new Date().getTime(),  // 该JWT签发的时间
            };
        var token = jwt.sign(playload,global.private_key);
        return token;
    }

}

module.exports=Token

/***/ }),

/***/ "./server/controllers/answer.js":
/*!**************************************!*\
  !*** ./server/controllers/answer.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const answerModel = __webpack_require__(/*! ../models/answerModel */ "./server/models/answerModel.js");
const quesModel = __webpack_require__(/*! ../models/quesModel */ "./server/models/quesModel.js");
const optionModel = __webpack_require__(/*! ../models/optionModel */ "./server/models/optionModel.js");
const common = __webpack_require__(/*! ./common */ "./server/controllers/common.js");
const Token = __webpack_require__(/*! ../config/token.config */ "./server/config/token.config.js")

class Answer {
    static async answerList(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        let errors = await common.checkData(params);
        if (!errors) return false;

        try {
            const answerList=await answerModel.answerList(params);
            if(answerList){
                
            }
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
            return false;
        }
    }
}

module.exports = Answer 

/***/ }),

/***/ "./server/controllers/common.js":
/*!**************************************!*\
  !*** ./server/controllers/common.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

class Common{
    /**
     * 检测参数是否存在为空
     * @param {*} req 
     * @param {*} res 
     */
    static async checkData(params,res){
        let errors = [];
        for (let item in params) {
            if (params[item] === undefined) {
                let index = errors.length + 1;
                errors.push("错误" + index + ": 参数: " + item + "不能为空")
            }
        }

        if (errors.length > 0) {
            res.status = 412;
            res.json({
                code: 412,
                msg: errors
            })
            return false;
        }
        return true
    }
}
module.exports = Common

/***/ }),

/***/ "./server/controllers/exam.js":
/*!************************************!*\
  !*** ./server/controllers/exam.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const examModel = __webpack_require__(/*! ../models/examModel */ "./server/models/examModel.js");
const quesModel = __webpack_require__(/*! ../models/quesModel */ "./server/models/quesModel.js");
const optionModel = __webpack_require__(/*! ../models/optionModel */ "./server/models/optionModel.js");
const userExam=__webpack_require__(/*! ../models/userexamModel */ "./server/models/userexamModel.js")
const common = __webpack_require__(/*! ./common */ "./server/controllers/common.js");
const Token = __webpack_require__(/*! ../config/token.config */ "./server/config/token.config.js")

class Exam {
    /**
     * 创建用户
     * @param   title     试卷标题
     * @param   status    试卷状态 （是否发布）
     * @param   explain   试卷说明
     * @param   testtime  考试限制时间
     * @returns 创建成功返回用户信息，失败返回错误信息
     */
    static async create(req, res) {
        let params = req.body;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;

        const checkData = await common.checkData(params, res); // 检测参数是否存在为空
        if (!checkData) return false;
        try {
            //exam_id==0  新创建的文件
            if (params.exam_id == 0) {
                const createExam = await examModel.createExam(params);
                if (createExam) {
                    res.status = 200;
                    res.json({
                        code: 200,
                        data: {
                            id: createExam.id
                        },
                        msg: "提交成功！"
                    })
                }
            } else {
                const alterExam = await examModel.alterExam(params);
                if (alterExam) {
                    res.status = 200;
                    res.json({
                        code: 200,
                        data: {
                            id: params.exam_id
                        },
                        msg: "修改成功"
                    })
                }
            }
        } catch (err) {
            res.status = 412;
            res.json({
                code: 412,
                msg: err
            })
            return false;
        }
    }


    /**
     * 获取问卷列表  
     * @param {*} req 
     * @param {*} res 
     */
    static async getlist(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;

        let checkdata = await common.checkData(params, res);
        if (!checkdata) return false;

        const users = await examModel.getlist(params);
        try {
            res.status = 200;
            res.json({
                code: 200,
                data: {
                    users: users,
                    data_total: "2",
                    p: "1",
                    page_rows: "10",
                    page_total: 1
                }
            })
        } catch (errors) {
            res.status = 412;
            res.json({
                code: 412,
                msg: errors
            })
            return false;
        }

    }


    /**
     * 修改考卷状态
     * @param {*exam_id} req 
     * @param {*status}  ==0 结束本次考试   ==1 发布本次考试  ==2作废本次考试  ==3删除本次试卷 
     * @param {*} res 
     */
    static async patchExam(req, res) {
        let params = req.body;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;

        let checkdata = await common.checkData(params, res);
        if (!checkdata) return false;
        try{
            await examModel.changeStatus(params);
            res.status=200;
            res.json({
                code:200,
                msg:"状态修改成功"
            })
        }catch(err){
            res.status=412;
            res.json({
                code:500,
                msg:err
            })
            return false;
        }


    }

    /**
     * 删除试卷
     * @param {status==3} req 
     * @param {*} res 
     */
    static async deleteExam(req, res) {
        let params = req.body;
        // 检测参数是否存在为空
        let checkdata = await common.checkData(params, res);
        if (!checkdata) return false;

        try {
            await optionModel.deleteOptionByExamid(params.exam_id);
            await quesModel.delQuesByExamid(params.exam_id);
            await examModel.deleteExam(params.exam_id);
            res.status = 200;
            res.json({
                code: 200,
                msg: "问卷删除成功"
            })
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                data: err
            })
        }
    }


}

module.exports = Exam 

/***/ }),

/***/ "./server/controllers/option.js":
/*!**************************************!*\
  !*** ./server/controllers/option.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const examModel = __webpack_require__(/*! ../models/examModel */ "./server/models/examModel.js");
const quesModel = __webpack_require__(/*! ../models/quesModel */ "./server/models/quesModel.js");
const optionModel = __webpack_require__(/*! ../models/optionModel */ "./server/models/optionModel.js");
const common = __webpack_require__(/*! ../controllers/common */ "./server/controllers/common.js");
const Token = __webpack_require__(/*! ../config/token.config */ "./server/config/token.config.js")

class Option {
    /**
    * 删除选项
    */
    static async deleteOption(req, res) {
        let params = req.body;
        // 检测参数是否存在为空
        let errors =await common.checkData(params,res);
        if(!errors) return false;

        try {
            const delOption = await optionModel.deleteOption(params);
            if (delOption) {
                res.status = 200;
                res.json({
                    code: 200,
                    msg: "选项删除成功"
                })
            }
        } catch (err) {
            res.status = 500;
            res.json({
                code: 500,
                msg: err
            })
        }
    }

}
module.exports = Option

/***/ }),

/***/ "./server/controllers/question.js":
/*!****************************************!*\
  !*** ./server/controllers/question.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const examModel = __webpack_require__(/*! ../models/examModel */ "./server/models/examModel.js");
const quesModel = __webpack_require__(/*! ../models/quesModel */ "./server/models/quesModel.js");
const optionModel = __webpack_require__(/*! ../models/optionModel */ "./server/models/optionModel.js");
const common = __webpack_require__(/*! ../controllers/common */ "./server/controllers/common.js");
const Token = __webpack_require__(/*! ../config/token.config */ "./server/config/token.config.js")

class Ques {

    /**
     * 根据question_id 删除某个题目
     * @param {id} req 
     * @param {*} res 
     */
    static async deletequestion(req, res) {
        let params = req.body;
        // 检测参数是否存在为空
        let errors = await common.checkData(params, res);
        if (!errors) return false;

        try {
            await optionModel.deleteOptionByQuesid(params.id);
            await quesModel.delQues(params);
            res.status = 200;
            res.json({
                code: 200,
                msg: '题目删除成功'
            })
        } catch (err) {
            res.status = 500;
            res.json({
                code: 500,
                data: err
            })
        }
    }


    /**
     * 创建题目 
     * @param {*question_id} req  question_id==0 创建题目
     * @param {*} res 
     */
    static async create(req, res) {
        let params = req.body;

        // 检测参数是否存在为空
        let errors = common.checkData(params, res);
        if (!errors) return false;

        try {
            const createQues = await quesModel.createQues(params);
            if (createQues) {
                //questionType  判断题目类型  非简答题才有选项
                if (params.questionType != 0) {
                    for (let i in params.optiondata) {
                        let ls_option = params.optiondata[i];
                        ls_option.exam_id = params.exam_id;
                        ls_option.question_id = createQues.id;
                        await optionModel.createOption(ls_option);
                    }
                }
                res.status = 200;
                res.json({
                    code: 200,
                    msg: "上传成功"
                })
            }
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
            return false;
        }

    }

    /**
     * 修改题目
     * @param {*question_id} question_id !=0
     * @param {*option_id} option_id ==0创建选项  option_id !=0修改选项
     */
    static async patchQues(req, res) {
        let params = req.body;

        // 检测参数是否存在为空
        let errors = common.checkData(params, res);
        if (!errors) return false;

        try {
            //修改问题  
            const alterQues = await quesModel.alterQues(params);
            if (params.questionType != 0) {
                //修改选项   当option_id==0是该选项为新建
                for (let i in params.optiondata) {
                    params.optiondata[i].question_id = params.question_id;
                    params.optiondata[i].exam_id = params.exam_id;
                    if (params.optiondata[i].option_id == 0) {
                        var createOption = await optionModel.createOption(params.optiondata[i]);
                        if (!createOption) {
                            res.status = 500;
                            res.json({
                                code: 500,
                                msg: "题目上传错误"
                            })
                            return false;
                        }
                    } else {
                        var alterOption = await optionModel.alterOption(params.optiondata[i]);
                        if (!alterOption) {
                            res.status = 500;
                            res.json({
                                code: 500,
                                msg: "题目上传错误"
                            })
                            return false;
                        }
                    }
                }
            }
            if (alterQues) {
                res.status = 200;
                res.json({
                    code: 200
                })
            }
        } catch (err) {
            res.status = 412;
            res.json({
                code: 500,
                msg: err
            })
        }
    }

    /**
   * 根据exam_id 获取试卷和题目
   * @param {*} req 
   * @param {*} res 
   */
    static async getQuestions(req, res) {
        let params = req.query;
        let token = await Token.checkToken(req.headers.authorization);
        params.user_id = token.uid;
        // 检测参数是否存在为空
        let errors = await common.checkData(params, res);
        if (!errors) return false;

        const title = await examModel.findExam(params);
        const questions = await quesModel.selectQues(params.exam_id);

        try {
            if (title) {
                let ls_title = title[0].dataValues, ls_question = [], ls_option = [];
                for (let i in questions) {
                    ls_question.push(questions[i].dataValues);
                    ls_option = await optionModel.findAllOption(questions[i].dataValues);
                    ls_question[i].optiondata = ls_option;
                    ls_question[i].question_id = questions[i].dataValues.id;
                }
                ls_title.list = ls_question;
                res.status = 200;
                res.json({
                    code: 200,
                    data: ls_title
                })
            }
        } catch (err) {
            res.status = 500;
            res.json({
                code: 500,
                data: err
            })
            return false;
        }
    }
}
module.exports = Ques

/***/ }),

/***/ "./server/controllers/upload.js":
/*!**************************************!*\
  !*** ./server/controllers/upload.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const multer = __webpack_require__(/*! multer */ "multer");
const path = __webpack_require__(/*! path */ "path")
const fs = __webpack_require__(/*! fs */ "fs");

var createFolder = function (folder) {
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};
//这个路径为文件上传的文件夹的路径
var uploadFolder = '../UserPic/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        var extname = path.extname(file.originalname);//获取文件扩展名
        // 将保存文件名设置为 字段名 + 时间戳+文件扩展名，比如 logo-1478521468943.jpg
        cb(null, file.fieldname + '-' + Date.now() + extname);
    }
});

var uploadImg = multer({ storage: storage })

module.exports = uploadImg

/***/ }),

/***/ "./server/controllers/user.js":
/*!************************************!*\
  !*** ./server/controllers/user.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const UserModel = __webpack_require__(/*! ../models/userModel */ "./server/models/userModel.js");
const svgCaptcha = __webpack_require__(/*! svg-captcha */ "svg-captcha");
const crypto = __webpack_require__(/*! crypto */ "crypto")
const Token = __webpack_require__( /*! ../config/token.config */ "./server/config/token.config.js")

class User {
    /**
     * 创建用户
     * @param   Nickname     用户名字
     * @param   password     用户密码
     * @param   email        用户邮箱  暂时没
     *
     * @returns 创建成功返回用户信息，失败返回错误信息
     */
    static async create(req, res) {
        let params = {
            Nickname: req.body.name,
            Password: req.body.password,
            // email,
            // usertoken
        }

        // 检测参数是否存在为空
        let errors = [];
        for (let item in params) {
            if (params[item] === undefined) {
                let index = errors.length + 1;
                errors.push("错误" + index + ": 参数: " + item + "不能为空")
            }
        }

        if (errors.length > 0) {
            res.status = 412;
            res.json({
                code: 412,
                msg: errors
            })
            return false;
        }

        // 查询用户名是否重复
        const existUser = await UserModel.Nickname(params.Nickname);

        if (existUser) {
            res.status = 403;
            res.json({
                code: 403,
                msg: "用户已经存在"
            })

        } else {
            try {
                // 解密密码
                params.Password = crypto.privateDecrypt(global.private_key, Buffer.from(params.Password, 'base64')).toString();

                // 创建用户
                const newUser = await UserModel.create(params);

                // 签发token
                const access_token = Token.setToken(newUser.id, 10 * 60 * 60);
                const refresh_token = Token.setToken(newUser.id, 15 * 24 * 60 * 60);
                Token.redisSet(access_token, refresh_token);

                res.status = 200;
                res.json({
                    code: 200,
                    msg: `创建用户成功`,
                })

            } catch (err) {
                res.status = 500;
                res.json({
                    code: 500,
                    msg: err
                })
            }

        }

    }


    /**
     * 登录
     * */
    static async login(req, res) {
        let params = {
            Nickname: req.body.name,
            Password: req.body.password,
            // email,
            // usertoken
        }

        // 检测参数是否存在为空
        let errors = [];
        for (let item in params) {
            if (params[item] === undefined) {
                let index = errors.length + 1;
                errors.push("错误" + index + ": 参数: " + item + "不能为空")
            }
        }

        if (errors.length > 0) {
            res.status = 412;
            res.json({
                code: 412,
                msg: errors
            })
            return false;
        }
        // 解密密码
        params.Password = crypto.privateDecrypt(global.private_key, Buffer.from(params.Password, 'base64'));

        // 查询用户名是否重复
        const existUser = await UserModel.Password(params.Nickname, params.Password);

        if (existUser) {
            try {

                // 签发token
                const access_token = Token.setToken(existUser.id, 60);
                const refresh_token = Token.setToken(existUser.id, 15 * 24 * 60 * 60);
                Token.redisSet(access_token, refresh_token);

                res.status = 200;
                res.json({
                    code: 200,
                    msg: `用户登录成功`,
                    data: {
                        access_token: access_token,
                        user_id: existUser.id
                    },
                })

            } catch (err) {
                res.status = 500;
                res.json({
                    code: 500,
                    msg: err
                })
            }
        } else {
            res.json({
                code: 404,
                msg: "用户名或密码错误"
            })
        }
    }

    /**
     * 设置图像验证码
     * @param {*} req 
     * @param {*} res 
     */
    static async code(req, res) {
        var captcha = svgCaptcha.create({
            // 翻转颜色
            inverse: false,
            // 字体大小
            fontSize: 36,
            // 噪声线条数
            noise: 2,
            // 宽度
            width: 80,
            // 高度
            height: 30,
        });
        // 保存到session,忽略大小写
        req.session = captcha.text.toLowerCase();
        // //保存到cookie 方便前端调用验证
        res.cookie('captcha', req.session);
        // res.setHeader('Content-Type', 'image/svg+xml');
        res.json({
            code: 200,
            img: captcha.data,
            msg: req.session
        });
    }
    /**
     * 返回客户端公钥
     * @param {*req}
     * @param {*res}
     * @returns {*public_key} 返回 公钥
     */
    static async public_key(req, res) {
        res.json({
            code: 200,
            msg: global.public_key
        })
    }

    /**
     * 根据类型获取用户名单
     * @param {*type} req  用户类型 
     * @param {*} res 
     */
    static async list(req, res) {
        let params = req.body;

        // 检测参数是否存在为空
        let errors = [];
        for (let item in params) {
            if (params[item] === undefined) {
                let index = errors.length + 1;
                errors.push("错误" + index + ": 参数: " + item + "不能为空")
            }
        }

        if (errors.length > 0) {
            res.status = 412;
            res.json({
                code: 412,
                msg: errors
            })
            return false;
        }
        const userList = await UserModel.findAllUserList(params.type);

        if (userList) {
            try {
                res.json({
                    code: 200,
                    data: userList
                })
            } catch (err) {
                res.json({
                    code: 500,
                    msg: err
                })
            }
        }

    }

    static uploadImg(req, res, next) {
        res.json({
            code: 200,
            data: {
                img: "http://zq.img.com/" + req.file.filename
            }
        })
    }
}

module.exports = User

/***/ }),

/***/ "./server/models/answerModel.js":
/*!**************************************!*\
  !*** ./server/models/answerModel.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const db = __webpack_require__(/*! ../config/sequelize.config */ "./server/config/sequelize.config.js")
const Sequelize = db.sequelize;
const answer = Sequelize.import('../schema/answer.js')

answer.sync({ force: false });

class AnswerModel {
    static async answerList(res) {
        let { user_id, exam_id, content } = res;
        return answer.findAll({
            where: {
                
                examid: exam_id,
                id: content,
                or:[
                    {
                        userid:content
                    },
                    {
                        userid:user_id
                    }
                ]
            }
        })

    }
}

module.exports = AnswerModel


/***/ }),

/***/ "./server/models/examModel.js":
/*!************************************!*\
  !*** ./server/models/examModel.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const db = __webpack_require__(/*! ../config/sequelize.config */ "./server/config/sequelize.config.js")
const Sequelize = db.sequelize;
const Exam = Sequelize.import('../schema/exam.js')
const Op = Sequelize.Op;

Exam.sync({ force: false });

class ExamModel {
    /**
     *创建问卷
     * @param title
     * @returns {Promise<boolean>}
     */
    static async createExam(exam) {
        let { title, user_id, explain, testtime, status, sort, designated } = exam;
        let sql = await Exam.create({
            title,
            user_id,
            explain,
            testtime,
            status,
            sort,
            designated
        })
        return sql
    }
    static async alterExam(exam) {
        let { title, user_id, explain, testtime, status, sort, designated, exam_id } = exam;
        let examCreate = await Exam.update({
            title,
            user_id,
            explain,
            testtime,
            status,
            sort,
            designated,
        }, {
                where: {
                    id: exam_id
                }
            })
        return true
    }


    /**
     * @param user_id
     * @param status
     * @returns 
     * 筛选问卷列表
     */
    static async getlist(exam) {
        let { user_id, status, title, page, pagecount } = exam;
        return await Exam.findAll(
            {
                where: {
                    userid: user_id,
                    status: status==-1?{[Op.lte]:2}:status,
                    [Op.or]:{
                        title: {
                            [Op.like]: "%" + title + "%"
                        },
                        id: {
                            [Op.like]: "%" + title + "%"
                        }
                    }
                    
                },
                offset: (Number(pagecount) - 1) * page,
                limit: Number(page),
                order: [
                    ['id', 'DESC']
                ],
            },
        )
    }

    static async findExam(exam) {
        let { exam_id } = exam;
        let sql = await Exam.findAll({
            where: {
                id: exam_id
            }
        })
        return sql
    }

    static async deleteExam(exam_id) {
        await Exam.destroy({
            where: {
                id: exam_id
            }
        })
        return true
    }

    static async changeStatus(exam) {
        let { user_id, exam_id, status } = exam;
        let sql = await Exam.update({
            status
        }, {
                where: {
                    userid: user_id,
                    id: exam_id
                }
            })
        return sql;
    }
}

module.exports = ExamModel


/***/ }),

/***/ "./server/models/optionModel.js":
/*!**************************************!*\
  !*** ./server/models/optionModel.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const db = __webpack_require__(/*! ../config/sequelize.config */ "./server/config/sequelize.config.js")
const Sequelize = db.sequelize;
const Option = Sequelize.import('../schema/option.js')

Option.sync({force: false});

class OptionModel {
    /**
     *创建选项
     * @param title
     * @returns {Promise<boolean>}
     */
    static async createOption(exam) {
        let { question_id,exam_id, text, answer, sort, img, introduce } = exam;
        let sql = await Option.create({
            question_id,exam_id, text, answer, sort, img, introduce: introduce.editorTxt, isUrl: Number(introduce.isUrl)
        })
        return sql;
    }

    /**
     * 修改选项
     */
    static async alterOption(exam) {
        let { option_id, question_id,exam_id, text, answer, sort, img, introduce } = exam;
        await Option.update({
            text, answer:String(answer), sort, img, introduce: introduce.editorTxt, isUrl: Number(introduce.isUrl)
        }, {
                where: {
                    question_id:question_id,
                    id: option_id,
                    exam_id:exam_id
                }
            })
        return true;
    }

    /**
     * 获取选项
     */
    static async findAllOption(exam) {
        let { id } = exam;
        let sql = await Option.findAll({
            where: {
                question_id: id
            }
        })
        return sql;
    }
    /**
     * @return {option_id}
     * 删除选项
     */
    static async deleteOption(res) {
        let { option_id } = res;
        await Option.destroy({
            where: {
                id: option_id
            }
        })
        return true;
    }
    /**
     * 根据question_id 删除所有选项
     * @param {*} question_id 
     */
    static async deleteOptionByQuesid(question_id) {
        await Option.destroy({
            where: {
                question_id: question_id
            }
        })
        return true;
    }
    /**
     * 根据exam_id 删除所有选项
     * @param {*} 根据exam_id 
     */
    static async deleteOptionByExamid(exam_id) {
        await Option.destroy({
            where: {
                exam_id: exam_id
            }
        })
        return true;
    }
}

module.exports = OptionModel
    

/***/ }),

/***/ "./server/models/quesModel.js":
/*!************************************!*\
  !*** ./server/models/quesModel.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const db = __webpack_require__(/*! ../config/sequelize.config */ "./server/config/sequelize.config.js")
const Sequelize = db.sequelize;
const Ques = Sequelize.import('../schema/question.js')

Ques.sync({ force: false });

class QuesModel {
    /**
     *创建题目
     * @param title
     * @returns {Promise<boolean>}
     */
    static async createQues(exam) {
        let { problem, analysis, note, sort, score, questionType, exam_id, answer } = exam;
        let sql = await Ques.create({
            problem, analysis, note, score, sort, questionType, exam_id, answer
        })
        return sql;
    }

    static async alterQues(exam) {
        let { problem, analysis, note, sort, score, questionType, exam_id, answer, question_id } = exam;
        await Ques.update({
            problem, analysis, note, score, sort, questionType, exam_id, answer
        }, {
                where: {
                    id: question_id
                }
            })
        return true;
    }

    static async selectQues(exam_id) {
        let sql = await Ques.findAll({
            where: {
                exam_id: exam_id
            },
            order: [
                ["sort", 'ASC']
            ]
        })
        return sql
    }
    static async delQues(exam) {
        let { id } = exam;
        await Ques.destroy({
            where: {
                id: id
            }
        })

        return true
    }
    static async delQuesByExamid(exam_id) {
        await Ques.destroy({
            where: {
                exam_id: exam_id
            }
        })
        return true
    }
}

module.exports = QuesModel


/***/ }),

/***/ "./server/models/userModel.js":
/*!************************************!*\
  !*** ./server/models/userModel.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const db = __webpack_require__(/*! ../config/sequelize.config */ "./server/config/sequelize.config.js")
const Sequelize = db.sequelize;
const User = Sequelize.import('../schema/user.js')

User.sync({force: false});

class UserModel {
    /**
     * 创建用户
     * @param user
     * @returns {Promise<boolean>}
     */
    static async create(user) {
        let {Nickname, Password,/* email, Usertoken*/} = user;

        return await User.create({
            Nickname,
            Password,
            // email,
            // Usertoken,
        })
        return true
    }

    /**
     * 删除用户
     * @param id listID
     * @returns {Promise.<boolean>}
     */
    static async delete(id) {
        await User.destroy({
            where: {
                id,
            }
        })
        return true
    }

    /**
     * 查询用户列表
     * @returns {Promise<*>}
     */
    static async findAllUserList(type) {
        if(!Number(type)){
            return await User.findAll({
                attributes: ['id', 'Nickname'],
            })
        }else{
            return await User.findAll({
                attributes: ['id', 'Nickname'],
                where:{
                    type:type
                }
            })
        }
        
    }


    /**
     * 查询用户信息
     * @param Nickname  姓名
     * @returns {Promise.<*>}
     */
    static async Nickname(Nickname) {
        return await User.findOne({
            where: {
                Nickname
            }
        })
    }
    /**
     * 查询用户信息
     * @param Nickname  姓名
     * @param Password  密码
     * @returns {Promise.<*>}
     */
    static async Password(Nickname,Password) {
        return await User.findOne({
            where: {
                Nickname,Password
            }
        })
    }

}

module.exports = UserModel


/***/ }),

/***/ "./server/models/userexamModel.js":
/*!****************************************!*\
  !*** ./server/models/userexamModel.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const db = __webpack_require__(/*! ../config/sequelize.config */ "./server/config/sequelize.config.js")
const Sequelize = db.sequelize;
const userExam = Sequelize.import('../schema/user_exam.js')
const Op=Sequelize.Op;
userExam.sync({ force: false });

class userexamModel {
    static async create(res) {
        let { user_id, exam_id, status } = res;
        return userExam.create({
            user_id, exam_id, status
        })
    }

    static async getExam(res) {
        let {status ,userid}=res;
        return userExam.findAll({
            where: {
                userid: userid,
                status:status==-1?'>0':status
            }
        })
    }

    static async getUser(res) {
        return userExam.findAll({
            where: {
                examid: examid
            }
        })
    }
}

module.exports = userexamModel


/***/ }),

/***/ "./server/routes.js":
/*!**************************!*\
  !*** ./server/routes.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(/*! express */ "express");
const User = __webpack_require__(/*! ./controllers/user */ "./server/controllers/user.js")
const Exam = __webpack_require__(/*! ./controllers/exam */ "./server/controllers/exam.js")
const Answer = __webpack_require__(/*! ./controllers/answer */ "./server/controllers/answer.js")
const Ques = __webpack_require__(/*! ./controllers/question */ "./server/controllers/question.js")
const Option = __webpack_require__(/*! ./controllers/option */ "./server/controllers/option.js")
const upload=__webpack_require__(/*! ./controllers/upload */ "./server/controllers/upload.js")
// const UploadToken = require('../controllers/UploadToken')
const Routers = express.Router();

//  用户注册
Routers.post('/register', User.create);
//  用户登录
Routers.post('/login', User.login);
//  获取用户名单
Routers.post('/users', User.list);
//  获取图形码
Routers.get('/captcha', User.code);
//  获取公钥
Routers.get('/publicKey', User.public_key);

//  提交图片
Routers.post("/Uploadpic",upload.single("img"),User.uploadImg);


// 问卷接口
Routers.post("/ExamTitle",Exam.create)
Routers.post("/questions",Ques.create)
Routers.patch("/questions",Ques.patchQues)      
Routers.get("/questionnaireList",Exam.getlist)
Routers.get("/questions",  Ques.getQuestions)
Routers.delete("/questions",Ques.deletequestion);
Routers.delete("/option",Option.deleteOption)
Routers.patch("/Exam",Exam.patchExam)
Routers.delete("/Exam",Exam.deleteExam)

//答卷接口
Routers.get("/answerList",Answer.answerList)


/**
 * 上传token
 */
// Routers.get('/upload/token', UploadToken.token)

module.exports = Routers


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "redis":
/*!************************!*\
  !*** external "redis" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("redis");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sequelize");

/***/ }),

/***/ "svg-captcha":
/*!******************************!*\
  !*** external "svg-captcha" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("svg-captcha");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-dev-middleware");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvY29uZmlnL2RhdGFic2UuY29uZmlnLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9jb25maWcvc2VxdWVsaXplLmNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvY29uZmlnL3Rva2VuLmNvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvY29udHJvbGxlcnMvYW5zd2VyLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9jb250cm9sbGVycy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL2NvbnRyb2xsZXJzL2V4YW0uanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL2NvbnRyb2xsZXJzL29wdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvY29udHJvbGxlcnMvcXVlc3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL2NvbnRyb2xsZXJzL3VwbG9hZC5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvY29udHJvbGxlcnMvdXNlci5qcyIsIndlYnBhY2s6Ly8vLi9zZXJ2ZXIvbW9kZWxzL2Fuc3dlck1vZGVsLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9tb2RlbHMvZXhhbU1vZGVsLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9tb2RlbHMvb3B0aW9uTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL21vZGVscy9xdWVzTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL21vZGVscy91c2VyTW9kZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL21vZGVscy91c2VyZXhhbU1vZGVsLmpzIiwid2VicGFjazovLy8uL3NlcnZlci9yb3V0ZXMuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiYm9keS1wYXJzZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjb29raWUtcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY3J5cHRvXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwianNvbndlYnRva2VuXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwibXVsdGVyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicGF0aFwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlZGlzXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic2VxdWVsaXplXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwic3ZnLWNhcHRjaGFcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ3ZWJwYWNrLWRldi1taWRkbGV3YXJlXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxt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QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FDakNBLGdCQUFnQixtQkFBTyxDQUFDLHdCQUFTO0FBQ2pDLGFBQWEsbUJBQU8sQ0FBQyx3REFBb0I7QUFDekMsYUFBYSxtQkFBTyxDQUFDLHdEQUFvQjtBQUN6QyxlQUFlLG1CQUFPLENBQUMsNERBQXNCO0FBQzdDLGFBQWEsbUJBQU8sQ0FBQyxnRUFBd0I7QUFDN0MsZUFBZSxtQkFBTyxDQUFDLDREQUFzQjtBQUM3QyxhQUFhLG1CQUFPLENBQUMsNERBQXNCO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7OztBQzdDQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwrQjs7Ozs7Ozs7Ozs7QUNBQSx5Qzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxrQzs7Ozs7Ozs7Ozs7QUNBQSxzQzs7Ozs7Ozs7Ozs7QUNBQSx3Qzs7Ozs7Ozs7Ozs7QUNBQSxtRCIsImZpbGUiOiJTeXNTZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NlcnZlci9hcHAuanNcIik7XG4iLCIvKipcclxuICogbm9kZSDlkI7nq6/mnI3liqHlmahcclxuICogbm9kZeWQr+WKqOaWh+S7tlxyXG4gKi9cclxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5jb25zdCBwYXRoPXJlcXVpcmUoXCJwYXRoXCIpXHJcbmNvbnN0IGJvZHlQYXJzZXIgPSByZXF1aXJlKCdib2R5LXBhcnNlcicpO1xyXG5jb25zdCBjb29raWVQYXJhc2UgPSByZXF1aXJlKCdjb29raWUtcGFyc2VyJyk7XHJcbmNvbnN0IHJlZGlzID0gcmVxdWlyZSgncmVkaXMnKTtcclxuY29uc3QgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcclxuY29uc3Qgd2VicGFja0Rldk1pZGRsZXdhcmUgPSByZXF1aXJlKCd3ZWJwYWNrLWRldi1taWRkbGV3YXJlJyk7XHJcbmNvbnN0IFRva2VuID0gcmVxdWlyZSgnLi9jb25maWcvdG9rZW4uY29uZmlnLmpzJylcclxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5cclxuZ2xvYmFsLnB1YmxpY19rZXkgPSBmcy5yZWFkRmlsZVN5bmMoX19kaXJuYW1lK1wiL2tleS9wdWIua2V5XCIpLnRvU3RyaW5nKCk7XHJcbmdsb2JhbC5wcml2YXRlX2tleSA9IGZzLnJlYWRGaWxlU3luYyhfX2Rpcm5hbWUrXCIva2V5L3ByaS5rZXlcIikudG9TdHJpbmcoKTtcclxuYXBwLnVzZShjb29raWVQYXJhc2UoKSk7XHJcbmFwcC51c2UoYm9keVBhcnNlci5qc29uKCkpO1xyXG5cclxuY29uc3Qgcm91dGVzID0gcmVxdWlyZSgnLi9yb3V0ZXMnKTtcclxuXHJcbi8v5a+55o6l5Y+j6L+H5ruk5qOA6aqMdG9rZW5cclxuYXBwLmFsbChcIipcIiwgYXN5bmMgKHJlcSwgcmVzLCBuZXh0KSA9PiB7XHJcbiAgICByZXMuaGVhZGVyKFwiQWNjZXNzLUNvbnRyb2wtRXhwb3NlLUhlYWRlcnNcIiwgXCJBdXRob3JpemF0aW9uXCIpO1xyXG4gICAgcmVzLmhlYWRlcignQ2FjaGUtQ29udHJvbCcsICduby1zdG9yZScpO1xyXG5cclxuICAgIGlmIChyZXEucGF0aCAhPSBcIi9wdWJsaWNLZXlcIiAmJiByZXEucGF0aCAhPSBcIi9jYXB0Y2hhXCIgJiYgcmVxLnBhdGggIT0gJy9sb2dpbicgJiYgcmVxLnBhdGggIT0gXCIvcmVnaXN0ZXJcIikge1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgVG9rZW4uY2hlY2tUb2tlbihyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodG9rZW4uc3RhdHVzID09IDQwNCkge1xyXG4gICAgICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDQwMSxcclxuICAgICAgICAgICAgICAgICAgICBtc2c6IFwidG9rZW7lt7Lov4fmnJ/vvIzor7fph43mlrDnmbvlvZVcIlxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi5zdGF0dXMgPT0gMjAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLmhlYWRlcihcIkF1dGhvcml6YXRpb25cIiwgdG9rZW4uYWNjZXNzX3Rva2VuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5leHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXHJcbiAgICAgICAgICAgICAgICBtc2c6IGVyclxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV4dCgpXHJcbiAgICB9XHJcbn0pXHJcblxyXG5hcHAudXNlKCcvJywgcm91dGVzKTsgIC8vIOWQjuerr2Fwaei3r+eUsVxyXG5cclxuLy/ov57mjqVyZWRpc+aVsOaNruW6k1xyXG5cclxuZ2xvYmFsLmNsaWVudCA9IHJlZGlzLmNyZWF0ZUNsaWVudCg2Mzc5LCAnMTI3LjAuMC4xJyk7XHJcblxyXG5nbG9iYWwuY2xpZW50Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgIGNvbnNvbGUubG9nKCdyZWRpcyBFcnJvciAnICsgZXJyKTtcclxufSk7XHJcblxyXG5nbG9iYWwuY2xpZW50Lm9uKFwiY29ubmVjdFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICBnbG9iYWwuY2xpZW50LnNldChcInByaXZhdGVfa2V5XCIsIGdsb2JhbC5wcml2YXRlX2tleSwgcmVkaXMucHJpbnQpO1xyXG4gICAgZ2xvYmFsLmNsaWVudC5zZXQoXCJwdWJsaWNfa2V5XCIsIGdsb2JhbC5wcml2YXRlX2tleSwgcmVkaXMucHJpbnQpO1xyXG59KTtcclxuXHJcbmdsb2JhbC5jbGllbnQub24oJ3JlYWR5JywgZnVuY3Rpb24gKHJlcywgcmVxKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInJlZGlzIHN1Y2Nlc3MuLi4uLlwiKVxyXG59KTtcclxuXHJcbi8vIOi/nuaOpeaVsOaNruW6k1xyXG4vLyBnbG9iYWwuY29ubiA9IG15c3FsLmNyZWF0ZUNvbm5lY3Rpb24obW9kZWxzLm15c3FsKTtcclxuLy8gZ2xvYmFsLmNvbm4uY29ubmVjdCgpO1xyXG5cclxuLy8g55uR5ZCs56uv5Y+jXHJcbmFwcC5saXN0ZW4oMzAwMCwgJ2xvY2FsaG9zdCcsIGZ1bmN0aW9uIChlcnIsIHJlcykge1xyXG4gICAgaWYgKGVycikgY29uc29sZS5sb2coZXJyKVxyXG4gICAgY29uc29sZS5sb2coJ3N1Y2Nlc3MgbGlzdGVuIGF0IHBvcnQ6MzAwMC4uLi4uLicpXHJcbn0pXHJcblxyXG4iLCIvKuaVsOaNruW6k+mFjee9ruaWh+S7tiovXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgLy8g5omT5byA5ZOq5Liq5pWw5o2u5bqTXHJcbiAgICBteXNxbDp7XHJcbiAgICAgICAgaG9zdDogJzk1LjE2OS4yMC41MycsLy85NS4xNjkuMjAuNTNcclxuICAgICAgICB1c2VyOiAncm9vdCcsXHJcbiAgICAgICAgcGFzc3dvcmQ6ICdacUA1NzQ4MzknLCAgLy9acUA1NzQ4MzlcclxuICAgICAgICBkYXRhYmFzZTogJ3pxcScsXHJcbiAgICAgICAgcG9ydDogJzMzMDYnLFxyXG4gICAgICAgIC8vIOaVsOaNruihqOebuOWFs+eahOWFqOWxgOmFjee9rlxyXG4gICAgICAgIC8vIGRlZmluZToge1xyXG4gICAgICAgIC8vICAgICAvLyDmmK/lkKblhrvnu5PooajlkI1cclxuICAgICAgICAvLyAgICAgLy8g6buY6K6k5oOF5Ya15LiL77yM6KGo5ZCN5Lya6L2s5o2i5Li65aSN5pWw5b2i5byPXHJcbiAgICAgICAgLy8gICAgIGZyZWV6ZVRhYmxlTmFtZTogdHJ1ZSxcclxuICAgICAgICAvLyAgICAgLy8g5piv5ZCm5Li66KGo5re75YqgIGNyZWF0ZWRBdCDlkowgdXBkYXRlZEF0IOWtl+autVxyXG4gICAgICAgIC8vICAgICAvLyBjcmVhdGVkQXQg6K6w5b2V6KGo55qE5Yib5bu65pe26Ze0XHJcbiAgICAgICAgLy8gICAgIC8vIHVwZGF0ZWRBdCDorrDlvZXlrZfmrrXmm7TmlrDml7bpl7RcclxuICAgICAgICAvLyAgICAgdGltZXN0YW1wczogdHJ1ZSxcclxuICAgICAgICAvLyAgICAgLy8g5piv5ZCm5Li66KGo5re75YqgIGRlbGV0ZWRBdCDlrZfmrrVcclxuICAgICAgICAvLyAgICAgLy8g6buY6K6k5oOF5Ya15LiLLCBkZXN0cm95KCkg5pa55rOV5Lya5Yig6Zmk5pWw5o2u77yMXHJcbiAgICAgICAgLy8gICAgIC8vIOiuvue9riBwYXJhbm9pZCDkuLogdHJ1ZSDml7bvvIzlsIbkvJrmm7TmlrAgZGVsZXRlZEF0IOWtl+aute+8jOW5tuS4jeS8muecn+WunuWIoOmZpOaVsOaNruOAglxyXG4gICAgICAgIC8vICAgICBwYXJhbm9pZDogZmFsc2VcclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcbn1cclxuICAgICIsIi8q5a6e5L6L5YyWc2VxdWVsaXplKi9cclxuY29uc3QgU2VxdWVsaXplID0gcmVxdWlyZSgnc2VxdWVsaXplJylcclxuY29uc3QgbW9kZWxzID0gcmVxdWlyZSgnLi4vY29uZmlnL2RhdGFic2UuY29uZmlnJylcclxuXHJcbi8vIOWunuS+i+WMlu+8jOW5tuaMh+WumumFjee9rlxyXG4vL+WunuS+i+WMlnNlcXVlbGl6ZVxyXG52YXIgc2VxdWVsaXplID0gbmV3IFNlcXVlbGl6ZShtb2RlbHMubXlzcWwuZGF0YWJhc2UsIG1vZGVscy5teXNxbC51c2VyLCBtb2RlbHMubXlzcWwucGFzc3dvcmQsIHtcclxuICAgIGhvc3Q6IG1vZGVscy5teXNxbC5ob3N0LFxyXG4gICAgZGlhbGVjdDogJ215c3FsJyxcclxuICAgIG9wZXJhdG9yc0FsaWFzZXM6IGZhbHNlLFxyXG4gICAgZGlhbGVjdE9wdGlvbnM6IHtcclxuICAgICAgICBjaGFyc2V0OiBcInV0ZjhtYjRcIixcclxuICAgICAgICAvLyBjb2xsYXRlOiBcInV0ZjhtYjRfdW5pY29kZV9jaVwiLFxyXG4gICAgICAgIHN1cHBvcnRCaWdOdW1iZXJzOiB0cnVlLFxyXG4gICAgICAgIGJpZ051bWJlclN0cmluZ3M6IHRydWVcclxuICAgIH0sXHJcblxyXG4gICAgcG9vbDoge1xyXG4gICAgICAgIG1heDogNSxcclxuICAgICAgICBtaW46IDAsXHJcbiAgICAgICAgYWNxdWlyZTogMzAwMDAsXHJcbiAgICAgICAgaWRsZTogMTAwMDBcclxuICAgIH0sXHJcbiAgICB0aW1lem9uZTogJyswODowMCcgLy/kuJzlhavml7bljLpcclxufSlcclxuXHJcbi8vIOa1i+ivlei/nuaOpVxyXG5zZXF1ZWxpemUuYXV0aGVudGljYXRlKClcclxuICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBoYXMgYmVlbiBlc3RhYmxpc2hlZCBzdWNjZXNzZnVsbHkuJylcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdVbmFibGUgdG8gY29ubmVjdCB0byB0aGUgZGF0YWJhc2U6JywgZXJyKVxyXG4gICAgfSlcclxuXHJcbm1vZHVsZS5leHBvcnRzPXtcclxuICAgIHNlcXVlbGl6ZVxyXG59IiwiY29uc3Qgand0PXJlcXVpcmUoXCJqc29ud2VidG9rZW5cIilcclxuXHJcbi8qKlxyXG4gKiDorr7nva7moKHpqox0b2tlblxyXG4gKi9cclxuY2xhc3MgVG9rZW57XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0geyprZXl9IGtleSBcclxuICAgICAqIEBwYXJhbXMgeyp2YWx1ZX0gdmFsdWVcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJlZGlzU2V0KGtleSx2YWwpe1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSxyZWplY3QpPT57XHJcbiAgICAgICAgICAgIGdsb2JhbC5jbGllbnQuc2V0KE51bWJlcihrZXkpLHZhbCwoZXJyLHJlcyk9PntcclxuICAgICAgICAgICAgICAgIGlmKGVycikgcmVqZWN0KGVycilcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHtrZXl9IGtleSBcclxuICAgICAqIEByZXR1cm5zIHsqdmFsdWV9IHZhbHVlIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmVkaXNHZXQoa2V5KXtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUscmVqZWN0KT0+e1xyXG4gICAgICAgICAgICBnbG9iYWwuY2xpZW50LmdldChOdW1iZXIoa2V5KSwoZXJyLHJlcyk9PntcclxuICAgICAgICAgICAgICAgIGlmKGVycikgcmVqZWN0KGVycilcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHsq55So5oi3aWR9IGlkIFxyXG4gICAgICogQHBhcmFtIHsqdG9rZW59IHRva2VuIFxyXG4gICAgICogQHJldHVybnMgeyp0b2tlbui/h+acnyzph43mlrDnmbvlvZV9ICBzdGF0dXMgNDA0XHJcbiAgICAgKiBAcmV0dXJucyB7KmFjY2Vzc190b2tlbui/h+acn++8jOiuvue9ruaWsOeahHRva2VufSBzdGF0dXMgMjAyXHJcbiAgICAgKiBAcmV0dXJucyB7KnRva2VuIOacqui/h+acn30gc3RhdHVzIDIwMFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgY2hlY2tUb2tlbih0b2tlbil7XHJcbiAgICAgICAgdHJ5e1xyXG4gICAgICAgICAgICBsZXQgbm93RGF0ZT1OdW1iZXIobmV3IERhdGUoKSk7XHJcbiAgICAgICAgICAgIC8v6I635Y+W5Yik5patYWNjZXNzX3Rva2VuICDliKTmlq3mmK/lkKbov4fmnJ9cclxuICAgICAgICAgICAgbGV0IGp3dF9hY2Nlc3NfdG9rZW49YXdhaXQgand0LnZlcmlmeSh0b2tlbixnbG9iYWwucHJpdmF0ZV9rZXkpO1xyXG4gICAgICAgICAgICBsZXQgaWQ9and0X2FjY2Vzc190b2tlbi5zdWI7XHJcbiAgICAgICAgICAgIGlmKGp3dF9hY2Nlc3NfdG9rZW4uZXhwPG5vd0RhdGUpe1xyXG4gICAgICAgICAgICAgICAgLy/ojrflj5bop6PmnpByZWZyZXNoX3Rva2VuIOWIpOaWreacieaViOaXtumXtFxyXG4gICAgICAgICAgICAgICAgbGV0IG9sZF9yZWZyZXNoX3Rva2VuPWF3YWl0IFRva2VuLnJlZGlzR2V0KHRva2VuKTtcclxuICAgICAgICAgICAgICAgIGxldCBqd3Rfb2xkX3JlZnJlc2hfdG9rZW49YXdhaXQgand0LnZlcmlmeShvbGRfcmVmcmVzaF90b2tlbixnbG9iYWwucHJpdmF0ZV9rZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYoand0X29sZF9yZWZyZXNoX3Rva2VuLmV4cDxub3dEYXRlKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6NDA0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IG5ld19mcmVzaF90b2tlbj1hd2FpdCBUb2tlbi5zZXRUb2tlbihpZCwxKjI0KjYwKjYwKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3X2FjY2Vzc190b2tlbj1hd2FpdCBUb2tlbi5zZXRUb2tlbihpZCw2MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgVG9rZW4ucmVkaXNTZXQobmV3X2ZyZXNoX3Rva2VuLG5ld19mcmVzaF90b2tlbik7IC8v6K6+572u5paw55qEcmVmcmVzaF90b2tlbiDmlL7lhaVyZWRpc1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czoyMDIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbiA6IG5ld19hY2Nlc3NfdG9rZW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZCA6IGlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtc2cgOiBcIuabtOaWsHRva2VuXCJcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6MjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIHVpZCA6IGlkLFxyXG4gICAgICAgICAgICAgICAgICAgIG1zZzpcInRva2Vu5pyJ5pWI5LitXCJcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfWNhdGNoKGVycil7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6NDA0LFxyXG4gICAgICAgICAgICAgICAgbXNnOmVyclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgIC8qKlxyXG4gICAgICAqIOiuvue9rnRva2VuXHJcbiAgICAgKiBAcGFyYW0gdXNlcmlkIOeUqOaIt2lkXHJcbiAgICAgKiBAcGFyYW0gb3ZlcnRpbWUgIOacieaViOaXtumXtFxyXG4gICAgICogQHBhcmFtIG5hbWUg55So5oi35ZCNXHJcbiAgICAgKiBAcmV0dXJucyB0b2tlbiBcclxuICAgICAqICovXHJcbiAgICBzdGF0aWMgc2V0VG9rZW4odXNlcmlkLCBvdmVydGltZSkge1xyXG4gICAgICAgIHZhciBwbGF5bG9hZCA9IHtcclxuICAgICAgICAgICAgICAgIGlzczogJzE2NzA2NDQzMzlAcXEuY29tJywgICAvLyBKV1TnmoTnrb7lj5HogIVcclxuICAgICAgICAgICAgICAgIHN1YjogdXNlcmlkLCAgICAvLyBKV1TmiYDpnaLlkJHnmoTnlKjmiLdcclxuICAgICAgICAgICAgICAgIGV4cDpuZXcgRGF0ZSgpLmdldFRpbWUoKStvdmVydGltZSoxMDAwLFxyXG4gICAgICAgICAgICAgICAgYXVkOiBcIjE2NzA2NDQzMzlAcXEuY29tXCIsICAvL+aOpeaUtkpXVOeahOS4gOaWuVxyXG4gICAgICAgICAgICAgICAgaWF0OiBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgIC8vIOivpUpXVOetvuWPkeeahOaXtumXtFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIHZhciB0b2tlbiA9IGp3dC5zaWduKHBsYXlsb2FkLGdsb2JhbC5wcml2YXRlX2tleSk7XHJcbiAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHM9VG9rZW4iLCJjb25zdCBhbnN3ZXJNb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9hbnN3ZXJNb2RlbCcpO1xyXG5jb25zdCBxdWVzTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvcXVlc01vZGVsJyk7XHJcbmNvbnN0IG9wdGlvbk1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL29wdGlvbk1vZGVsJyk7XHJcbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XHJcbmNvbnN0IFRva2VuID0gcmVxdWlyZShcIi4uL2NvbmZpZy90b2tlbi5jb25maWdcIilcclxuXHJcbmNsYXNzIEFuc3dlciB7XHJcbiAgICBzdGF0aWMgYXN5bmMgYW5zd2VyTGlzdChyZXEsIHJlcykge1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICAgICAgbGV0IHRva2VuID0gYXdhaXQgVG9rZW4uY2hlY2tUb2tlbihyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uKTtcclxuICAgICAgICBwYXJhbXMudXNlcl9pZCA9IHRva2VuLnVpZDtcclxuICAgICAgICBsZXQgZXJyb3JzID0gYXdhaXQgY29tbW9uLmNoZWNrRGF0YShwYXJhbXMpO1xyXG4gICAgICAgIGlmICghZXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuc3dlckxpc3Q9YXdhaXQgYW5zd2VyTW9kZWwuYW5zd2VyTGlzdChwYXJhbXMpO1xyXG4gICAgICAgICAgICBpZihhbnN3ZXJMaXN0KXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMgPSA0MTI7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IDUwMCxcclxuICAgICAgICAgICAgICAgIG1zZzogZXJyXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQW5zd2VyICIsImNsYXNzIENvbW1vbntcclxuICAgIC8qKlxyXG4gICAgICog5qOA5rWL5Y+C5pWw5piv5ZCm5a2Y5Zyo5Li656m6XHJcbiAgICAgKiBAcGFyYW0geyp9IHJlcSBcclxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgY2hlY2tEYXRhKHBhcmFtcyxyZXMpe1xyXG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpdGVtIGluIHBhcmFtcykge1xyXG4gICAgICAgICAgICBpZiAocGFyYW1zW2l0ZW1dID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGVycm9ycy5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCLplJnor69cIiArIGluZGV4ICsgXCI6IOWPguaVsDogXCIgKyBpdGVtICsgXCLkuI3og73kuLrnqbpcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMgPSA0MTI7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQxMixcclxuICAgICAgICAgICAgICAgIG1zZzogZXJyb3JzXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1vbiIsImNvbnN0IGV4YW1Nb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9leGFtTW9kZWwnKTtcclxuY29uc3QgcXVlc01vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL3F1ZXNNb2RlbCcpO1xyXG5jb25zdCBvcHRpb25Nb2RlbCA9IHJlcXVpcmUoJy4uL21vZGVscy9vcHRpb25Nb2RlbCcpO1xyXG5jb25zdCB1c2VyRXhhbT1yZXF1aXJlKFwiLi4vbW9kZWxzL3VzZXJleGFtTW9kZWxcIilcclxuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcclxuY29uc3QgVG9rZW4gPSByZXF1aXJlKFwiLi4vY29uZmlnL3Rva2VuLmNvbmZpZ1wiKVxyXG5cclxuY2xhc3MgRXhhbSB7XHJcbiAgICAvKipcclxuICAgICAqIOWIm+W7uueUqOaIt1xyXG4gICAgICogQHBhcmFtICAgdGl0bGUgICAgIOivleWNt+agh+mimFxyXG4gICAgICogQHBhcmFtICAgc3RhdHVzICAgIOivleWNt+eKtuaAgSDvvIjmmK/lkKblj5HluIPvvIlcclxuICAgICAqIEBwYXJhbSAgIGV4cGxhaW4gICDor5Xljbfor7TmmI5cclxuICAgICAqIEBwYXJhbSAgIHRlc3R0aW1lICDogIPor5XpmZDliLbml7bpl7RcclxuICAgICAqIEByZXR1cm5zIOWIm+W7uuaIkOWKn+i/lOWbnueUqOaIt+S/oeaBr++8jOWksei0pei/lOWbnumUmeivr+S/oeaBr1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgY3JlYXRlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgbGV0IHBhcmFtcyA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGxldCB0b2tlbiA9IGF3YWl0IFRva2VuLmNoZWNrVG9rZW4ocmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbik7XHJcbiAgICAgICAgcGFyYW1zLnVzZXJfaWQgPSB0b2tlbi51aWQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGNoZWNrRGF0YSA9IGF3YWl0IGNvbW1vbi5jaGVja0RhdGEocGFyYW1zLCByZXMpOyAvLyDmo4DmtYvlj4LmlbDmmK/lkKblrZjlnKjkuLrnqbpcclxuICAgICAgICBpZiAoIWNoZWNrRGF0YSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vZXhhbV9pZD09MCAg5paw5Yib5bu655qE5paH5Lu2XHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuZXhhbV9pZCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGVFeGFtID0gYXdhaXQgZXhhbU1vZGVsLmNyZWF0ZUV4YW0ocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIGlmIChjcmVhdGVFeGFtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDIwMDtcclxuICAgICAgICAgICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGNyZWF0ZUV4YW0uaWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnOiBcIuaPkOS6pOaIkOWKn++8gVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFsdGVyRXhhbSA9IGF3YWl0IGV4YW1Nb2RlbC5hbHRlckV4YW0ocGFyYW1zKTtcclxuICAgICAgICAgICAgICAgIGlmIChhbHRlckV4YW0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcGFyYW1zLmV4YW1faWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbXNnOiBcIuS/ruaUueaIkOWKn1wiXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzID0gNDEyO1xyXG4gICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MTIsXHJcbiAgICAgICAgICAgICAgICBtc2c6IGVyclxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiOt+WPlumXruWNt+WIl+ihqCAgXHJcbiAgICAgKiBAcGFyYW0geyp9IHJlcSBcclxuICAgICAqIEBwYXJhbSB7Kn0gcmVzIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0bGlzdChyZXEsIHJlcykge1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSByZXEucXVlcnk7XHJcbiAgICAgICAgbGV0IHRva2VuID0gYXdhaXQgVG9rZW4uY2hlY2tUb2tlbihyZXEuaGVhZGVycy5hdXRob3JpemF0aW9uKTtcclxuICAgICAgICBwYXJhbXMudXNlcl9pZCA9IHRva2VuLnVpZDtcclxuXHJcbiAgICAgICAgbGV0IGNoZWNrZGF0YSA9IGF3YWl0IGNvbW1vbi5jaGVja0RhdGEocGFyYW1zLCByZXMpO1xyXG4gICAgICAgIGlmICghY2hlY2tkYXRhKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXJzID0gYXdhaXQgZXhhbU1vZGVsLmdldGxpc3QocGFyYW1zKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzID0gMjAwO1xyXG4gICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcnM6IHVzZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFfdG90YWw6IFwiMlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHA6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2Vfcm93czogXCIxMFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VfdG90YWw6IDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9IGNhdGNoIChlcnJvcnMpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDQxMjtcclxuICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgY29kZTogNDEyLFxyXG4gICAgICAgICAgICAgICAgbXNnOiBlcnJvcnNcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5L+u5pS56ICD5Y2354q25oCBXHJcbiAgICAgKiBAcGFyYW0geypleGFtX2lkfSByZXEgXHJcbiAgICAgKiBAcGFyYW0geypzdGF0dXN9ICA9PTAg57uT5p2f5pys5qyh6ICD6K+VICAgPT0xIOWPkeW4g+acrOasoeiAg+ivlSAgPT0y5L2c5bqf5pys5qyh6ICD6K+VICA9PTPliKDpmaTmnKzmrKHor5XljbcgXHJcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIHBhdGNoRXhhbShyZXEsIHJlcykge1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgICAgICBsZXQgdG9rZW4gPSBhd2FpdCBUb2tlbi5jaGVja1Rva2VuKHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24pO1xyXG4gICAgICAgIHBhcmFtcy51c2VyX2lkID0gdG9rZW4udWlkO1xyXG5cclxuICAgICAgICBsZXQgY2hlY2tkYXRhID0gYXdhaXQgY29tbW9uLmNoZWNrRGF0YShwYXJhbXMsIHJlcyk7XHJcbiAgICAgICAgaWYgKCFjaGVja2RhdGEpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB0cnl7XHJcbiAgICAgICAgICAgIGF3YWl0IGV4YW1Nb2RlbC5jaGFuZ2VTdGF0dXMocGFyYW1zKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cz0yMDA7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIGNvZGU6MjAwLFxyXG4gICAgICAgICAgICAgICAgbXNnOlwi54q25oCB5L+u5pS55oiQ5YqfXCJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9Y2F0Y2goZXJyKXtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cz00MTI7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIGNvZGU6NTAwLFxyXG4gICAgICAgICAgICAgICAgbXNnOmVyclxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliKDpmaTor5XljbdcclxuICAgICAqIEBwYXJhbSB7c3RhdHVzPT0zfSByZXEgXHJcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZUV4YW0ocmVxLCByZXMpIHtcclxuICAgICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgICAgLy8g5qOA5rWL5Y+C5pWw5piv5ZCm5a2Y5Zyo5Li656m6XHJcbiAgICAgICAgbGV0IGNoZWNrZGF0YSA9IGF3YWl0IGNvbW1vbi5jaGVja0RhdGEocGFyYW1zLCByZXMpO1xyXG4gICAgICAgIGlmICghY2hlY2tkYXRhKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IG9wdGlvbk1vZGVsLmRlbGV0ZU9wdGlvbkJ5RXhhbWlkKHBhcmFtcy5leGFtX2lkKTtcclxuICAgICAgICAgICAgYXdhaXQgcXVlc01vZGVsLmRlbFF1ZXNCeUV4YW1pZChwYXJhbXMuZXhhbV9pZCk7XHJcbiAgICAgICAgICAgIGF3YWl0IGV4YW1Nb2RlbC5kZWxldGVFeGFtKHBhcmFtcy5leGFtX2lkKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDIwMDtcclxuICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICAgICAgbXNnOiBcIumXruWNt+WIoOmZpOaIkOWKn1wiXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMgPSA0MTI7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IDUwMCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IGVyclxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEV4YW0gIiwiY29uc3QgZXhhbU1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL2V4YW1Nb2RlbCcpO1xyXG5jb25zdCBxdWVzTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvcXVlc01vZGVsJyk7XHJcbmNvbnN0IG9wdGlvbk1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL29wdGlvbk1vZGVsJyk7XHJcbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4uL2NvbnRyb2xsZXJzL2NvbW1vbicpO1xyXG5jb25zdCBUb2tlbiA9IHJlcXVpcmUoXCIuLi9jb25maWcvdG9rZW4uY29uZmlnXCIpXHJcblxyXG5jbGFzcyBPcHRpb24ge1xyXG4gICAgLyoqXHJcbiAgICAqIOWIoOmZpOmAiemhuVxyXG4gICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGVPcHRpb24ocmVxLCByZXMpIHtcclxuICAgICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcbiAgICAgICAgLy8g5qOA5rWL5Y+C5pWw5piv5ZCm5a2Y5Zyo5Li656m6XHJcbiAgICAgICAgbGV0IGVycm9ycyA9YXdhaXQgY29tbW9uLmNoZWNrRGF0YShwYXJhbXMscmVzKTtcclxuICAgICAgICBpZighZXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbE9wdGlvbiA9IGF3YWl0IG9wdGlvbk1vZGVsLmRlbGV0ZU9wdGlvbihwYXJhbXMpO1xyXG4gICAgICAgICAgICBpZiAoZGVsT3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICBtc2c6IFwi6YCJ6aG55Yig6Zmk5oiQ5YqfXCJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDUwMDtcclxuICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgY29kZTogNTAwLFxyXG4gICAgICAgICAgICAgICAgbXNnOiBlcnJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uIiwiY29uc3QgZXhhbU1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL2V4YW1Nb2RlbCcpO1xyXG5jb25zdCBxdWVzTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvcXVlc01vZGVsJyk7XHJcbmNvbnN0IG9wdGlvbk1vZGVsID0gcmVxdWlyZSgnLi4vbW9kZWxzL29wdGlvbk1vZGVsJyk7XHJcbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4uL2NvbnRyb2xsZXJzL2NvbW1vbicpO1xyXG5jb25zdCBUb2tlbiA9IHJlcXVpcmUoXCIuLi9jb25maWcvdG9rZW4uY29uZmlnXCIpXHJcblxyXG5jbGFzcyBRdWVzIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNrnF1ZXN0aW9uX2lkIOWIoOmZpOafkOS4qumimOebrlxyXG4gICAgICogQHBhcmFtIHtpZH0gcmVxIFxyXG4gICAgICogQHBhcmFtIHsqfSByZXMgXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGVxdWVzdGlvbihyZXEsIHJlcykge1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTtcclxuICAgICAgICAvLyDmo4DmtYvlj4LmlbDmmK/lkKblrZjlnKjkuLrnqbpcclxuICAgICAgICBsZXQgZXJyb3JzID0gYXdhaXQgY29tbW9uLmNoZWNrRGF0YShwYXJhbXMsIHJlcyk7XHJcbiAgICAgICAgaWYgKCFlcnJvcnMpIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgb3B0aW9uTW9kZWwuZGVsZXRlT3B0aW9uQnlRdWVzaWQocGFyYW1zLmlkKTtcclxuICAgICAgICAgICAgYXdhaXQgcXVlc01vZGVsLmRlbFF1ZXMocGFyYW1zKTtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDIwMDtcclxuICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICAgICAgbXNnOiAn6aKY55uu5Yig6Zmk5oiQ5YqfJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzID0gNTAwO1xyXG4gICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBlcnJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu66aKY55uuIFxyXG4gICAgICogQHBhcmFtIHsqcXVlc3Rpb25faWR9IHJlcSAgcXVlc3Rpb25faWQ9PTAg5Yib5bu66aKY55uuXHJcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGNyZWF0ZShyZXEsIHJlcykge1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSByZXEuYm9keTtcclxuXHJcbiAgICAgICAgLy8g5qOA5rWL5Y+C5pWw5piv5ZCm5a2Y5Zyo5Li656m6XHJcbiAgICAgICAgbGV0IGVycm9ycyA9IGNvbW1vbi5jaGVja0RhdGEocGFyYW1zLCByZXMpO1xyXG4gICAgICAgIGlmICghZXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVF1ZXMgPSBhd2FpdCBxdWVzTW9kZWwuY3JlYXRlUXVlcyhwYXJhbXMpO1xyXG4gICAgICAgICAgICBpZiAoY3JlYXRlUXVlcykge1xyXG4gICAgICAgICAgICAgICAgLy9xdWVzdGlvblR5cGUgIOWIpOaWremimOebruexu+WeiyAg6Z2e566A562U6aKY5omN5pyJ6YCJ6aG5XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLnF1ZXN0aW9uVHlwZSAhPSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBwYXJhbXMub3B0aW9uZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbHNfb3B0aW9uID0gcGFyYW1zLm9wdGlvbmRhdGFbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxzX29wdGlvbi5leGFtX2lkID0gcGFyYW1zLmV4YW1faWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxzX29wdGlvbi5xdWVzdGlvbl9pZCA9IGNyZWF0ZVF1ZXMuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG9wdGlvbk1vZGVsLmNyZWF0ZU9wdGlvbihsc19vcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMgPSAyMDA7XHJcbiAgICAgICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG1zZzogXCLkuIrkvKDmiJDlip9cIlxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzID0gNDEyO1xyXG4gICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXHJcbiAgICAgICAgICAgICAgICBtc2c6IGVyclxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS/ruaUuemimOebrlxyXG4gICAgICogQHBhcmFtIHsqcXVlc3Rpb25faWR9IHF1ZXN0aW9uX2lkICE9MFxyXG4gICAgICogQHBhcmFtIHsqb3B0aW9uX2lkfSBvcHRpb25faWQgPT0w5Yib5bu66YCJ6aG5ICBvcHRpb25faWQgIT0w5L+u5pS56YCJ6aG5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBwYXRjaFF1ZXMocmVxLCByZXMpIHtcclxuICAgICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICAgIC8vIOajgOa1i+WPguaVsOaYr+WQpuWtmOWcqOS4uuepulxyXG4gICAgICAgIGxldCBlcnJvcnMgPSBjb21tb24uY2hlY2tEYXRhKHBhcmFtcywgcmVzKTtcclxuICAgICAgICBpZiAoIWVycm9ycykgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvL+S/ruaUuemXrumimCAgXHJcbiAgICAgICAgICAgIGNvbnN0IGFsdGVyUXVlcyA9IGF3YWl0IHF1ZXNNb2RlbC5hbHRlclF1ZXMocGFyYW1zKTtcclxuICAgICAgICAgICAgaWYgKHBhcmFtcy5xdWVzdGlvblR5cGUgIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy/kv67mlLnpgInpobkgICDlvZNvcHRpb25faWQ9PTDmmK/or6XpgInpobnkuLrmlrDlu7pcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgaW4gcGFyYW1zLm9wdGlvbmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMub3B0aW9uZGF0YVtpXS5xdWVzdGlvbl9pZCA9IHBhcmFtcy5xdWVzdGlvbl9pZDtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMub3B0aW9uZGF0YVtpXS5leGFtX2lkID0gcGFyYW1zLmV4YW1faWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5vcHRpb25kYXRhW2ldLm9wdGlvbl9pZCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjcmVhdGVPcHRpb24gPSBhd2FpdCBvcHRpb25Nb2RlbC5jcmVhdGVPcHRpb24ocGFyYW1zLm9wdGlvbmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWNyZWF0ZU9wdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDUwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXNnOiBcIumimOebruS4iuS8oOmUmeivr1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFsdGVyT3B0aW9uID0gYXdhaXQgb3B0aW9uTW9kZWwuYWx0ZXJPcHRpb24ocGFyYW1zLm9wdGlvbmRhdGFbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWFsdGVyT3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzID0gNTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IDUwMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtc2c6IFwi6aKY55uu5LiK5Lyg6ZSZ6K+vXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFsdGVyUXVlcykge1xyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDIwMDtcclxuICAgICAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlOiAyMDBcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDQxMjtcclxuICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgY29kZTogNTAwLFxyXG4gICAgICAgICAgICAgICAgbXNnOiBlcnJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICog5qC55o2uZXhhbV9pZCDojrflj5bor5Xljbflkozpopjnm65cclxuICAgKiBAcGFyYW0geyp9IHJlcSBcclxuICAgKiBAcGFyYW0geyp9IHJlcyBcclxuICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBnZXRRdWVzdGlvbnMocmVxLCByZXMpIHtcclxuICAgICAgICBsZXQgcGFyYW1zID0gcmVxLnF1ZXJ5O1xyXG4gICAgICAgIGxldCB0b2tlbiA9IGF3YWl0IFRva2VuLmNoZWNrVG9rZW4ocmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbik7XHJcbiAgICAgICAgcGFyYW1zLnVzZXJfaWQgPSB0b2tlbi51aWQ7XHJcbiAgICAgICAgLy8g5qOA5rWL5Y+C5pWw5piv5ZCm5a2Y5Zyo5Li656m6XHJcbiAgICAgICAgbGV0IGVycm9ycyA9IGF3YWl0IGNvbW1vbi5jaGVja0RhdGEocGFyYW1zLCByZXMpO1xyXG4gICAgICAgIGlmICghZXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0IHRpdGxlID0gYXdhaXQgZXhhbU1vZGVsLmZpbmRFeGFtKHBhcmFtcyk7XHJcbiAgICAgICAgY29uc3QgcXVlc3Rpb25zID0gYXdhaXQgcXVlc01vZGVsLnNlbGVjdFF1ZXMocGFyYW1zLmV4YW1faWQpO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodGl0bGUpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsc190aXRsZSA9IHRpdGxlWzBdLmRhdGFWYWx1ZXMsIGxzX3F1ZXN0aW9uID0gW10sIGxzX29wdGlvbiA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBxdWVzdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBsc19xdWVzdGlvbi5wdXNoKHF1ZXN0aW9uc1tpXS5kYXRhVmFsdWVzKTtcclxuICAgICAgICAgICAgICAgICAgICBsc19vcHRpb24gPSBhd2FpdCBvcHRpb25Nb2RlbC5maW5kQWxsT3B0aW9uKHF1ZXN0aW9uc1tpXS5kYXRhVmFsdWVzKTtcclxuICAgICAgICAgICAgICAgICAgICBsc19xdWVzdGlvbltpXS5vcHRpb25kYXRhID0gbHNfb3B0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIGxzX3F1ZXN0aW9uW2ldLnF1ZXN0aW9uX2lkID0gcXVlc3Rpb25zW2ldLmRhdGFWYWx1ZXMuaWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsc190aXRsZS5saXN0ID0gbHNfcXVlc3Rpb247XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBsc190aXRsZVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzID0gNTAwO1xyXG4gICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBlcnJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFF1ZXMiLCJjb25zdCBtdWx0ZXIgPSByZXF1aXJlKCdtdWx0ZXInKTtcclxuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XHJcblxyXG52YXIgY3JlYXRlRm9sZGVyID0gZnVuY3Rpb24gKGZvbGRlcikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBmcy5hY2Nlc3NTeW5jKGZvbGRlcik7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgZnMubWtkaXJTeW5jKGZvbGRlcik7XHJcbiAgICB9XHJcbn07XHJcbi8v6L+Z5Liq6Lev5b6E5Li65paH5Lu25LiK5Lyg55qE5paH5Lu25aS555qE6Lev5b6EXHJcbnZhciB1cGxvYWRGb2xkZXIgPSAnLi4vVXNlclBpYy8nO1xyXG5cclxuY3JlYXRlRm9sZGVyKHVwbG9hZEZvbGRlcik7XHJcblxyXG4vLyDpgJrov4cgZmlsZW5hbWUg5bGe5oCn5a6a5Yi2XHJcbnZhciBzdG9yYWdlID0gbXVsdGVyLmRpc2tTdG9yYWdlKHtcclxuICAgIGRlc3RpbmF0aW9uOiBmdW5jdGlvbiAocmVxLCBmaWxlLCBjYikge1xyXG4gICAgICAgIGNiKG51bGwsIHVwbG9hZEZvbGRlcik7ICAgIC8vIOS/neWtmOeahOi3r+W+hO+8jOWkh+azqO+8mumcgOimgeiHquW3seWIm+W7ulxyXG4gICAgfSxcclxuICAgIGZpbGVuYW1lOiBmdW5jdGlvbiAocmVxLCBmaWxlLCBjYikge1xyXG4gICAgICAgIHZhciBleHRuYW1lID0gcGF0aC5leHRuYW1lKGZpbGUub3JpZ2luYWxuYW1lKTsvL+iOt+WPluaWh+S7tuaJqeWxleWQjVxyXG4gICAgICAgIC8vIOWwhuS/neWtmOaWh+S7tuWQjeiuvue9ruS4uiDlrZfmrrXlkI0gKyDml7bpl7TmiLMr5paH5Lu25omp5bGV5ZCN77yM5q+U5aaCIGxvZ28tMTQ3ODUyMTQ2ODk0My5qcGdcclxuICAgICAgICBjYihudWxsLCBmaWxlLmZpZWxkbmFtZSArICctJyArIERhdGUubm93KCkgKyBleHRuYW1lKTtcclxuICAgIH1cclxufSk7XHJcblxyXG52YXIgdXBsb2FkSW1nID0gbXVsdGVyKHsgc3RvcmFnZTogc3RvcmFnZSB9KVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB1cGxvYWRJbWciLCJjb25zdCBVc2VyTW9kZWwgPSByZXF1aXJlKCcuLi9tb2RlbHMvdXNlck1vZGVsJyk7XHJcbmNvbnN0IHN2Z0NhcHRjaGEgPSByZXF1aXJlKCdzdmctY2FwdGNoYScpO1xyXG5jb25zdCBjcnlwdG8gPSByZXF1aXJlKFwiY3J5cHRvXCIpXHJcbmNvbnN0IFRva2VuID0gcmVxdWlyZSggXCIuLi9jb25maWcvdG9rZW4uY29uZmlnXCIpXHJcblxyXG5jbGFzcyBVc2VyIHtcclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu655So5oi3XHJcbiAgICAgKiBAcGFyYW0gICBOaWNrbmFtZSAgICAg55So5oi35ZCN5a2XXHJcbiAgICAgKiBAcGFyYW0gICBwYXNzd29yZCAgICAg55So5oi35a+G56CBXHJcbiAgICAgKiBAcGFyYW0gICBlbWFpbCAgICAgICAg55So5oi36YKu566xICDmmoLml7bmsqFcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyDliJvlu7rmiJDlip/ov5Tlm57nlKjmiLfkv6Hmga/vvIzlpLHotKXov5Tlm57plJnor6/kv6Hmga9cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGNyZWF0ZShyZXEsIHJlcykge1xyXG4gICAgICAgIGxldCBwYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIE5pY2tuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgICAgICBQYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXHJcbiAgICAgICAgICAgIC8vIGVtYWlsLFxyXG4gICAgICAgICAgICAvLyB1c2VydG9rZW5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOajgOa1i+WPguaVsOaYr+WQpuWtmOWcqOS4uuepulxyXG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpdGVtIGluIHBhcmFtcykge1xyXG4gICAgICAgICAgICBpZiAocGFyYW1zW2l0ZW1dID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGVycm9ycy5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCLplJnor69cIiArIGluZGV4ICsgXCI6IOWPguaVsDogXCIgKyBpdGVtICsgXCLkuI3og73kuLrnqbpcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMgPSA0MTI7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQxMixcclxuICAgICAgICAgICAgICAgIG1zZzogZXJyb3JzXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOafpeivoueUqOaIt+WQjeaYr+WQpumHjeWkjVxyXG4gICAgICAgIGNvbnN0IGV4aXN0VXNlciA9IGF3YWl0IFVzZXJNb2RlbC5OaWNrbmFtZShwYXJhbXMuTmlja25hbWUpO1xyXG5cclxuICAgICAgICBpZiAoZXhpc3RVc2VyKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMgPSA0MDM7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgICAgIG1zZzogXCLnlKjmiLflt7Lnu4/lrZjlnKhcIlxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgLy8g6Kej5a+G5a+G56CBXHJcbiAgICAgICAgICAgICAgICBwYXJhbXMuUGFzc3dvcmQgPSBjcnlwdG8ucHJpdmF0ZURlY3J5cHQoZ2xvYmFsLnByaXZhdGVfa2V5LCBCdWZmZXIuZnJvbShwYXJhbXMuUGFzc3dvcmQsICdiYXNlNjQnKSkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDliJvlu7rnlKjmiLdcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1VzZXIgPSBhd2FpdCBVc2VyTW9kZWwuY3JlYXRlKHBhcmFtcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g562+5Y+RdG9rZW5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFjY2Vzc190b2tlbiA9IFRva2VuLnNldFRva2VuKG5ld1VzZXIuaWQsIDEwICogNjAgKiA2MCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWZyZXNoX3Rva2VuID0gVG9rZW4uc2V0VG9rZW4obmV3VXNlci5pZCwgMTUgKiAyNCAqIDYwICogNjApO1xyXG4gICAgICAgICAgICAgICAgVG9rZW4ucmVkaXNTZXQoYWNjZXNzX3Rva2VuLCByZWZyZXNoX3Rva2VuKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgcmVzLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgICAgICAgICBtc2c6IGDliJvlu7rnlKjmiLfmiJDlip9gLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDUwMDtcclxuICAgICAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiBlcnJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnmbvlvZVcclxuICAgICAqICovXHJcbiAgICBzdGF0aWMgYXN5bmMgbG9naW4ocmVxLCByZXMpIHtcclxuICAgICAgICBsZXQgcGFyYW1zID0ge1xyXG4gICAgICAgICAgICBOaWNrbmFtZTogcmVxLmJvZHkubmFtZSxcclxuICAgICAgICAgICAgUGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxyXG4gICAgICAgICAgICAvLyBlbWFpbCxcclxuICAgICAgICAgICAgLy8gdXNlcnRva2VuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDmo4DmtYvlj4LmlbDmmK/lkKblrZjlnKjkuLrnqbpcclxuICAgICAgICBsZXQgZXJyb3JzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaXRlbSBpbiBwYXJhbXMpIHtcclxuICAgICAgICAgICAgaWYgKHBhcmFtc1tpdGVtXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSBlcnJvcnMubGVuZ3RoICsgMTtcclxuICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKFwi6ZSZ6K+vXCIgKyBpbmRleCArIFwiOiDlj4LmlbA6IFwiICsgaXRlbSArIFwi5LiN6IO95Li656m6XCIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzID0gNDEyO1xyXG4gICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MTIsXHJcbiAgICAgICAgICAgICAgICBtc2c6IGVycm9yc1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOino+WvhuWvhueggVxyXG4gICAgICAgIHBhcmFtcy5QYXNzd29yZCA9IGNyeXB0by5wcml2YXRlRGVjcnlwdChnbG9iYWwucHJpdmF0ZV9rZXksIEJ1ZmZlci5mcm9tKHBhcmFtcy5QYXNzd29yZCwgJ2Jhc2U2NCcpKTtcclxuXHJcbiAgICAgICAgLy8g5p+l6K+i55So5oi35ZCN5piv5ZCm6YeN5aSNXHJcbiAgICAgICAgY29uc3QgZXhpc3RVc2VyID0gYXdhaXQgVXNlck1vZGVsLlBhc3N3b3JkKHBhcmFtcy5OaWNrbmFtZSwgcGFyYW1zLlBhc3N3b3JkKTtcclxuXHJcbiAgICAgICAgaWYgKGV4aXN0VXNlcikge1xyXG4gICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOetvuWPkXRva2VuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhY2Nlc3NfdG9rZW4gPSBUb2tlbi5zZXRUb2tlbihleGlzdFVzZXIuaWQsIDYwKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZnJlc2hfdG9rZW4gPSBUb2tlbi5zZXRUb2tlbihleGlzdFVzZXIuaWQsIDE1ICogMjQgKiA2MCAqIDYwKTtcclxuICAgICAgICAgICAgICAgIFRva2VuLnJlZGlzU2V0KGFjY2Vzc190b2tlbiwgcmVmcmVzaF90b2tlbik7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDIwMDtcclxuICAgICAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiBg55So5oi355m75b2V5oiQ5YqfYCxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbjogYWNjZXNzX3Rva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyX2lkOiBleGlzdFVzZXIuaWRcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyA9IDUwMDtcclxuICAgICAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiBlcnJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiA0MDQsXHJcbiAgICAgICAgICAgICAgICBtc2c6IFwi55So5oi35ZCN5oiW5a+G56CB6ZSZ6K+vXCJcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDorr7nva7lm77lg4/pqozor4HnoIFcclxuICAgICAqIEBwYXJhbSB7Kn0gcmVxIFxyXG4gICAgICogQHBhcmFtIHsqfSByZXMgXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBjb2RlKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdmFyIGNhcHRjaGEgPSBzdmdDYXB0Y2hhLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgIC8vIOe/u+i9rOminOiJslxyXG4gICAgICAgICAgICBpbnZlcnNlOiBmYWxzZSxcclxuICAgICAgICAgICAgLy8g5a2X5L2T5aSn5bCPXHJcbiAgICAgICAgICAgIGZvbnRTaXplOiAzNixcclxuICAgICAgICAgICAgLy8g5Zmq5aOw57q/5p2h5pWwXHJcbiAgICAgICAgICAgIG5vaXNlOiAyLFxyXG4gICAgICAgICAgICAvLyDlrr3luqZcclxuICAgICAgICAgICAgd2lkdGg6IDgwLFxyXG4gICAgICAgICAgICAvLyDpq5jluqZcclxuICAgICAgICAgICAgaGVpZ2h0OiAzMCxcclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyDkv53lrZjliLBzZXNzaW9uLOW/veeVpeWkp+Wwj+WGmVxyXG4gICAgICAgIHJlcS5zZXNzaW9uID0gY2FwdGNoYS50ZXh0LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgLy8gLy/kv53lrZjliLBjb29raWUg5pa55L6/5YmN56uv6LCD55So6aqM6K+BXHJcbiAgICAgICAgcmVzLmNvb2tpZSgnY2FwdGNoYScsIHJlcS5zZXNzaW9uKTtcclxuICAgICAgICAvLyByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xyXG4gICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICBpbWc6IGNhcHRjaGEuZGF0YSxcclxuICAgICAgICAgICAgbXNnOiByZXEuc2Vzc2lvblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDov5Tlm57lrqLmiLfnq6/lhazpkqVcclxuICAgICAqIEBwYXJhbSB7KnJlcX1cclxuICAgICAqIEBwYXJhbSB7KnJlc31cclxuICAgICAqIEByZXR1cm5zIHsqcHVibGljX2tleX0g6L+U5ZueIOWFrOmSpVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgcHVibGljX2tleShyZXEsIHJlcykge1xyXG4gICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICBtc2c6IGdsb2JhbC5wdWJsaWNfa2V5XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOagueaNruexu+Wei+iOt+WPlueUqOaIt+WQjeWNlVxyXG4gICAgICogQHBhcmFtIHsqdHlwZX0gcmVxICDnlKjmiLfnsbvlnosgXHJcbiAgICAgKiBAcGFyYW0geyp9IHJlcyBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGxpc3QocmVxLCByZXMpIHtcclxuICAgICAgICBsZXQgcGFyYW1zID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICAgIC8vIOajgOa1i+WPguaVsOaYr+WQpuWtmOWcqOS4uuepulxyXG4gICAgICAgIGxldCBlcnJvcnMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpdGVtIGluIHBhcmFtcykge1xyXG4gICAgICAgICAgICBpZiAocGFyYW1zW2l0ZW1dID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGVycm9ycy5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goXCLplJnor69cIiArIGluZGV4ICsgXCI6IOWPguaVsDogXCIgKyBpdGVtICsgXCLkuI3og73kuLrnqbpcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMgPSA0MTI7XHJcbiAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IDQxMixcclxuICAgICAgICAgICAgICAgIG1zZzogZXJyb3JzXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdXNlckxpc3QgPSBhd2FpdCBVc2VyTW9kZWwuZmluZEFsbFVzZXJMaXN0KHBhcmFtcy50eXBlKTtcclxuXHJcbiAgICAgICAgaWYgKHVzZXJMaXN0KSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHVzZXJMaXN0XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXHJcbiAgICAgICAgICAgICAgICAgICAgbXNnOiBlcnJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB1cGxvYWRJbWcocmVxLCByZXMsIG5leHQpIHtcclxuICAgICAgICByZXMuanNvbih7XHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgaW1nOiBcImh0dHA6Ly96cS5pbWcuY29tL1wiICsgcmVxLmZpbGUuZmlsZW5hbWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVXNlciIsImNvbnN0IGRiID0gcmVxdWlyZSgnLi4vY29uZmlnL3NlcXVlbGl6ZS5jb25maWcnKVxyXG5jb25zdCBTZXF1ZWxpemUgPSBkYi5zZXF1ZWxpemU7XHJcbmNvbnN0IGFuc3dlciA9IFNlcXVlbGl6ZS5pbXBvcnQoJy4uL3NjaGVtYS9hbnN3ZXIuanMnKVxyXG5cclxuYW5zd2VyLnN5bmMoeyBmb3JjZTogZmFsc2UgfSk7XHJcblxyXG5jbGFzcyBBbnN3ZXJNb2RlbCB7XHJcbiAgICBzdGF0aWMgYXN5bmMgYW5zd2VyTGlzdChyZXMpIHtcclxuICAgICAgICBsZXQgeyB1c2VyX2lkLCBleGFtX2lkLCBjb250ZW50IH0gPSByZXM7XHJcbiAgICAgICAgcmV0dXJuIGFuc3dlci5maW5kQWxsKHtcclxuICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgZXhhbWlkOiBleGFtX2lkLFxyXG4gICAgICAgICAgICAgICAgaWQ6IGNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICBvcjpbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyaWQ6Y29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyaWQ6dXNlcl9pZFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFuc3dlck1vZGVsXHJcbiIsImNvbnN0IGRiID0gcmVxdWlyZSgnLi4vY29uZmlnL3NlcXVlbGl6ZS5jb25maWcnKVxyXG5jb25zdCBTZXF1ZWxpemUgPSBkYi5zZXF1ZWxpemU7XHJcbmNvbnN0IEV4YW0gPSBTZXF1ZWxpemUuaW1wb3J0KCcuLi9zY2hlbWEvZXhhbS5qcycpXHJcbmNvbnN0IE9wID0gU2VxdWVsaXplLk9wO1xyXG5cclxuRXhhbS5zeW5jKHsgZm9yY2U6IGZhbHNlIH0pO1xyXG5cclxuY2xhc3MgRXhhbU1vZGVsIHtcclxuICAgIC8qKlxyXG4gICAgICrliJvlu7rpl67ljbdcclxuICAgICAqIEBwYXJhbSB0aXRsZVxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBjcmVhdGVFeGFtKGV4YW0pIHtcclxuICAgICAgICBsZXQgeyB0aXRsZSwgdXNlcl9pZCwgZXhwbGFpbiwgdGVzdHRpbWUsIHN0YXR1cywgc29ydCwgZGVzaWduYXRlZCB9ID0gZXhhbTtcclxuICAgICAgICBsZXQgc3FsID0gYXdhaXQgRXhhbS5jcmVhdGUoe1xyXG4gICAgICAgICAgICB0aXRsZSxcclxuICAgICAgICAgICAgdXNlcl9pZCxcclxuICAgICAgICAgICAgZXhwbGFpbixcclxuICAgICAgICAgICAgdGVzdHRpbWUsXHJcbiAgICAgICAgICAgIHN0YXR1cyxcclxuICAgICAgICAgICAgc29ydCxcclxuICAgICAgICAgICAgZGVzaWduYXRlZFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHNxbFxyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGFsdGVyRXhhbShleGFtKSB7XHJcbiAgICAgICAgbGV0IHsgdGl0bGUsIHVzZXJfaWQsIGV4cGxhaW4sIHRlc3R0aW1lLCBzdGF0dXMsIHNvcnQsIGRlc2lnbmF0ZWQsIGV4YW1faWQgfSA9IGV4YW07XHJcbiAgICAgICAgbGV0IGV4YW1DcmVhdGUgPSBhd2FpdCBFeGFtLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgIHRpdGxlLFxyXG4gICAgICAgICAgICB1c2VyX2lkLFxyXG4gICAgICAgICAgICBleHBsYWluLFxyXG4gICAgICAgICAgICB0ZXN0dGltZSxcclxuICAgICAgICAgICAgc3RhdHVzLFxyXG4gICAgICAgICAgICBzb3J0LFxyXG4gICAgICAgICAgICBkZXNpZ25hdGVkLFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGV4YW1faWRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB1c2VyX2lkXHJcbiAgICAgKiBAcGFyYW0gc3RhdHVzXHJcbiAgICAgKiBAcmV0dXJucyBcclxuICAgICAqIOetm+mAiemXruWNt+WIl+ihqFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0bGlzdChleGFtKSB7XHJcbiAgICAgICAgbGV0IHsgdXNlcl9pZCwgc3RhdHVzLCB0aXRsZSwgcGFnZSwgcGFnZWNvdW50IH0gPSBleGFtO1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBFeGFtLmZpbmRBbGwoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcmlkOiB1c2VyX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogc3RhdHVzPT0tMT97W09wLmx0XTozfTpzdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgW09wLm9yXTp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbT3AubGlrZV06IFwiJVwiICsgdGl0bGUgKyBcIiVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW09wLmxpa2VdOiBcIiVcIiArIHRpdGxlICsgXCIlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQ6IChOdW1iZXIocGFnZWNvdW50KSAtIDEpICogcGFnZSxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiBOdW1iZXIocGFnZSksXHJcbiAgICAgICAgICAgICAgICBvcmRlcjogW1xyXG4gICAgICAgICAgICAgICAgICAgIFsnaWQnLCAnREVTQyddXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgZmluZEV4YW0oZXhhbSkge1xyXG4gICAgICAgIGxldCB7IGV4YW1faWQgfSA9IGV4YW07XHJcbiAgICAgICAgbGV0IHNxbCA9IGF3YWl0IEV4YW0uZmluZEFsbCh7XHJcbiAgICAgICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogZXhhbV9pZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gc3FsXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZUV4YW0oZXhhbV9pZCkge1xyXG4gICAgICAgIGF3YWl0IEV4YW0uZGVzdHJveSh7XHJcbiAgICAgICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogZXhhbV9pZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBhc3luYyBjaGFuZ2VTdGF0dXMoZXhhbSkge1xyXG4gICAgICAgIGxldCB7IHVzZXJfaWQsIGV4YW1faWQsIHN0YXR1cyB9ID0gZXhhbTtcclxuICAgICAgICBsZXQgc3FsID0gYXdhaXQgRXhhbS51cGRhdGUoe1xyXG4gICAgICAgICAgICBzdGF0dXNcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZXJpZDogdXNlcl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBpZDogZXhhbV9pZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzcWw7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRXhhbU1vZGVsXHJcbiIsImNvbnN0IGRiID0gcmVxdWlyZSgnLi4vY29uZmlnL3NlcXVlbGl6ZS5jb25maWcnKVxyXG5jb25zdCBTZXF1ZWxpemUgPSBkYi5zZXF1ZWxpemU7XHJcbmNvbnN0IE9wdGlvbiA9IFNlcXVlbGl6ZS5pbXBvcnQoJy4uL3NjaGVtYS9vcHRpb24uanMnKVxyXG5cclxuT3B0aW9uLnN5bmMoe2ZvcmNlOiBmYWxzZX0pO1xyXG5cclxuY2xhc3MgT3B0aW9uTW9kZWwge1xyXG4gICAgLyoqXHJcbiAgICAgKuWIm+W7uumAiemhuVxyXG4gICAgICogQHBhcmFtIHRpdGxlXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxib29sZWFuPn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGNyZWF0ZU9wdGlvbihleGFtKSB7XHJcbiAgICAgICAgbGV0IHsgcXVlc3Rpb25faWQsZXhhbV9pZCwgdGV4dCwgYW5zd2VyLCBzb3J0LCBpbWcsIGludHJvZHVjZSB9ID0gZXhhbTtcclxuICAgICAgICBsZXQgc3FsID0gYXdhaXQgT3B0aW9uLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uX2lkLGV4YW1faWQsIHRleHQsIGFuc3dlciwgc29ydCwgaW1nLCBpbnRyb2R1Y2U6IGludHJvZHVjZS5lZGl0b3JUeHQsIGlzVXJsOiBOdW1iZXIoaW50cm9kdWNlLmlzVXJsKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHNxbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOS/ruaUuemAiemhuVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgYWx0ZXJPcHRpb24oZXhhbSkge1xyXG4gICAgICAgIGxldCB7IG9wdGlvbl9pZCwgcXVlc3Rpb25faWQsZXhhbV9pZCwgdGV4dCwgYW5zd2VyLCBzb3J0LCBpbWcsIGludHJvZHVjZSB9ID0gZXhhbTtcclxuICAgICAgICBhd2FpdCBPcHRpb24udXBkYXRlKHtcclxuICAgICAgICAgICAgdGV4dCwgYW5zd2VyOlN0cmluZyhhbnN3ZXIpLCBzb3J0LCBpbWcsIGludHJvZHVjZTogaW50cm9kdWNlLmVkaXRvclR4dCwgaXNVcmw6IE51bWJlcihpbnRyb2R1Y2UuaXNVcmwpXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbl9pZDpxdWVzdGlvbl9pZCxcclxuICAgICAgICAgICAgICAgICAgICBpZDogb3B0aW9uX2lkLFxyXG4gICAgICAgICAgICAgICAgICAgIGV4YW1faWQ6ZXhhbV9pZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6I635Y+W6YCJ6aG5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBmaW5kQWxsT3B0aW9uKGV4YW0pIHtcclxuICAgICAgICBsZXQgeyBpZCB9ID0gZXhhbTtcclxuICAgICAgICBsZXQgc3FsID0gYXdhaXQgT3B0aW9uLmZpbmRBbGwoe1xyXG4gICAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25faWQ6IGlkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzcWw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm4ge29wdGlvbl9pZH1cclxuICAgICAqIOWIoOmZpOmAiemhuVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlT3B0aW9uKHJlcykge1xyXG4gICAgICAgIGxldCB7IG9wdGlvbl9pZCB9ID0gcmVzO1xyXG4gICAgICAgIGF3YWl0IE9wdGlvbi5kZXN0cm95KHtcclxuICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICAgIGlkOiBvcHRpb25faWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOagueaNrnF1ZXN0aW9uX2lkIOWIoOmZpOaJgOaciemAiemhuVxyXG4gICAgICogQHBhcmFtIHsqfSBxdWVzdGlvbl9pZCBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIGRlbGV0ZU9wdGlvbkJ5UXVlc2lkKHF1ZXN0aW9uX2lkKSB7XHJcbiAgICAgICAgYXdhaXQgT3B0aW9uLmRlc3Ryb3koe1xyXG4gICAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25faWQ6IHF1ZXN0aW9uX2lkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmoLnmja5leGFtX2lkIOWIoOmZpOaJgOaciemAiemhuVxyXG4gICAgICogQHBhcmFtIHsqfSDmoLnmja5leGFtX2lkIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsZXRlT3B0aW9uQnlFeGFtaWQoZXhhbV9pZCkge1xyXG4gICAgICAgIGF3YWl0IE9wdGlvbi5kZXN0cm95KHtcclxuICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICAgIGV4YW1faWQ6IGV4YW1faWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT3B0aW9uTW9kZWxcclxuICAgICIsImNvbnN0IGRiID0gcmVxdWlyZSgnLi4vY29uZmlnL3NlcXVlbGl6ZS5jb25maWcnKVxyXG5jb25zdCBTZXF1ZWxpemUgPSBkYi5zZXF1ZWxpemU7XHJcbmNvbnN0IFF1ZXMgPSBTZXF1ZWxpemUuaW1wb3J0KCcuLi9zY2hlbWEvcXVlc3Rpb24uanMnKVxyXG5cclxuUXVlcy5zeW5jKHsgZm9yY2U6IGZhbHNlIH0pO1xyXG5cclxuY2xhc3MgUXVlc01vZGVsIHtcclxuICAgIC8qKlxyXG4gICAgICrliJvlu7rpopjnm65cclxuICAgICAqIEBwYXJhbSB0aXRsZVxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBjcmVhdGVRdWVzKGV4YW0pIHtcclxuICAgICAgICBsZXQgeyBwcm9ibGVtLCBhbmFseXNpcywgbm90ZSwgc29ydCwgc2NvcmUsIHF1ZXN0aW9uVHlwZSwgZXhhbV9pZCwgYW5zd2VyIH0gPSBleGFtO1xyXG4gICAgICAgIGxldCBzcWwgPSBhd2FpdCBRdWVzLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgIHByb2JsZW0sIGFuYWx5c2lzLCBub3RlLCBzY29yZSwgc29ydCwgcXVlc3Rpb25UeXBlLCBleGFtX2lkLCBhbnN3ZXJcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzcWw7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGFsdGVyUXVlcyhleGFtKSB7XHJcbiAgICAgICAgbGV0IHsgcHJvYmxlbSwgYW5hbHlzaXMsIG5vdGUsIHNvcnQsIHNjb3JlLCBxdWVzdGlvblR5cGUsIGV4YW1faWQsIGFuc3dlciwgcXVlc3Rpb25faWQgfSA9IGV4YW07XHJcbiAgICAgICAgYXdhaXQgUXVlcy51cGRhdGUoe1xyXG4gICAgICAgICAgICBwcm9ibGVtLCBhbmFseXNpcywgbm90ZSwgc2NvcmUsIHNvcnQsIHF1ZXN0aW9uVHlwZSwgZXhhbV9pZCwgYW5zd2VyXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogcXVlc3Rpb25faWRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgc2VsZWN0UXVlcyhleGFtX2lkKSB7XHJcbiAgICAgICAgbGV0IHNxbCA9IGF3YWl0IFF1ZXMuZmluZEFsbCh7XHJcbiAgICAgICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgICAgICBleGFtX2lkOiBleGFtX2lkXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9yZGVyOiBbXHJcbiAgICAgICAgICAgICAgICBbXCJzb3J0XCIsICdBU0MnXVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gc3FsXHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZGVsUXVlcyhleGFtKSB7XHJcbiAgICAgICAgbGV0IHsgaWQgfSA9IGV4YW07XHJcbiAgICAgICAgYXdhaXQgUXVlcy5kZXN0cm95KHtcclxuICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICAgIGlkOiBpZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBkZWxRdWVzQnlFeGFtaWQoZXhhbV9pZCkge1xyXG4gICAgICAgIGF3YWl0IFF1ZXMuZGVzdHJveSh7XHJcbiAgICAgICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgICAgICBleGFtX2lkOiBleGFtX2lkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUXVlc01vZGVsXHJcbiIsImNvbnN0IGRiID0gcmVxdWlyZSgnLi4vY29uZmlnL3NlcXVlbGl6ZS5jb25maWcnKVxyXG5jb25zdCBTZXF1ZWxpemUgPSBkYi5zZXF1ZWxpemU7XHJcbmNvbnN0IFVzZXIgPSBTZXF1ZWxpemUuaW1wb3J0KCcuLi9zY2hlbWEvdXNlci5qcycpXHJcblxyXG5Vc2VyLnN5bmMoe2ZvcmNlOiBmYWxzZX0pO1xyXG5cclxuY2xhc3MgVXNlck1vZGVsIHtcclxuICAgIC8qKlxyXG4gICAgICog5Yib5bu655So5oi3XHJcbiAgICAgKiBAcGFyYW0gdXNlclxyXG4gICAgICogQHJldHVybnMge1Byb21pc2U8Ym9vbGVhbj59XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBjcmVhdGUodXNlcikge1xyXG4gICAgICAgIGxldCB7Tmlja25hbWUsIFBhc3N3b3JkLC8qIGVtYWlsLCBVc2VydG9rZW4qL30gPSB1c2VyO1xyXG5cclxuICAgICAgICByZXR1cm4gYXdhaXQgVXNlci5jcmVhdGUoe1xyXG4gICAgICAgICAgICBOaWNrbmFtZSxcclxuICAgICAgICAgICAgUGFzc3dvcmQsXHJcbiAgICAgICAgICAgIC8vIGVtYWlsLFxyXG4gICAgICAgICAgICAvLyBVc2VydG9rZW4sXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5Yig6Zmk55So5oi3XHJcbiAgICAgKiBAcGFyYW0gaWQgbGlzdElEXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZS48Ym9vbGVhbj59XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBkZWxldGUoaWQpIHtcclxuICAgICAgICBhd2FpdCBVc2VyLmRlc3Ryb3koe1xyXG4gICAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmn6Xor6LnlKjmiLfliJfooahcclxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPCo+fVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgZmluZEFsbFVzZXJMaXN0KHR5cGUpIHtcclxuICAgICAgICBpZighTnVtYmVyKHR5cGUpKXtcclxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFVzZXIuZmluZEFsbCh7XHJcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBbJ2lkJywgJ05pY2tuYW1lJ10sXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCBVc2VyLmZpbmRBbGwoe1xyXG4gICAgICAgICAgICAgICAgYXR0cmlidXRlczogWydpZCcsICdOaWNrbmFtZSddLFxyXG4gICAgICAgICAgICAgICAgd2hlcmU6e1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6dHlwZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmn6Xor6LnlKjmiLfkv6Hmga9cclxuICAgICAqIEBwYXJhbSBOaWNrbmFtZSAg5aeT5ZCNXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZS48Kj59XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBOaWNrbmFtZShOaWNrbmFtZSkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBVc2VyLmZpbmRPbmUoe1xyXG4gICAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICAgICAgTmlja25hbWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOafpeivoueUqOaIt+S/oeaBr1xyXG4gICAgICogQHBhcmFtIE5pY2tuYW1lICDlp5PlkI1cclxuICAgICAqIEBwYXJhbSBQYXNzd29yZCAg5a+G56CBXHJcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZS48Kj59XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBhc3luYyBQYXNzd29yZChOaWNrbmFtZSxQYXNzd29yZCkge1xyXG4gICAgICAgIHJldHVybiBhd2FpdCBVc2VyLmZpbmRPbmUoe1xyXG4gICAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICAgICAgTmlja25hbWUsUGFzc3dvcmRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFVzZXJNb2RlbFxyXG4iLCJjb25zdCBkYiA9IHJlcXVpcmUoJy4uL2NvbmZpZy9zZXF1ZWxpemUuY29uZmlnJylcclxuY29uc3QgU2VxdWVsaXplID0gZGIuc2VxdWVsaXplO1xyXG5jb25zdCB1c2VyRXhhbSA9IFNlcXVlbGl6ZS5pbXBvcnQoJy4uL3NjaGVtYS91c2VyX2V4YW0uanMnKVxyXG5jb25zdCBPcD1TZXF1ZWxpemUuT3A7XHJcbnVzZXJFeGFtLnN5bmMoeyBmb3JjZTogZmFsc2UgfSk7XHJcblxyXG5jbGFzcyB1c2VyZXhhbU1vZGVsIHtcclxuICAgIHN0YXRpYyBhc3luYyBjcmVhdGUocmVzKSB7XHJcbiAgICAgICAgbGV0IHsgdXNlcl9pZCwgZXhhbV9pZCwgc3RhdHVzIH0gPSByZXM7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJFeGFtLmNyZWF0ZSh7XHJcbiAgICAgICAgICAgIHVzZXJfaWQsIGV4YW1faWQsIHN0YXR1c1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGdldEV4YW0ocmVzKSB7XHJcbiAgICAgICAgbGV0IHtzdGF0dXMgLHVzZXJpZH09cmVzO1xyXG4gICAgICAgIHJldHVybiB1c2VyRXhhbS5maW5kQWxsKHtcclxuICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICAgIHVzZXJpZDogdXNlcmlkLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzOnN0YXR1cz09LTE/Jz4wJzpzdGF0dXNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGFzeW5jIGdldFVzZXIocmVzKSB7XHJcbiAgICAgICAgcmV0dXJuIHVzZXJFeGFtLmZpbmRBbGwoe1xyXG4gICAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICAgICAgZXhhbWlkOiBleGFtaWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdXNlcmV4YW1Nb2RlbFxyXG4iLCJjb25zdCBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xyXG5jb25zdCBVc2VyID0gcmVxdWlyZSgnLi9jb250cm9sbGVycy91c2VyJylcclxuY29uc3QgRXhhbSA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvZXhhbScpXHJcbmNvbnN0IEFuc3dlciA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvYW5zd2VyJylcclxuY29uc3QgUXVlcyA9IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcXVlc3Rpb24nKVxyXG5jb25zdCBPcHRpb24gPSByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL29wdGlvbicpXHJcbmNvbnN0IHVwbG9hZD1yZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3VwbG9hZCcpXHJcbi8vIGNvbnN0IFVwbG9hZFRva2VuID0gcmVxdWlyZSgnLi4vY29udHJvbGxlcnMvVXBsb2FkVG9rZW4nKVxyXG5jb25zdCBSb3V0ZXJzID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbi8vICDnlKjmiLfms6jlhoxcclxuUm91dGVycy5wb3N0KCcvcmVnaXN0ZXInLCBVc2VyLmNyZWF0ZSk7XHJcbi8vICDnlKjmiLfnmbvlvZVcclxuUm91dGVycy5wb3N0KCcvbG9naW4nLCBVc2VyLmxvZ2luKTtcclxuLy8gIOiOt+WPlueUqOaIt+WQjeWNlVxyXG5Sb3V0ZXJzLnBvc3QoJy91c2VycycsIFVzZXIubGlzdCk7XHJcbi8vICDojrflj5blm77lvaLnoIFcclxuUm91dGVycy5nZXQoJy9jYXB0Y2hhJywgVXNlci5jb2RlKTtcclxuLy8gIOiOt+WPluWFrOmSpVxyXG5Sb3V0ZXJzLmdldCgnL3B1YmxpY0tleScsIFVzZXIucHVibGljX2tleSk7XHJcblxyXG4vLyAg5o+Q5Lqk5Zu+54mHXHJcblJvdXRlcnMucG9zdChcIi9VcGxvYWRwaWNcIix1cGxvYWQuc2luZ2xlKFwiaW1nXCIpLFVzZXIudXBsb2FkSW1nKTtcclxuXHJcblxyXG4vLyDpl67ljbfmjqXlj6NcclxuUm91dGVycy5wb3N0KFwiL0V4YW1UaXRsZVwiLEV4YW0uY3JlYXRlKVxyXG5Sb3V0ZXJzLnBvc3QoXCIvcXVlc3Rpb25zXCIsUXVlcy5jcmVhdGUpXHJcblJvdXRlcnMucGF0Y2goXCIvcXVlc3Rpb25zXCIsUXVlcy5wYXRjaFF1ZXMpICAgICAgXHJcblJvdXRlcnMuZ2V0KFwiL3F1ZXN0aW9ubmFpcmVMaXN0XCIsRXhhbS5nZXRsaXN0KVxyXG5Sb3V0ZXJzLmdldChcIi9xdWVzdGlvbnNcIiwgIFF1ZXMuZ2V0UXVlc3Rpb25zKVxyXG5Sb3V0ZXJzLmRlbGV0ZShcIi9xdWVzdGlvbnNcIixRdWVzLmRlbGV0ZXF1ZXN0aW9uKTtcclxuUm91dGVycy5kZWxldGUoXCIvb3B0aW9uXCIsT3B0aW9uLmRlbGV0ZU9wdGlvbilcclxuUm91dGVycy5wYXRjaChcIi9FeGFtXCIsRXhhbS5wYXRjaEV4YW0pXHJcblJvdXRlcnMuZGVsZXRlKFwiL0V4YW1cIixFeGFtLmRlbGV0ZUV4YW0pXHJcblxyXG4vL+etlOWNt+aOpeWPo1xyXG5Sb3V0ZXJzLmdldChcIi9hbnN3ZXJMaXN0XCIsQW5zd2VyLmFuc3dlckxpc3QpXHJcblxyXG5cclxuLyoqXHJcbiAqIOS4iuS8oHRva2VuXHJcbiAqL1xyXG4vLyBSb3V0ZXJzLmdldCgnL3VwbG9hZC90b2tlbicsIFVwbG9hZFRva2VuLnRva2VuKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSb3V0ZXJzXHJcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJvZHktcGFyc2VyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvb2tpZS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV4cHJlc3NcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm11bHRlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZGlzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInNlcXVlbGl6ZVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdmctY2FwdGNoYVwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ3ZWJwYWNrLWRldi1taWRkbGV3YXJlXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=