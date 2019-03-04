<template>
    <div class="body">
        <div class="content">
            <Navtop :tempdata="pagedataTemp"  :questiondata="pagedata.questiondata"></Navtop>
            <div class="nav-right">
                <i class="iconfont icon-zuo"  v-if="!navShow"  @mouseenter="navShow=true" @mouseout="navShow=false"></i>
                <div v-if="navShow"  @mouseenter="navShow=true" @mouseleave="navShow=false">
                    <div>
                        <p>{{pagedata.topdata.gross_score}}</p>
                        <p>试卷总分</p>
                    </div>
                    <div>
                        <p>{{pagedata.questiondata.length>0?pagedata.questiondata.length:0}}</p>
                        <p>试卷题目数</p>
                    </div>
                </div>
            </div>
            <div class="header clearfix">
                <div>
                    <label>奖励类型
                        <select v-model="pagedata.topdata.reward_type" style="width: 170px;">
                            <option value="1">实物奖励</option>
                            <option value="2">虚拟奖励</option>
                            <option value="3">虚拟奖励&实物奖励</option>
                        </select>
                    </label>
                    <label>上传图片 <input type="checkbox" v-model="pagedata.topdata.is_img"></label>
                    <label>发布
                        <input type="checkbox" v-model="pagedata.topdata.status" >
                    </label>
                    <label>活动规则位置
                        <select v-model="pagedata.topdata.sketch_top" style="width: 80px;">
                            <option value="1">顶部</option>
                            <option value="2">底部</option>
                        </select>
                    </label>
                    <label>用户信息位置
                        <select v-model="pagedata.topdata.active_srot" style="width: 80px;">
                            <option value="1">顶部</option>
                            <option value="2">底部</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label style="display: flex">背景图
                        <input type="text" v-model="pagedata.topdata.img" class="file-input">
                        <span class="btn-primary btn-file">
                            <span class="fileinput-new" >选择文件 <i v-if="pagedata.topdata.imgload" class="iconfont icon-jiazaizhong1" ></i></span>
                            <input type="file" name="file_upload" class="file_upload" accept="image/*"  @change="fileUpload($event)">
                        </span>
                        <a :href="pagedata.topdata.img" target="_blank"> <img :src="pagedata.topdata.img" class="st_cont_img"  /></a>
                    </label>
                </div>
                <testeditor :editordata="pagedata.topdata"></testeditor>
            </div>
            <testTitle :titledata="pagedata.titledata" ></testTitle>
            <setquestion  :questiondata="pagedata.questiondata" :topdata="pagedata.topdata"></setquestion>
            <div style="background: #fff;text-align: center;padding: 30px;">
                <span class="btn btn-primary" @click="checkdata">提交</span>
                <span class="btn btn-info" >取消</span>
            </div>
        </div>
        <!--{{pagedata}}-->
    </div>
</template>

<script>
    import testeditor from '@/components/testeditor.vue'
    import Top from '@/components/top'
    import Navtop from '@/components/navtop'
    import testTitle from '@/components/testTitle'
    import setquestion from '@/QA/setquestion'
    export default {
        name: "editFrom",
        components: {
            Top, Navtop, testTitle, setquestion,testeditor
        },
        data() {
            return {
                navShow:false,
                pagedata: {
                    questiondata: [{
                        isshow: 0,  //问题编辑展开
                        editorTxt: '',      //问题名称
                        optiondata: [{
                            text: '',
                            img: '', //选项图片
                            answer: false,
                            introduce: {
                                isUrl: 0,//选项说明是输入文本 还是输入链接
                                url: '',
                                editorTxt: '',
                            },
                        }],
                        note: '',           //编辑提示
                        analysis: '',    //答案解析
                        score: null,   //题目分值
                        questionType: 'radio', //题目类型
                        navOperate: false,
                        haswindow: false,   //编辑窗口是否弹出
                        question_id: 0, //题目ID
                        answer:'',
                    }],
                    topdata: {
                        gross_score: 0, //总分
                        amount: 0, //题目数
                        imgload:false,
                        status:false,
                        sketch_top:1,
                        is_img:false,
                        reward_type:1,
                        img:'',
                        id:0,
                        placeholder:'活动简介',
                        editorTxt: '',  //活动简介
                        active_srot:'',//用户信息位置
                    },
                    titledata: {
                        title: "",
                        editorTxt: '',
                        haswindow: false,
                    }
                },
                pagedataTemp: {
                    questiondata: [{
                        isshow: 0,  //问题编辑展开
                        editorTxt: '',      //问题名称
                        note: '',           //编辑提示
                        optiondata: [{
                            text: '',
                            img: '', //选项图片
                            answer: false,
                            introduce: {
                                isUrl: 0,//选项说明是输入文本 还是输入链接
                                url: '',
                                editorTxt: '',
                            },
                        }],
                        analysis: '',    //答案解析
                        score: null,   //题目分值
                        questionType: 'radio', //题目类型
                        navOperate: false,
                        haswindow: false,   //编辑窗口是否弹出
                        question_id: 0, //题目ID
                        answer:'',
                    }],
                    topdata: {
                        gross_score: 0, //总分
                        amount: 0, //题目数
                        active_srot:'',//用户信息位置
                    },
                    titledata: {
                        title: "",
                        editorTxt: '',
                        haswindow: false,
                    }
                },
                hasMsg: false,
                msg: '',
            }
        },
        mounted(){
            this.$set(this.pagedata.topdata,'id',this.match(parent.location.href,'id'));
            if(this.pagedata.topdata.id!=0){
                this.detail()
            }
        },
        methods:{
            detail(){
                var _this=this;
                $.ajax({
                    type:"post",
                    url:"/questionnaire/getById",
                    data:{
                        id:_this.pagedata.topdata.id
                    },
                    success:function (res) {
                        if(res.state==0){
                            for(let name in res.data.quelist){
                                _this.$set(_this.pagedata.questiondata,name,$.extend(true,{},_this.pagedata.questiondata[0],res.data.quelist[name]))
                            }
                            for(let name in res.data.data){
                               let value=res.data.data[name];
                                if(name=='sketch'){
                                    _this.$set(_this.pagedata.topdata,'editorTxt',res.data.data.sketch);
                                }else if(name=='title'){
                                    _this.$set(_this.pagedata.titledata,name,value);
                                }else if(name=='subtitle'){
                                    _this.$set(_this.pagedata.titledata,'editorTxt',value);
                                }else if(name=='status'||name=='is_img'){
                                    _this.$set(_this.pagedata.topdata,name,value==1?true:false);
                                }
                                else{
                                    _this.$set(_this.pagedata.topdata,name,value);
                                }
                            }
                        }
                    }
                })
            },
            fileUpload(e){
                var formData=new FormData();//通过formdata上传
                let imgFile=e.target.files[0];
                formData.append('file_upload',imgFile);
                formData.append('name','file_upload');
                this.pagedata.topdata.imgload=true;
                $.ajax({
                    type:'POST',
                    url:'/official/upload',
                    dataType: 'JSON',
                    contentType: false,
                    processData: false,
                    data:formData,
                    success:(res)=>{
                        if(res.state==0){
                            this.$set(this.pagedata.topdata,'img',res.data);
                            this.$set(this.pagedata.topdata,'imgload',false);
                        }
                    },
                    error:function (res) {
                        console.log(res)
                    }
                })

            },
            checkdata() {
                var _this = this;
                var topdata = _this.pagedata.topdata;
                var titledata = this.pagedata.titledata;
                var questiondata = this.pagedata.questiondata;
                let problemData={
                    id:topdata.id,
                    status:topdata.status?1:0,
                    sketch_top:topdata.sketch_top,
                    active_srot:topdata.active_srot,
                    is_img:topdata.is_img?1:0,
                    reward_type:topdata.reward_type,
                    img:topdata.img,
                    title:titledata.title,
                    subtitle:titledata.editorTxt,
                    sketch:topdata.editorTxt,
                    questiondata:[]
                };
                /**创建和编辑问卷标题
                 */
                if (titledata.title == '') {
                    this.$msg('请输入标题');
                    return false;
                }
                for (let m in questiondata) {
                    let ls_optiondata=[];
                    for (let name in questiondata[m]) {
                        let value = questiondata[m][name];
                        if (questiondata[m].questionType!='QA'&&name=='answer'&&(value == '' || value == null)) {
                            this.$msg('第' + (Number(m)+1) + '题答案为空。');
                            return false;
                        }
                        if (name=='editorTxt'&&(value == '' || value == null)) {
                            this.$msg('第' + (Number(m)+1) + '题题目为空。');
                            return false;
                        }
                        if (name=='optiondata') {
                            for (let n in value) {
                                let optionText=value[n].text;
                                let optionImg=value[n].img;
                                let optionAnswer=value[n].answer;
                                if(questiondata[m].questionType!='QA'&&(optionText==''||optionText==null)){
                                    this.$msg('第' + (Number(m) + 1) + '题请选择输入选项。')
                                    return false;
                                }
                                if (questiondata[m].questionType=='checkbox'&&(optionAnswer == 'true'||optionAnswer == true)) {
                                    questiondata[m].answer += (Number(n) + 1) + '&';    //答案
                                }
                                ls_optiondata.push({
                                    text:optionText,
                                    img:optionImg,
                                    introduce:value[n].introduce,
                                })
                            }
                        }
                    }
                    problemData.questiondata.push({
                        optiondata:questiondata[m].optiondata,
                        editorTxt:questiondata[m].editorTxt,
                        note:questiondata[m].note,
                        analysis:questiondata[m].analysis,
                        score:questiondata[m].score,
                        questionType:questiondata[m].questionType,
                        answer:questiondata[m].answer,
                        mustanswer:questiondata[m].mustanswer
                    });
                }
                this.submit(problemData)
            },
            submit(data){
                let _this=this;
                $.ajax({
                    type:'post',
                    url:'/questionnaire/Save',
                    data:data,
                    success:function (res) {
                        if(res.state==0){
                            _this.$msg('提交成功');
                            _this.$set(_this.pagedata.topdata,'id',res.data)
                            _this.detail();
                        }else{
                            _this.$msg(res.msg);
                        }
                    }
                })
            },
            match(search, name) {
                /**
                 *   从url中正则匹配得到数据
                 **/
                var reg = new RegExp("[?|&]" + name + "=([^&]*)(&|$)", "i");
                var r = search.match(reg);
                if (r != null) return unescape(r[1]);
                return 0;
            }
        }
    }
</script>
<style scoped>
    .header{width: 100%;background: #fff;padding:20px 10px 0;margin:0 auto 1px;}
    .header>div{padding: 10px 0;}
    .file-input{width: 50%;padding: 0 5px;margin-left: 5px;}
    .st_cont_img{max-width: 30px;max-height: 30px;object-fit: scale-down;margin-left: 3px;}
    .btn-file {position: relative;overflow: hidden;vertical-align: middle;border-radius:0;padding:2px 5px;}
    .btn-file > input {position: absolute;top: 0;right: 0;width: 100%;height: 100%;margin: 0;font-size: 23px;cursor: pointer;filter: alpha(opacity=0);opacity: 0;direction: ltr;}
    .header label{vertical-align: middle;margin-right:10px;}
    .header label select{height: 25px;}
    .header label:before{content:'*';color: red;padding: 0 5px;}

    @media screen and (min-width:1000px){
          .paperbg{background:url(../assets/images/paper.jpg) no-repeat top center !Important;background-size: 1000px!important;background-color:#61cbff!Important ;        }
        .body {margin: auto;background: #eee;position: relative;min-height: 100%;        }
        .body>>>.title{margin-top: 0px;}
        .body > p {margin: 10px auto; width: 900px;      }
        .body>>>.ql-toolbar.ql-snow .ql-formats{margin-right: 0px;}
        .body>>>.ql-snow.ql-toolbar button,.body>>>.ql-snow .ql-toolbar button{width: 25px;}
        .content {width: 1000px;margin:auto;position: relative;padding-top: 40px;        }

        .nav-right{position: fixed;right: 50%;margin-right: -500px;color: #fff;top:30%;z-index: 3; }
        .nav-right .icon-zuo{font-size: 35px;color: #1d6bef ;margin-top: 10px;position: absolute;right: 0px;}
        .nav-right>div{background: linear-gradient(to right, #0088ff ,blue, #1568d5);display: flex;border-radius:5px 0 0 5px;}
        .nav-right p{padding:5px 10px;text-align: center;font-size: 14px;}
        .nav-right p:nth-of-type(1){font-size: 25px;font-weight: bold;}

    }
    @media screen and (max-width:850px){
        .body > p {
            width: 100%;
        }
        .content {
            width: 100%;
            left: 0;
            margin-left: 0;
        }
        .icon-home{position: fixed;font-size: 25px;
            right: 0;}
        .btn-closetop{position: fixed;z-index: 66;color: #fff;bottom: 0;width: 90%;left: 5%;bottom: 10px;}
        .body>>>.navtop{top:0px;}
        .body>>>.title{margin-top: 35px;}
    }
</style>
