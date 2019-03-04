<template>
    <div>
        <div class="st_top_content" >
            <div class="header clearfix">
                <div class="fl" v-if="Ispaper==0">
                    <span class="btn btn-primary" @click="$emit('submitAnswer',1)">提交考试</span>
                    <!--<span class="btn btn-primary" @click="$emit('submitAnswer',0)">保存草稿</span>-->
                </div>
                <div class="fl" v-if="Ispaper==1">
                    <p class="btn btn-primary">试卷总分：{{topdata.score_sum}}</p>
                </div>
                <div class="fr" >
                    <p class="btn btn-primary"  v-if="Ispaper==0">试卷倒计时：{{topdata.testTime}}分钟</p>
                    <p class="btn btn-primary"> 试卷题目数：{{questiondata.length>0?questiondata.length:0}}</p>
                </div>
            </div>
        </div>
        <div class="title">
            <h1 class="st_title">{{titledata.title}}</h1>
            <div v-html="titledata.editorTxt" class="st_subtitile"></div>
        </div>
        <div v-for="(items,indexs) in questiondata">
            <div class="st_question_content" >
                <div style="display: flex"><span v-if="!topdata.sort">{{indexs+1}}.</span><b  v-if="topdata.sort" class="cl-red">*</b><span v-html="items.editorTxt"></span></div>
                <div class="form-group pdt-10 clearfix" v-html='items.note'></div>
                <div v-if="items.questionType=='radio'">
                    <div  v-for="(item,index) in items.optiondata" :class="{'optionBorder':(item.img!=''||(item.introduce.editorTxt!=''&&item.introduce.url!=''))}">
                        <label >
                            <input :name="'radio'+indexs" type="radio" :value="index+1" v-model="items.answer" :data="items.answer">
                            <span v-html="item.text"></span>
                            <img :src="item.img" alt=""></label>
                        <span v-html="item.introduce.isUrl=='1'?item.introduce.url:item.introduce.editorTxt"></span>
                    </div>
                </div>
                <div v-if="items.questionType=='judge'">
                    <div v-for="(item,index) in items.optiondata">
                        <label @focus="items.answer+'&'+(index+1)"><input :name="'judge'+indexs" type="radio" :value="index+1" v-model="items.answer"><span v-html="item.text"></span>
                            <img :src="item.img" alt=""></label>
                    </div>
                </div>
                <div v-if="items.questionType=='checkbox'">
                    <div v-for="(item,index) in items.optiondata" :class="{'optionBorder':(item.img!=''||(item.introduce.editorTxt!=''&&item.introduce.url!=''))}">
                        <label ><input type="checkbox" :value="index+1" v-model="item.answer"><span v-html="item.text"></span>
                            <img :src="item.img" alt=""></label>
                        <span v-html="item.introduce.isUrl=='1'?item.introduce.url:item.introduce.editorTxt"></span>
                    </div>
                </div>
                <!--姓名-->
                <div v-if="items.questionType=='name'" class="form-control clearfix"><i class="icon iconfont icon-ren"></i></div>
                <!--简答-->
                <textarea v-if="items.questionType=='QA'" class="col-md-10" v-model="items.answer"></textarea>
                <div class="form-group pd-10 clearfix" v-if="isExamAnswer"><span class="fl">题目解析：</span><div class="fl" v-html="items.analysis"></div></div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "answerquestion",
        components: {
        },
        props: ['questiondata','topdata','titledata','isExamAnswer'],
        data() {
            return {
                Ispaper:window.location.hash.indexOf('/paper?')!=-1?0:window.location.hash.indexOf('/checkpaper?')!=-1?1:2,
            }
        },
        watch:{
            'topdata.testTime':{
                handler(newVal,oldVal) {
                    console.log(newVal,oldVal)
                    var _this=this;
                    if(newVal==0){
                        _this.$emit('submitAnswer',1);
                    }
                    setTimeout(()=>{
                        _this.topdata.testTime=_this.topdata.testTime-1;
                    },60000)
                },
                immediate: true
            }
        },
        mounted(){
            if(this.isPaper){
                setTimeout(()=>{
                    this.$emit('submitAnswer',0)
                },600000);
            }
        },
        computed:{
        }
    }
</script>

<style scoped>

    .st_top_content{margin:auto;width:1000px;z-index: 2;position: fixed;top:0px;}
    .header{color: #fff;width: 1000px;margin: auto;padding: 0 20px;}
    .header>div{padding: 10px 0;}
    .header p{display: inline-block;margin: 0;padding: 0 10px;vertical-align: middle}
    .header label{vertical-align: middle;margin: 0;}
    .title{cursor: pointer; min-height: 100px;background: #fff;width: 1000px;margin: auto;border-bottom: 1px solid #ddd;padding: 10px 0;margin-top: 15px;}
    .st_subtitile{color: #555555;
        line-height: 24px;
        text-align: left;
        font-size: 16px;
        padding:0 50px;
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

    .st_question_content{padding: 40px;background: #fff;border-bottom: 1px solid #ddd;;}
    input:disabled{background: #fff;}
    .st_question_content .icon-ren{color: #999;}
    .st_setquestion .st_note {
        text-decoration: underline;
        color: #0a6ebd;
        cursor: pointer;
    }

    .st_setquestion .st_selecttype {
        margin: 10px 0;
    }

    @media screen  and (max-width: 1000px){
        .st_top_content{width: 100%;}
        .header{width: 100%}
        .title{width: 100%;}

    }

</style>
