<template>
    <div class="body" :class="{'paperbg':isPaper}">
        <div class="content">
            <Top v-if="!isPaper" :ispage="isPaper" :topCofig="topCofig"  :topdata="pagedata.topdata" :questiondata="pagedata.questiondata" @checkdata="checkdata"></Top>
            <Navtop v-if="!isPaper" :tempdata="pagedataTemp"  :questiondata="pagedata.questiondata"></Navtop>
            <testTitle  v-if="!isPaper" :titledata="pagedata.titledata" ></testTitle>
            <answerquestion v-if="isPaper" @submitAnswer="submitAnswer" :isExamAnswer="isExamAnswer" :titledata="pagedata.titledata" :questiondata="pagedata.questiondata" :topdata="pagedata.topdata"></answerquestion>
            <setquestion v-if="!isPaper" :questiondata="pagedata.questiondata" :topdata="pagedata.topdata"></setquestion>
            <Msg v-if="hasMsg" :msg="msg"></Msg>
            <div v-if="!isPaper" style="background: #fff;text-align: center;padding: 30px;">
                <span class="btn btn-primary" @click="!isPaper?topCofig.topShow=true:''">提交</span>
                <span class="btn btn-info" >取消</span>
            </div>
        </div>
        <!--{{pagedata}}-->
    </div>
</template>

<script>
    import Top from '@/components/top'
    import Msg from '@/components/msg'
    import Navtop from '@/components/navtop'
    import testTitle from '@/components/testTitle'
    import setquestion from '@/components/setquestion'
    import answerquestion from '@/components/answerquestion'
    export default {
        name: 'questionnaire',
        components: {
             Top, Navtop, testTitle, setquestion, Msg,answerquestion
        },
        data() {
            return {
                isPaper:false,  //判断是不是考试页面
                topCofig:{
                    topShow:false,
                },
                isExamAnswer:false,
                pagedata: {
                    questiondata: [{
                        isshow: 0,  //问题编辑展开
                        editorTxt: '',      //问题名称
                        note: '',           //编辑提示
                        analysis: '',    //答案解析
                        score: null,   //题目分值
                        questionType: 'radio', //题目类型
                        navOperate: false,
                        haswindow: false,   //编辑窗口是否弹出
                        question_id: 0, //题目ID
                        answer:'',
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
                    }],
                    topdata: {
                        gross_score: 0, //总分
                        amount: 0, //题目数
                        sort: false, //隐藏系统考题
                        opentest: false, //是否发布
                        testTime: null,//考试时间
                        exam_id: 0, //试卷id
                        designated:'' ,//指定答题者
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
                        analysis: '',    //答案解析
                        score: null,   //题目分值
                        questionType: 'radio', //题目类型
                        navOperate: false,
                        mustanswer:false,
                        haswindow: false,   //编辑窗口是否弹出
                        question_id: 0, //题目ID
                        answer:'',
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
                    }],
                    topdata: {
                        gross_score: 0, //总分
                        score_sum:0, //答卷得分
                        amount: 0, //题目数
                        sort: false, //隐藏系统考题
                        opentest: false, //是否发布
                        testTime: null,//考试时间
                        exam_id: 0, //试卷id
                        designated:'' ,//指定答题者
                    },
                    titledata: {
                        title: "",
                        editorTxt: '',
                        haswindow: false,
                    }
                },
                hasMsg: false,
                msg: '',
                flag: true,  //判断数据是否填写正确
            }
        },
        mounted() {
            this.getQuestion();
            this.answerQuestion();
        },
        methods: {
            showmsg(res) {
                this.hasMsg = true;
                this.msg = res;
                this.flag = false;
                setTimeout(() => {
                    this.hasMsg = false
                }, 3000);
            },
            /**
             * checkdata()  先上传topdata数据  得到exam_id
             * uploadQuestion()  再检测题目填写  上次题目
             **/
            checkdata() {
                var _this = this;
                var topdata = _this.pagedata.topdata;
                var titledata = this.pagedata.titledata;
                var questiondata = this.pagedata.questiondata;

                /**创建和编辑问卷标题
                 */
                if (titledata.title == '') {
                    this.showmsg('请输入试卷名');
                    return false;
                }
                if (topdata.testTime == '') {
                    this.showmsg('请输入答题时间');
                    return false;
                }
                if (topdata.testTime == null || topdata.testTime == '') {
                    this.showmsg('请填写答题时间');
                    return false;
                }
                _this.$http({
                    method: 'post',
                    url: '/ExamTitle',
                    data: {
                        title: titledata.title,
                        testtime: topdata.testTime*60,
                        status: topdata.opentest ? 1 : 0,
                        explain: titledata.editorTxt,
                        exam_id: topdata.exam_id,
                        father: 0,
                        sort:topdata.sort,
                        designated:topdata.designated.length==0?'[]':topdata.designated
                    },
                }).then(res=>{
                    res = res.data;
                    if (res.status == 200) {
                        _this.pagedata.topdata.exam_id=res.data.id;
                        _this.uploadQuestion(res.data);
                        if(_this.flag){
                            _this.showmsg('问卷提交成功');
                            setTimeout(()=>{
                                _this.$router.push('/homeQuestion')
                                },3000)
                        }
                    }else{
                        _this.showmsg(res.msg);
                    }
                })
            
            },

            /**
             * 上传题目  每个题目上传一次
             **/
            uploadQuestion(ajaxData) {
                var _this=this;
                this.flag = true;
                for (let m in this.pagedata.questiondata) {
                    let problemData = {
                        answer:''
                    };
                    for (let name in this.pagedata.questiondata[m]) {
                        let value = this.pagedata.questiondata[m][name];
                        switch (name) {
                            case 'questionType':
                                if (value == 'QA') {
                                    problemData.type = 0; 
                                } else if (value == 'radio') {
                                    problemData.type = 1;
                                } else if (value == 'checkbox') {
                                    problemData.type = 2;
                                } else if (value == 'judge') {
                                    problemData.type = 3;
                                }
                                break;
                            case 'answer':
                                problemData[name]=value
                                break;
                            case 'editorTxt':
                                if (value == '' || value == null) {
                                    this.showmsg('第' + (Number(m)+1) + '题题目为空。');
                                    this.flag=false;
                                }
                                problemData.problem = value;    //题目
                                break;
                            case 'optiondata':
                                problemData.child_number = Number(m) + 1;
                                problemData.extid = [];
                                if(this.pagedata.questiondata[m].questionType=='checkbox'){
                                    problemData.answer='';
                                }
                                for (let n in value) {
                                    problemData.extid.push({});
                                    problemData.extid[n].type = 3; //选项内容
                                    problemData.extid[n].label = n;
                                    problemData.extid[n].content = 'text=' + value[n].text + '&img=' + value[n].img + '&answer=' + value[n].answer + '&isUrl=' + value[n].introduce.isUrl + '&url=' + value[n].introduce.url + '&editorTxt=' + value[n].introduce.editorTxt;
                                    if (this.pagedata.questiondata[m].questionType=='checkbox'&&(value[n].answer == 'true'||value[n].answer == true)) {
                                        problemData.answer += (Number(n) + 1) + '&';    //答案
                                    }
                                }
                                if(this.pagedata.questiondata[m].questionType=='checkbox'&&problemData.answer.charAt(problemData.problemData.length-1)=='&') {
                                    problemData.answer=problemData.answer.substring(0,problemData.answer.length-1)
                                }
                                if (this.pagedata.questiondata[m].questionType!='QA'&&problemData.answer == '') {
                                    this.showmsg('第' + (Number(m) + 1) + '题请选择一个正确答案。')
                                    this.flag=false;
                                }
                                break;
                            case 'score':
                                if (value == '' || value == null) {
                                    this.showmsg('第' + (Number(m) + 1) + '题成绩为空。');
                                    this.flag=false;
                                }
                                problemData.score = value;    //分数
                                break;
                            case 'id':
                                problemData[name] = value;
                                break;
                            case 'analysis':
                                problemData.parsing = value;
                                break;
                            case 'note':
                                problemData.prompt = value;
                                break;
                        }

                    }
                    problemData.exam_id = ajaxData.id;
                    problemData.father_number = 1;      //father_number  父标题序号  固定为1  放在最前面
                    if (this.flag) {
                        _this.$http({
                            method: 'post',
                            url: '/ExamQuestions',
                            data: problemData,
                        }).then(res=>{
                             res=JSON.parse(res);
                        })
                    }
                }

            },
            /**
             * 上传答卷
             **/
            submitAnswer(type){
                var _this=this;
                var formdata={
                    exam_id:_this.pagedata.topdata.exam_id,
                    save:type, //(0草稿,1确定提交)
                    questions:[]
                }
                for(let i in _this.pagedata.questiondata){
                    let ls_questiondata=_this.pagedata.questiondata[i];
                    formdata.questions.push({
                        question_id:ls_questiondata.id,
                        answer:''
                    })
                    if(ls_questiondata.questionType!='checkbox'){
                        formdata.questions[i].answer=ls_questiondata.hasOwnProperty('answer')?ls_questiondata.answer:'';
                    }else{
                        for(let n in ls_questiondata.optiondata){
                            formdata.questions[i].answer+=ls_questiondata.optiondata[n].answer==true?((Number(n)+1)+'&'):''
                        }
                        formdata.questions[i].answer=formdata.questions[i].answer.substring(0,formdata.questions[i].answer.length-1)
                    }
                }
                $.ajax({
                    type:'post',
                    url:'/Exam/SubmitExam',
                    data:formdata,
                    success:function (res) {
                        res=JSON.parse(res);
                        if(res.status==0){
                            _this.showmsg('试卷提交成功');
                            setTimeout(()=>{
                                _this.$router.push('/homeAnswer')
                            },2000)
                        }else{
                            _this.showmsg(res.msg);
                        }
                    }
                })
            },
            /**
             * 从答卷列表进入  编辑答卷题目
             * 答卷列表 url为paper_id
             * 根据 url 得到paper_id  请求ajax获取设置好的题目
             **/
            answerQuestion(){
                var _this = this;
                var ls_url='';
                if (!_this.$match(window.location.hash,'paper_id')) {
                    return false;
                }
                this.isPaper=true;
                if(window.location.hash.indexOf('service_id=')!=-1){
                    ls_url='/Exam/GetAnswer?exam_id='+this.$match(window.location.hash,'paper_id')+'&service_id='+this.$match(window.location.hash,'service_id')
                }else{
                    ls_url='/Exam/GetPersonalInfo?exam_id='+_this.$match(window.location.hash, 'paper_id')+'';
                }
                $.ajax({
                    type: 'get',
                    url: ls_url,
                    success: function (res) {
                        res = JSON.parse(res);
                        if(res.status==0){
                            _this.pagedata.titledata.title = res.data.exam.title;
                            _this.pagedata.titledata.editorTxt = res.data.exam.explain;
                            _this.pagedata.topdata.exam_id = res.data.exam.id;
                            _this.pagedata.topdata.testTime=res.data.exam.testtime/60;
                            _this.pagedata.topdata.sort=res.data.exam.sort;
                            _this.pagedata.topdata.score_sum=res.data.answerinfo.score_sum;
                            _this.pagedata.topdata.opentest=(res.data.status==0?false:true);
                            let list = res.data.exam.list;
                            let questions = res.data.answerinfo.questions;
                            let ls_question = {};
                            let ls_option = {
                                introduce:{}
                            };
                            if(list!=undefined&&list.length<1){
                                _this.pagedata.questiondata=[];
                            }else{
                                for (let i in list) {
                                    for (let name in list[i]) {
                                        let value = list[i][name];
                                        switch (name) {
                                            case 'prompt':
                                                ls_question.note = value;
                                                break;
                                            case 'parsing':
                                                ls_question.analysis = value;
                                                break;
                                            case 'id':
                                                ls_question[name] = value;
                                                ls_question.answer=(questions!=[]&&questions[value]!=undefined)?questions[value].answer:'';
                                                break;
                                            case 'type':
                                                if (value == 0) {
                                                    ls_question.questionType = 'QA';
                                                } else if (value == 1) {
                                                    ls_question.questionType = 'radio';
                                                } else if (value == 2) {
                                                    ls_question.questionType = 'checkbox';
                                                } else if (value == 3) {
                                                    ls_question.questionType = 'judge';
                                                }
                                                break;
                                            case 'problem':
                                                ls_question.editorTxt = value;
                                                break;
                                            case 'extid':
                                                ls_question.optiondata = [];
                                                for (let n in value) {
                                                    for (let Aname in value[n]) {
                                                        if (Aname == 'content') {
                                                            value[n][Aname] = '?&' + value[n][Aname];
                                                            ls_option.text = _this.$match(value[n][Aname], 'text');
                                                            ls_option.img = _this.$match(value[n][Aname], 'img');
                                                            if(list[i].type==2){
                                                                ls_option.answer=ls_question.answer.indexOf(Number(n)+1)!=-1?true:false;
                                                            }
                                                            ls_option.introduce.isUrl = _this.$match(value[n][Aname], 'isUrl');
                                                            ls_option.introduce.url = _this.$match(value[n][Aname], 'url');
                                                            ls_option.introduce.editorTxt = _this.$match(value[n][Aname], 'editorTxt');
                                                        }
                                                    }
                                                    ls_question.optiondata.push($.extend(true,{},ls_option));
                                                }
                                                break;
                                        }
                                    }
                                    _this.$set(_this.pagedata.questiondata,i,$.extend(true,{},_this.pagedataTemp.questiondata[0],ls_question));
                                }
                            }
                        }else{
                            _this.showmsg(res.msg)
                        }
                    }
                })
            },
            /**
             * 从问卷列表进入  编辑问卷题目
             * 答卷列表 url为id
             * 根据 url 得到id 请求ajax获取设置好的题目
             **/
            getQuestion() {
                var _this = this;
                if (_this.$match(window.location.href, 'id') == null) {
                    return false;
                }
                _this.$http({
                    method: 'get',
                    url: '/questions?exam_id=' + _this.$match(window.location.href, 'id') + '',
                }).then(res=>{
                     if(res.status==200){
                         res =res.data;
                          _this.pagedata.titledata.title = res.data.title;
                          _this.pagedata.titledata.editorTxt = res.data.explain;
                          _this.pagedata.topdata.exam_id = res.data.id;
                          _this.pagedata.topdata.testTime=res.data.testtime/60;
                          _this.pagedata.topdata.sort=res.data.sort;
                          _this.pagedata.topdata.designated=res.data.designated!=''?JSON.parse(res.data.designated):'';
                          _this.pagedata.topdata.opentest=(res.data.status==0?false:true);
                          let list = res.data.list;
                          let ls_question = {};
                          let ls_option = {
                              introduce:{}
                          };
                          if(list.length<1||list==undefined){
                              _this.pagedata.questiondata=[];
                          }else{
                              for (let i in list) {
                                  for (let name in list[i]) {
                                      let value = list[i][name];
                                      switch (name) {
                                          case 'prompt':
                                              ls_question.note = value;
                                              break;
                                          case 'parsing':
                                              ls_question.analysis = value;
                                              break;
                                          case 'question_id':case 'score':case 'answer':
                                          ls_question[name] = value;
                                          break;
                                          case 'type':
                                              if (value == 0) {
                                                  ls_question.questionType = 'QA';
                                              } else if (value == 1) {
                                                  ls_question.questionType = 'radio';
                                              } else if (value == 2) {
                                                  ls_question.questionType = 'checkbox';
                                              } else if (value == 3) {
                                                  ls_question.questionType = 'judge';
                                              }
                                              break;
                                          case 'problem':
                                              ls_question.editorTxt = value;
                                              break;
                                          case 'extid':
                                              ls_question.optiondata = [];
                                              for (let n in value) {
                                                  for (let Aname in value[n]) {
                                                      if (Aname == 'content') {
                                                          value[n][Aname] = '?&' + value[n][Aname];
                                                          ls_option.text = _this.$match(value[n][Aname], 'text');
                                                          ls_option.img = _this.$match(value[n][Aname], 'img');
                                                          if(list[i].type==2){
                                                              ls_option.answer = (_this.$match(value[n][Aname], 'answer')=='true'?true:false);
                                                          }
                                                          ls_option.introduce.isUrl = _this.$match(value[n][Aname], 'isUrl');
                                                          ls_option.introduce.url = _this.$match(value[n][Aname], 'url');
                                                          ls_option.introduce.editorTxt = _this.$match(value[n][Aname], 'editorTxt');
                                                      }
                                                  }
                                                  ls_question.optiondata.push($.extend(true,{},ls_option));
                                              }
                                              break;
                                      }
                                  }
                                  _this.$set(_this.pagedata.questiondata,i,$.extend(true,{},_this.pagedataTemp.questiondata[0],ls_question));
                              }
                          }
                      }else{
                          _this.showmsg(res.msg)
                      }
                })

            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @media screen and (min-width:1000px){
        .paperbg{
            background:url(../assets/images/paper.jpg) no-repeat top center !Important;
            background-size: 1000px!important;
            background-color:#61cbff!Important ;
        }
        .body {
            margin: auto;
            background: #eee;
            position: relative;
            min-height: 100%;
        }

        .body > p {
            margin: 10px auto;
            width: 900px;
        }

        .content {
            width: 1000px;
            margin:auto;position: relative;
        }
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
        .icon-home{position: fixed;font-size: 25px;right: 0;}
        .btn-closetop{position: fixed;z-index: 66;color: #fff;bottom: 0;width: 90%;left: 5%;bottom: 10px;}
        .body>>>.navtop{top:0px;}
        .body>>>.title{margin-top: 35px;}
    }
    .content{padding-top: 40px;}
</style>
