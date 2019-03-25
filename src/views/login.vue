<template>
    <div class="register">
       <Row>
           <Col span="24">
               <Input type="text"  v-model="name" placeholder="用户名" />
           </Col>
       </Row>
       <Row>
           <Col span="24">
               <Input type="text" v-model="password" placeholder="密码" />
           </Col>
       </Row>

        <Row>
            <Col span="18">
                <Input type="text" placeholder="验证码" />
            </Col>
            <Col span="6" v-html="img"></Col>
        </Row>
        <Button type="success" long @click="login()">登录</Button>
        <Row>
            <router-link to="/login" style="float: right">注册</router-link>
        </Row>
    </div>
</template>

<script>
    export default {
        name: "login",
        data(){
            return{
                password:'',
                name:"",
                img:""
            }
        },
        mounted(){
            var _this=this;
            this.$http({
                method:"get",
                url:"/api/getCaptcha",
            }).then((res)=>{
                res=res.data;
                _this.img=res.data
            })
        },
        methods:{
            login(){
                var _this=this;
                this.$http({
                    method:"post",
                    url:'/user/register',
                    data:{
                        password:_this.password,
                        name:_this.name
                    }
                }).then((res)=>{
                    console.log(res)
                })
            }
        }
    }
</script>

<style scoped>
    .register .ivu-row{margin-bottom: 10px;}
    .register{margin-top: 100px!important;}
    @media screen and (min-width:800px){
        .register{width: 600px;margin: auto;border: 1px solid #ddd;padding: 40px;}
    }
</style>