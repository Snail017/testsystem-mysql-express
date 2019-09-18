<template>
    <div class="content">
        <router-link tag="div"  to="/homeQuestion" class="box">
            我的问卷
        </router-link>
        <router-link tag="div" to="/homeAnswer" class="box">
            我的答卷
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "home",
        data(){
            return{
            }
        },
        mounted(){
        },
        methods:{
        }
    }
</script>

<style scoped>
.content{width: 100%;margin: auto;text-align: center;}
.box{width: 40%;margin: 5%; box-shadow: 0px 0 10px #ccc;padding:40px; display: inline-block;text-align: center;border-radius: 5px;background: #7ab7fc;color: #fff;cursor: pointer;}
.box:hover{background:#91c5fc }
</style>