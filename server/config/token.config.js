const jwt=require("jsonwebtoken")

/**
 * 设置校验token
 */
class Token{

    /**
     * @param {*key} key 
     * @params {*value} value
     */
    static redisSet(key,val){
        return new Promise((resolve,reject)=>{
            global.client.set(Number(key),val,(err,res)=>{
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    

    /**
     * 
     * @param {key} key 
     * @returns {*value} value 
     */
    static redisGet(key){
        return new Promise((resolve,reject)=>{
            global.client.get(Number(key),(err,res)=>{
                if(err) reject(err)
                resolve(res)
            })
        })
    }
    /**
     * 
     * @param {*用户id} id 
     * @param {*token} token 
     * @returns {*token过期,重新登录}  status 404
     * @returns {*access_token过期，设置新的token} status 202
     * @returns {*token 未过期} status 200
     */
    static async checkToken(token){
        try{
            let nowDate=Number(new Date());
            //获取判断access_token  判断是否过期
            let jwt_access_token=await jwt.verify(token,global.private_key);
            let id=jwt_access_token.sub;
            if(jwt_access_token.exp<nowDate){
                //获取解析refresh_token 判断有效时间
                let old_refresh_token=await Token.redisGet(token);
                let jwt_old_refresh_token=await jwt.verify(old_refresh_token,global.private_key);
                if(jwt_old_refresh_token.exp<nowDate){
                    return {
                        status:404
                    }
                }else{
                    let new_fresh_token=await Token.setToken(id,1*24*60*60);
                    let new_access_token=await Token.setToken(id,60);
                    Token.redisSet(new_fresh_token,new_fresh_token); //设置新的refresh_token 放入redis
                    return {
                        status:202,
                        access_token : new_access_token,
                        uid : id,
                        msg : "更新token"
                    }
                }
            }else{
                return {
                    status:200,
                    uid : id,
                    msg:"token有效中"
                };
            }

        }catch(err){
            return {
                status:404,
                msg:err
            }
        }
   

    }

     /**
      * 设置token
     * @param userid 用户id
     * @param overtime  有效时间
     * @param name 用户名
     * @returns token 
     * */
    static setToken(userid, overtime) {
        var playload = {
                iss: '1670644339@qq.com',   // JWT的签发者
                sub: userid,    // JWT所面向的用户
                exp:new Date().getTime()+overtime*1000,
                aud: "1670644339@qq.com",  //接收JWT的一方
                iat: new Date().getTime(),  // 该JWT签发的时间
            };
        var token = jwt.sign(playload,global.private_key);
        return token;
    }

}

module.exports=Token