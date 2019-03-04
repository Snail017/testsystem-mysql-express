<template>
    <div class="st_pagenation">
        <span class="pagebtn " @click="page('first')">首页</span>
        <span class="pagebtn " @click="page('prev')" >上一页</span>
        <div class="pagenum">
            <span v-for="index in pagedata.page_total" :class="{'now':index==pagedata.p}" @click="page(index)" v-if="(index-pagedata.p<3)&&(index+3-pagedata.p>0)">{{index}}</span>
        </div>
        <span class=" pagebtn"  @click="page('next')">下一页</span>
        <span class=" pagebtn"  @click="page('last')">最后</span>
        &nbsp;&nbsp;
        共{{pagedata.page_total}}页
    </div>
</template>

<script>
    /*
    分页组件
    page_total  总页数
    data_total  总数据
    * */
    export default {
        name: "pagenation",
        data(){
            return{

            }
        },
        props:['pagedata'],
        methods:{
            page(res){
                this.$emit("page",res);
            }
        }
    }
</script>

<style scoped>
    .st_pagenation{text-align: center;margin:30px auto;position: relative;}
    .st_pagenation .pagenum{display: inline-block;width: 200px;}
    .st_pagenation span{cursor: pointer;border:1px solid #ccc;padding: 5px;margin:0 2px; }
    .st_pagenation .now{border:none;color: red;}
    .st_pagenation .pagebtn{background: #0744d2;color: #fff;border:none;}
</style>