<template>
    <div class="st_msg" v-if="show" :style="{'z-index':Zindex,'background':masked?'#0000009c':'transparent'}" @click="show=false">
        <p  v-html="message" ></p>
    </div>
</template>

<script>
    export default {
        name: "msg",
        data(){
            return{
                message:'null',
                show:false,
                Zindex:999,
                masked:true,
                duration:2000
            }
        }
    }
</script>

<style scoped>
    .st_msg{position: fixed;z-index: 99;top:0;left: 0;width: 100%;height: 100%;text-align: center;background: #0000009c;}
    .st_msg>p{background: #0a6ebd;color: #fff;text-align: center;padding: 10px;display: inline-block;margin:10% auto 0;border-radius: 5px;}
</style>