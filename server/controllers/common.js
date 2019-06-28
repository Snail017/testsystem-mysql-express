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