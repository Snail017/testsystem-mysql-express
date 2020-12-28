//  正则校验集合  

// 手机号验证
export function isvalidPhone(str) {
	const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
	return reg.test(str)
}
// 微信号验证
export function isvalidWeixin(str) {
	const reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/
	return reg.test(str)
}
// 网址验证
export function isvalidUrl(str) {
	const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/
	return reg.test(str)
  }	

// 特殊字符验证
export function isvalidSpecial(str) {
	const reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
	return reg.test(str)
  }  

// 纯数字验证
export function isvalidNum(str) {
	const reg = /[^\d]+/
	return reg.test(str)
}

//正整数的正则表达式(不包括0) 	
export function isvalidPositiveNum(str) {
	const reg = /^[1-9]\d*$/
	return reg.test(str)
}

//正整数的正则表达式(包括0)	
export function isvalidPositNum(str) {
	const reg = /^[+]{0,1}(\d+)$/
	return reg.test(str)
}
// 身份证验证
export function isvalidCard(str) {
	const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
	return reg.test(str)
}  

//邮箱验证
export function isValidEmail(str){
	const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
	return reg.test(str)
}
 