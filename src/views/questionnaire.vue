<template>
  <div class="body" :class="{'paperbg':isPaper}">
    <div class="content">
      <Top
        v-if="!isPaper"
        :ispage="isPaper"
        :topCofig="topCofig"
        :topdata="pagedata.topdata"
        :questiondata="pagedata.questiondata"
        @checkdata="checkdata"
      ></Top>
      <Navtop v-if="!isPaper" :tempdata="pagedataTemp" :questiondata="pagedata.questiondata"></Navtop>
      <testTitle v-if="!isPaper" :titledata="pagedata.titledata"></testTitle>
      <answerquestion
        v-if="isPaper"
        @submitAnswer="submitAnswer"
        :isExamAnswer="isExamAnswer"
        :titledata="pagedata.titledata"
        :questiondata="pagedata.questiondata"
        :topdata="pagedata.topdata"
      ></answerquestion>
      <setquestion
        v-if="!isPaper"
        :questiondata="pagedata.questiondata"
        :topdata="pagedata.topdata"
      ></setquestion>
      <Msg v-if="hasMsg" :msg="msg"></Msg>
      <div v-if="!isPaper" style="background: #fff;text-align: center;padding: 30px;">
        <Button type="primary" @click="!isPaper?topCofig.topShow=true:''">提交</Button>&nbsp;&nbsp;&nbsp;
        <Button type="info">取消</Button>
      </div>
    </div>
    <!--{{pagedata}}-->
  </div>
</template>

<script>
import Top from "@/components/top";
import Msg from "@/components/msg";
import Navtop from "@/components/navtop";
import testTitle from "@/components/testTitle";
import setquestion from "@/components/setquestion";
import answerquestion from "@/components/answerquestion";
export default {
  name: "questionnaire",
  components: {
    Top,
    Navtop,
    testTitle,
    setquestion,
    Msg,
    answerquestion
  },
  data() {
    return {
      isPaper: false, //判断是不是考试页面
      topCofig: {
        topShow: false
      },
      isExamAnswer: false,
      pagedata: {
        questiondata: [
          {
            isshow: 0, //问题编辑展开
            editorTxt: "", //问题名称
            note: "", //编辑提示
            analysis: "", //答案解析
            score: null, //题目分值
            questionType: "1", //题目类型
            navOperate: false,
            haswindow: false, //编辑窗口是否弹出
            question_id: 0, //题目ID
            answer: "",
            sort: 0,
            optiondata: [
              {
                sort: 0,
                text: "",
                img: "", //选项图片
                answer: false,
                introduce: {
                  isUrl: 0, //选项说明是输入文本 还是输入链接
                  url: "",
                  editorTxt: ""
                },
                option_id: 0
              }
            ]
          }
        ],
        topdata: {
          gross_score: 0, //总分
          amount: 0, //题目数
          sort: false, //隐藏系统考题
          opentest: false, //是否发布
          testTime: null, //考试时间
          exam_id: 0, //试卷id
          designated: "" //指定答题者
        },
        titledata: {
          title: "",
          editorTxt: "",
          haswindow: false
        }
      },
      pagedataTemp: {
        questiondata: [
          {
            isshow: 0, //问题编辑展开
            editorTxt: "", //问题名称
            note: "", //编辑提示
            analysis: "", //答案解析
            score: null, //题目分值
            questionType: "1", //题目类型
            navOperate: false,
            mustanswer: false,
            haswindow: false, //编辑窗口是否弹出
            question_id: 0, //题目ID
            answer: "",
            sort: 0,
            optiondata: [
              {
                sort: 0,
                text: "",
                img: "", //选项图片
                answer: false,
                introduce: {
                  isUrl: 0, //选项说明是输入文本 还是输入链接
                  url: "",
                  editorTxt: ""
                },
                option_id: 0
              }
            ]
          }
        ],
        topdata: {
          gross_score: 0, //总分
          score_sum: 0, //答卷得分
          amount: 0, //题目数
          sort: false, //隐藏系统考题
          opentest: false, //是否发布
          testTime: null, //考试时间
          exam_id: 0, //试卷id
          designated: "" //指定答题者
        },
        titledata: {
          title: "",
          editorTxt: "",
          haswindow: false
        }
      },
      hasMsg: false,
      msg: "",
      flag: true //判断数据是否填写正确
    };
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
        this.hasMsg = false;
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
      if (titledata.title == "") {
        this.showmsg("请输入试卷名");
        return false;
      }
      if (topdata.testTime == "") {
        this.showmsg("请输入答题时间");
        return false;
      }
      if (topdata.testTime == null || topdata.testTime == "") {
        this.showmsg("请填写答题时间");
        return false;
      }
      _this
        .$http({
          method: "post",
          url: "/ExamTitle",
          data: {
            title: titledata.title,
            testtime: topdata.testTime,
            status: topdata.opentest ? 1 : 0,
            explain: titledata.editorTxt,
            exam_id: topdata.exam_id,
            father: 0,
            sort: topdata.sort,
            designated: topdata.designated
          }
        })
        .then(res => {
          res = res.data;
          if (res.code == 200) {
            _this.pagedata.topdata.exam_id = res.data.id;
            _this.uploadQuestion(res.data);
            if (_this.flag) {
              _this.showmsg("问卷提交成功");
              setTimeout(() => {
                _this.$router.push("/homeQuestion");
              }, 3000);
            }
          } else {
            _this.showmsg(res.msg);
          }
        });
    },

    /**
     * 上传题目  每个题目上传一次
     **/
    uploadQuestion(ajaxData) {
      var _this = this;
      this.flag = true;
      for (let m in this.pagedata.questiondata) {
        let problemData = {};
        for (let name in this.pagedata.questiondata[m]) {
          let value = this.pagedata.questiondata[m][name];
          switch (name) {
            case "analysis":
            case "note":
            case "mustanswer":
              problemData[name] = value;
              break;
            case "sort":
              problemData[name] = Number(m);
              break;
            case "answer":
              if (
                value === "" &&
                (this.pagedata.questiondata[m].questionType == 3 ||
                  this.pagedata.questiondata[m].questionType == 1)
              ) {
                this.showmsg("第" + (Number(m) + 1) + "题请选择一个正确答案。");
                this.flag = false;
              }
              problemData[name] = value;
              break;
            case "score":
            case "question_id":
            case "questionType":
              if (value === "" || value === null) {
                this.showmsg("第" + (Number(m) + 1) + "题" + name + "为空。");
                this.flag = false;
              }
              problemData[name] = value;
              break;
            case "editorTxt":
              if (value == "" || value == null) {
                this.showmsg("第" + (Number(m) + 1) + "题题目为空。");
                this.flag = false;
              }
              problemData.problem = value; //题目
              break;
            case "optiondata":
              problemData.optiondata = value;
              if (this.pagedata.questiondata[m].questionType == 2) {
                problemData.answer = "";
              }
              for (let n in value) {
                // 多选时需要循环optiondata将questiondata.answer相加为多个选项 n&m
                if (this.pagedata.questiondata[m].questionType == 2) {
                  if (
                    String(value[n].answer) == "true" ||
                    String(value[n].answer) == "0"
                  ) {
                    problemData.answer += n + "&"; //答案
                  }
                }
              }
              break;
          }
        }
        problemData.exam_id = ajaxData.id;
        problemData.father_number = 1; //father_number  父标题序号  固定为1  放在最前面
        if (this.flag) {
          if (problemData.question_id == 0) {
            _this
              .$http({
                method: "post",
                url: "/questions",
                data: problemData
              })
              .then(res => {});
          } else {
            _this
              .$http({
                method: "patch",
                url: "/questions",
                data: problemData
              })
              .then(res => {});
          }
        }
      }
    },
    /**
     * 上传答卷
     **/
    submitAnswer(type) {
      var _this = this;
      var formdata = {
        exam_id: _this.pagedata.topdata.exam_id,
        questions: []
      };
      for (let i in _this.pagedata.questiondata) {
        let ls_questiondata = _this.pagedata.questiondata[i];
        formdata.questions.push({
          question_id: ls_questiondata.question_id,
          answer: ""
        });
        if (ls_questiondata.questionType != 2) {
          formdata.questions[i].answer = ls_questiondata.hasOwnProperty(
            "answer"
          )
            ? ls_questiondata.answer
            : "";
        } else {
          for (let n in ls_questiondata.optiondata) {
            formdata.questions[i].answer +=
              ls_questiondata.optiondata[n].answer == true
                ? Number(n) + "&"
                : "";
          }
          formdata.questions[i].answer = formdata.questions[i].answer.substring(
            0,
            formdata.questions[i].answer.length - 1
          );
        }
      }
      _this
        .$http({
          method: "post",
          url: "/SubmitExam",
          data: formdata
        })
        .then(res => {
          res = res.data;
          if (res.code == 200) {
            _this.showmsg("试卷提交成功");
            setTimeout(() => {
              _this.$router.push("/homeAnswer");
            }, 2000);
          } else {
            _this.showmsg(res.msg);
          }
        });
    },
    /**
     * 从答卷列表进入  编辑答卷题目
     * 答卷列表 url为paper_id
     * 根据 url 得到paper_id  请求ajax获取设置好的题目
     **/
    answerQuestion() {
      var _this = this,
        paper_id = this.$match(window.location.hash, "paper_id");
      if (!paper_id) {
        return false;
      }
      _this.isPaper = true;
      _this
        .$http({
          method: "GET",
          url: "/personalPage",
          params: {
            exam_id: paper_id
          }
        })
        .then(res => {
          res = res.data;
          if (res.code == 200) {
            _this.pagedata.titledata.title = res.data.title;
            _this.pagedata.titledata.editorTxt = res.data.explain;
            _this.pagedata.topdata.exam_id = res.data.id;
            _this.pagedata.topdata.testTime = res.data.testtime;
            _this.pagedata.topdata.sort = res.data.sort;
            _this.pagedata.topdata.opentest =
              res.data.status == 0 ? false : true;
            let list = res.data.list;
            let questions = res.data.list;
            let ls_question = {};
            let ls_option = {
              introduce: {},
            };
            if (list != undefined && list.length < 1) {
              _this.pagedata.questiondata = [];
            } else {
              for (let i in list) {
                for (let name in list[i]) {
                  let value = list[i][name];
                  switch (name) {
                    case "questionType":
                    case "note":
                    case "score":
                    case "analysis":
                    case "question_id":
                    case "answer":
                      ls_question[name] = value;
                      break;
                    case "optiondata":
                      ls_question[name] = value;
                      if (list[i].questionType == 2) {
                        for (let n in value) {
                          if (list[i].answer.indexOf(n + "&") != 1) {
                            ls_question.optiondata[n].answer=true
                          }
                        }
                      }
                      break;
                    case "problem":
                      ls_question.editorTxt = value;
                      break;
                  }
                }
                _this.$set(
                  _this.pagedata.questiondata,
                  i,
                  $.extend(
                    true,
                    {},
                    _this.pagedataTemp.questiondata[0],
                    ls_question
                  )
                );
              }
            }
          } else {
            _this.showmsg(res.msg);
          }
        });
    },
    /**
     * 从问卷列表进入  编辑问卷题目
     * 答卷列表 url为id
     * 根据 url 得到id 请求ajax获取设置好的题目
     **/
    getQuestion() {
      var _this = this;
      if (_this.$match(window.location.href, "id") == null) {
        return false;
      }
      _this
        .$http({
          method: "get",
          url:
            "/questions?exam_id=" +
            _this.$match(window.location.href, "id") +
            ""
        })
        .then(res => {
          if (res.status == 200) {
            res = res.data;
            _this.pagedata.titledata.title = res.data.title;
            _this.pagedata.titledata.editorTxt = res.data.explain;
            _this.pagedata.topdata.exam_id = res.data.id;
            _this.pagedata.topdata.testTime = res.data.testtime;
            _this.pagedata.topdata.sort = res.data.sort;
            _this.pagedata.topdata.designated = res.data.designated;
            _this.pagedata.topdata.opentest =
              res.data.status == 0 ? false : true;
            let list = res.data.list;
            let ls_question = {};
            let ls_option = {
              introduce: {}
            };
            if (list.length < 1 || list == undefined) {
              _this.pagedata.questiondata = [];
            } else {
              for (let i in list) {
                for (let name in list[i]) {
                  let value = list[i][name];
                  switch (name) {
                    case "question_id":
                    case "score":
                    case "answer":
                    case "note":
                    case "sort":
                    case "analysis":
                    case "questionType":
                      ls_question[name] = value.toString();
                      break;
                    case "problem":
                      ls_question.editorTxt = value;
                      break;
                    case "optiondata":
                      ls_question.optiondata = [];
                      value.forEach((currentValue, index, arr) => {
                        ls_question.optiondata.push({
                          answer:
                            currentValue.answer == "true" ||
                            currentValue.answer == true
                              ? true
                              : false,
                          text: currentValue.text,
                          img: currentValue.img,
                          option_id: currentValue.id,
                          introduce: {
                            isUrl: currentValue.isUrl,
                            url:
                              currentValue.isUrl == 1
                                ? currentValue.introduce
                                : "",
                            editorTxt:
                              currentValue.isUrl == 0
                                ? currentValue.introduce
                                : ""
                          }
                        });
                      });
                      break;
                  }
                }
                _this.$set(
                  _this.pagedata.questiondata,
                  i,
                  $.extend(
                    true,
                    {},
                    _this.pagedataTemp.questiondata[0],
                    ls_question
                  )
                );
              }
            }
          } else {
            _this.showmsg(res.msg);
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media screen and (min-width: 1000px) {
  .paperbg {
    background: url(../assets/images/paper.jpg) no-repeat top center !important;
    background-size: 1000px !important;
    background-color: #61cbff !important;
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
    margin: auto;
    position: relative;
  }
}
@media screen and (max-width: 850px) {
  .body > p {
    width: 100%;
  }
  .content {
    width: 100%;
    left: 0;
    margin-left: 0;
  }
  .icon-home {
    position: fixed;
    font-size: 25px;
    right: 0;
  }
  .btn-closetop {
    position: fixed;
    z-index: 66;
    color: #fff;
    bottom: 0;
    width: 90%;
    left: 5%;
    bottom: 10px;
  }
  .body >>> .navtop {
    top: 0px;
  }
  .body >>> .title {
    margin-top: 35px;
  }
}
.content {
  padding-top: 40px;
}
</style>
