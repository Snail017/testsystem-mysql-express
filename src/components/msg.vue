<template>
    <div class="st_msg">
        <p  v-html="msg"></p>
    </div>
</template>

<script>
    export default {
        name: "msg",
        props:['msg']
    }
</script>

<style scoped>
.st_msg{position: fixed;z-index: 99;top:0;left: 0;width: 100%;height: 100%;text-align: center;background: #0000009c;}
.st_msg>p{background: #0a6ebd;color: #fff;text-align: center;padding: 5px;display: inline-block;margin:20% auto 0;border-radius: 5px;}
</style>