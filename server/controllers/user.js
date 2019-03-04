import { User } from '../models/user'

export default class {
    static async register (ctx) {
        const post = ctx.request.body
        let result
        try {
            // 调用模型的 create()  方法插入一行数据
            result = await User.create(post)
        } catch (error) {
            return ctx.body = {success: false, error}
        }

        ctx.body = {success: true, data: result}
    }
}
