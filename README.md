# 问卷调查系统

## 1. 数据库建表
### 使用sequelize 操作数据库。
![alt='数据库表格'](http://f2.leanote.top/5d36c713ab64414b8a00267c?e=1582534245&token=T0cw3n7Kjqycn0UzED7QlgeshR7PRU0uMIy3Xz0K:Eu1KY95L0qqy92vKPPny4yvT4nA)
6个table，因为出卷人要指定答卷人，所以建了一个 关联指定答卷人和试卷table，

#### 产品需求需要一个答卷人列表，需要根据答卷的状态，关键字进行搜索，

> 建表 就需要先在 指定答卷人和试卷table 里根据user_id得到他所需要考试的所有试卷，然后逐个筛选状态和关键字

感觉这样好复杂，有没有更好的建表方式，或者处理方式？

