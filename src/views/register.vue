<template>
<div>
    <input type="text" v-model="name">
    <input type="text" v-model="password" >
    <p @click="register()">登录</p>
</div>
</template>

<script>
    export default {
        name: "register",
        data(){
            return{
                password:'',
                name:""
            }
        },
        methods:{
            register(){
                var _this=this;
                this.$http({
                    method:"get",
                    url:'/user/register',
                    data:{
                        password:_this.password,
                        name:_this.name
                    },
                    success:function (res) {
                        console.log(res)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>