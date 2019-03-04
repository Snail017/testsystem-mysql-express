<template>
    <div>
        <div class="bg" @click="hide()"></div>
        <div class="layer">
            <div class="layer_content">{{layer.msg}}</div>
            <div class="layer_footer">
                <span class="layer_sure" @click="sure()">确定</span>
                <span class="layer_cancel" @click="hide()">取消</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "layer",
        props:['layer'],
        methods:{
            hide(){
                this.layer.msg='';
                this.layer.flag=false;
            },
            sure(){
                this.layer.flag=true;
            }
        }
    }
</script>

<style scoped>
    .bg{background: #0000009e;position: fixed;top:0;left: 0;right: 0;bottom: 0;z-index: 2;color: #f4d290;text-align: center;padding-top: 15%;font-size: 20px;font-weight: bold;cursor: default;}
    .layer{position: fixed;top:30%;width: 300px;left: 50%;margin-left: -150px;background: #fff;text-align: center;z-index: 2}
    .layer_footer{border-top:1px solid #ccc;}
    .layer_footer>span{width: 50%;float: left;padding: 5px;cursor: pointer;}
    .layer_sure{background: #0a6ebd;color: #fff;}
    .layer_cancel{background: #b1b7bb;color: #fff;}
    .layer_content{padding:10px 5px;}
</style>