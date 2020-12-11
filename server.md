# 问卷系统开发  ---服务端
[github:https://github.com/Snail017/testsystem-mysql-express.git](https://github.com/Snail017/testsystem-mysql-express.git)  

## 1. 数据库建表
### redis 数据库 （存放token，作为辅助数据库）
   redis 查询速度快，但是作为内存数据库，无法存储过大数据。存放缓存有助于提高性能
### mysql 数据库 （存放大规模数据，作为主数据库）
   存储在硬盘中。可以支持更大规模的数据，成本更低。

### 项目应用：使用sequelize 操作mysql数据库。
![5d36c713ab64414b8a00267c.png](https://image-static.segmentfault.com/307/511/30751115-5e53d2c9a165f_articlex)
- 出卷人要指定答卷人，
 > 建了一个 关联指定答卷人和试卷table，

- 产品需求需要一个答卷人列表，需要根据答卷的状态，关键字进行搜索，

> 建表 就需要先在 指定答卷人和试卷table 里根据user_id得到他所需要考试的所有试卷，然后逐个筛选状态和关键字

### 项目应用：ORM数据模型（Object/Relational Mapping）
 将数据库操作通过实例对象的语法完成。使用框架sequlize
1. 数据库table  --->  类（class）
2. 记录（record,行数据）---> 对象（object）
3. 字段（filed）-->对象属性（attribute）

**命名规范：**

1. 一个类对应一张表。类名是单数，且首字母大写；表名是复数，且全部是小写。比如，表`books`对应类`Book`。
2. 如果名字是不规则复数，则类名依照英语习惯命名，比如，表`mice`对应类`Mouse`，表`people`对应类`Person`。
3. 如果名字包含多个单词，那么类名使用首字母全部大写的骆驼拼写法，而表名使用下划线分隔的小写单词。比如，表`book_clubs`对应类`BookClub`，表`line_items`对应类`LineItem`。
4. 每个表都必须有一个主键字段，通常是叫做`id`的整数字段。外键字段名约定为单数的表名 + 下划线 + id，比如`item_id`表示该字段对应`items`表的`id`字段。

感觉这样好复杂，有没有更好的建表方式，或者处理方式？  

## 2. 数据加密
### 加密的两种方式
### 1.RES非对称加密：加密解密的秘钥不同，私钥加密，公钥解密。
![5ceb4754ab64413019001458.png](https://image-static.segmentfault.com/865/817/865817067-5e53d4255997c_articlex)
### 2. AES对称加密

### 项目选择：使用RES 加密用户信息
使用加密插件crypto，进行RES非对称加密+md5不可逆加密
![5ceb5273ab6441301900167c.png](https://image-static.segmentfault.com/421/134/4211346692-5e53d40b0c07b_articlex)  

关于加密解密引用一则动漫解读：[https://mp.weixin.qq.com/s/1ojSrhc9LZV8zlX6YblMtA](https://mp.weixin.qq.com/s/1ojSrhc9LZV8zlX6YblMtA)

## 3. 用户认证  
### 用户认证方法   token方法和session认证
+ 目的：防止CSRF(cross-site request forgery)网站攻击。
+ 网站攻击常用的两种方式：XSS,CSRF;·
 >CSRF:        查看wiki解释。
防御方式：1.检查refrence 字段  2.添加token
+ CSS:代码注入
 > 防御措施：htmlentites  过滤输出。

### 1. token认证：JWT实现
![5ceb81f5ab64412e23001f04.png](https://image-static.segmentfault.com/147/842/1478422046-5e53d65876a3e_articlex)  

+ JWT的组成：Header + Payload + Signature
+ JWT 优点：
  1. 可拓展性好。（session需要放在数据库中，但是jwt只需要放在客户端中）
  2. 无状态（JWT 不在服务端存储任何状态）
+ JWT缺点：
  1. 安全性(bse64编码，没有加密)
  2. 性能（JWT数据比较长 ，一般存储在localstorage中）
  3. 一次性

### 2. 传统session认证
![5ceb81ecab64413019001fc9.png](https://image-static.segmentfault.com/349/739/3497392908-5e53da3d920d0_articlex)  

### 项目应用:用户自动登录（JWT实现）
**设置token自动刷新时间**
+ 用户登录时设置access_token 和refresh_token，access-token为key,fresh_token为value存入redis数据库。并将access_token返回给客户端。access_token时间可以设置为1个小时，refresh_token时间设置为一周（refresh_token有效时间越长，token有效期越长）。
    > 1. 当时access_token 失效时，根据access_toke得到refresh_token判断是否有效。
    > 2. 有效返回新的access_token给客户端，设置Authorization。将新的access_token 和refresh_token存入redis数据库。
    > 3. 无效重新登录。  

---------------------------

-------------------------
摸索学习，有什么不对的欢迎指教。



