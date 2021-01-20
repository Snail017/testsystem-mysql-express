import { questionnaireList ,login} from './apiList'
// api请求数据校验
export function VerifyquestionnaireList(data) {
    if (!data || !data.pagecount || !data.title) {
        return
    }
    data.hasOwnProperty('p') ? data.p : data.p = 10;
    return new Promise((resolve, reject) => {
        questionnaireList(data).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
//登陆验证
export function VerifyLogin(data) {
    if(!data||!data.name||!data.password) return
    return new Promise((resolve, reject) => {
        login(data).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}