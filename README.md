# testsystem-mysql-express

http://f2.leanote.top/5d36c713ab64414b8a00267c?e=1577156790&token=T0cw3n7Kjqycn0UzED7QlgeshR7PRU0uMIy3Xz0K:1IaPPqAxdyKwC8Z6MyJDlvUNa8A

6个table，
因为出卷人要指定答卷人，所以建了一个关联指定答卷人和试卷的table，

然后这边有一个答卷人列表，需要根据答卷的状态，关键字进行搜索，

我按照这边的建表可能就需要先在指定答卷人和试卷的table里根据user_id得到他所需要考试的所有试卷，然后逐个筛选状态和关键字

感觉这样好复杂，有没有更好的建表方式，或者处理方式？
