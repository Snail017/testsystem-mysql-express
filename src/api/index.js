import http from "@/api/httpServer.js";

// 暴露接口
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