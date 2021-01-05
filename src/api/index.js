import {questionnaireList} from './apiList'
// api请求数据校验
export function VerifyquestionnaireList(data){
    if(data||!data.pagecount||!data.title){
        return
    }
    data.hasOwnProperty('p')?data.p:data.p=10;
    return new Promise((resolve,reject)=>{
        questionnaireList('get',data).then(res=>{
            resolve(res)
        }).catch(err=>{
            reject(err)
        })
    })
}