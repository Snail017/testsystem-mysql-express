<template>
    <div>
        <div class="title" @click="titledata.haswindow=true;">
            <h1 class="st_title">{{titledata.title==''?'请输入标题':titledata.title}}</h1>
            <div v-html="titledata.editorTxt==''?'请输入副标题':titledata.editorTxt" class="st_subtitile"></div>
        </div>
        <Window :windowdata="titledata"></Window>
    </div>
</template>

<script>
    import Window from '@/components/window.vue'
    export default {
        name: "testTitle",
        components:{
            Window,
        },
        props:['titledata'],
    }
</script>

<style scoped>
    .title{cursor: pointer; min-height: 100px;background: #fff;width: 1000px;margin: auto;border-bottom: 1px solid #ddd;padding: 10px 0;}
    .st_subtitile{color: #555555;
        line-height: 24px;
        text-align: left;
        font-size: 16px;
        padding:0 100px;
        margin-left: 0;
        margin-top: 20px;}
    .st_title{
        font-size: 24px !important;
        font-weight: bold;
        color: #f53d05;
        vertical-align: middle;text-align: center;
        margin: 0;
        padding: 15px 0;
        line-height: 24px;
    }
    @media screen and (max-width: 1000px){
        .title{width: 100%;}
    }
</style>