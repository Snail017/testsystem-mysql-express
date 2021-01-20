import http from "@/api/httpServer.js";

// 接口列表

/**
 * 提交试卷名
 * @param {*} data 
 */
export const ExamTitle = data => {
	return http({
		url: "/ExamTitle",
	}, data);
};
/**
 * 提交试卷题目
 * @param {*} data 
 */
export const setQuestions = (method, data) => {
	return http({
		url: "/questions",
		method: method
	}, data);
}
/**
 * 获取问卷列表
 */
export function questionnaireList(method,data){
	return http({
		url:"/questionnaireList",
		method:'get',
	},data)
}
/**
 * 登陆
 */
export function login(data){
	return http({
		url:"/login",
		method:'post',
	},data)
}