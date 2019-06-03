<template>
  <div class="form-horizontal answer_body">
    <div class="form-group row answer_head">
      <div class="col-sm-2">
        <router-link tag="span" class="btn btn-outline-primary" to="/questionnaire">
          <i class="iconfont icon-76xinzeng"></i>我的问卷
        </router-link>
      </div>
      <div class="col-sm-3 st_sear">
        <input type="text" class="form-control" placeholder="请输入问卷名进行搜索..." v-model="title">
        <i class="iconfont icon-chazhao" @click="examType='search'"></i>
      </div>
      <div class="col-sm-2">
        <select name id class="form-control" v-model="examType">
          <option value="unfinish">未发布</option>
          <option value="doing">发布中</option>
          <option value="finish">已完成</option>
        </select>
      </div>
      <div class="col-sm-5" style="text-align: right">
        <span class="btn btn-outline-info" @click="examType='recycle'">
          <i class="iconfont icon-huishouzhan"></i>回收站
        </span>
      </div>
    </div>
    <template v-if="testdata!=''">
      <div
        class="form-group row answer_list"
        v-for="(item,index) in testdata"
        :class="{'bg_yellow':item.status==0,'bg_green':item.status==1}"
      >
        <div class="col-sm-5 row">
          <span class="col-sm-3">ID:{{item.id}}</span>
          <span class="col-sm-8 st_title">{{item.title}}</span>
        </div>
        <div class="col-sm-7" style="text-align: right">
          <span class="st_btn green" v-if="item.status==0" @click.stop="ExamStatus(item.id,1)">
            <i class="iconfont icon-weibiaoti--1"></i>发布考试
          </span>
          <span class="st_btn lightgreen" v-if="item.status==0" @click.stop="ExamStatus(item.id,2)">
            <i class="iconfont icon-weibiaoti--1"></i>作废
          </span>
          <router-link
            tag="span"
            :to="{path:'/questionnaire',query:{id:item.id}}"
            class="st_btn lightgreen"
            v-if="item.status!=2"
            @click.stop="ExamStatus(item.id,2)"
          >
            <i class="iconfont icon-weibiaoti--1"></i>编辑
          </router-link>
          <router-link
            tag="span"
            :to="{path:'/answer_list',query:{exam_id:item.id}}"
            class="st_btn green"
            v-if="item.status!=0||examType==3"
          >
            <i class="iconfont icon-yanjing"></i>答题情况
          </router-link>
          <span class="st_btn blue" v-if="item.status==1" @click.stop="ExamStatus(item.id,0)">
            <i class="iconfont icon-weibiaoti--"></i>结束考试
          </span>
          <span class="st_btn blue" @click.stop="deleteExam(item.id,index)" v-if="item.status!='1'">
            <i class="iconfont icon-huishouzhan"></i>删除
          </span>
          <span v-if="item.status=='1'">
            <i class="iconfont icon-wancheng1"></i>
            完成{{item.answer_count}}人
          </span>&nbsp;
          <span>
            <i class="iconfont icon-shijian"></i>2017-12-12 12:12
          </span>
        </div>
      </div>
      <pagenation v-if="pagedata.page_total>1" :pagedata="pagedata" @page="page"></pagenation>
    </template>
    <div class="st_null" v-if="testdata==''">
      <i class="iconfont icon-wushuju"></i>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
import pagenation from "@/components/pagenation";
export default {
  name: "homeQuestion",
  data() {
    return {
      testdata: [],
      title: "",
      pagedata: {
        data_total: "",
        p: "1", //当前第几页
        page_rows: 1, //每页n条数据
        page_total: "" //共多少数据
      },
      examType: "doing",
      examTypeUrl: "",
      layerdata: {
        msg: "",
        flag: false
      }
    };
  },
  components: {
    pagenation
  },
  watch: {
    title: {
      handler(newVal) {
        if (newVal != "") {
          this.examType = "search";
          this.examTypeUrl = "/Exam/GetList?status=&title=" + newVal + "";
          this.Exam(1);
        } else {
          this.examType = "doing";
        }
      }
    },
    examType: {
      handler(newVal) {
        var _this = this;
        switch (newVal) {
          case "finish":
            this.examTypeUrl = "/Exam/GetList?status=2";
            break;
          case "doing": //进行中的考试
            this.examTypeUrl = "/Exam/GetList?status=1";
            break;
          case "recycle": //进行中的考试
            this.examTypeUrl = "/Exam/GetList?status=3";
            break;
          case "unfinish":
            this.examTypeUrl = "/Exam/GetList?status=0";
            break;
          case "search":
            this.examTypeUrl =
              "/Exam/GetList?status=&title=" + _this.title + "";
            break;
        }
        this.Exam(1);
      },
      immediate: true
    }
  },
  mounted() {
    // this.$loading.show();
    var ls_examType = this.$match(window.location.hash, "examType");
    if (
      ls_examType == "doing" ||
      ls_examType == "unfinish" ||
      ls_examType == "finish"
    ) {
      this.examType = ls_examType;
    }
  },
  methods: {
    ExamStatus(exam_id, type) {
      var _this = this;
      var ls_msg = "";
      if (type == 0) {
        ls_msg = "确定结束考试？";
      } else if (type == 1) {
        ls_msg = "确定发布考试？";
      } else if (type == 2) {
        ls_msg = "确定作废本次试卷？";
      }
      _this.$confirm(ls_msg, {
        btn: ["确定", "取消"],
        btnFun: [
          function() {
            _this
              .$http({
                mtehod: "post",
                url: "/Exam/ExamStatus",
                data: {
                  exam_id: exam_id,
                  status: type
                }
              })
              .then(res => {
                res = JSON.parse(res);
                if (res.status == 0) {
                  _this.Exam(_this.pagedata.p);
                }
                _this.$msg(res.msg);
              });
          },
          function() {
            _this.$hide();
          }
        ]
      });
    },
    deleteExam(exam_id, index) {
      var _this = this;
      _this.$confirm("确定删除？", {
        btn: ["确定", "取消"],
        btnFun: [
          function() {
            _this
              .$http({
                method: "post",
                url: "/Exam/ExamStatus",
                data: {
                  exam_id: exam_id,
                  status: 3
                }
              })
              .then(res => {
                res = JSON.parse(res);
                if (res.status == 0) {
                  _this.Exam(_this.pagedata.p);
                  _this.$msg("删除成功");
                } else {
                  _this.$msg(res.msg);
                }
              });
          },
          function() {
            _this.$hide();
          }
        ]
      });
    },
    page(res) {
      if (res == "next") {
        res = Number(this.pagedata.p) + 1;
      } else if (res == "first") {
        res = 1;
      } else if (res == "last") {
        res = this.pagedata.page_total;
      } else if (res == "prev") {
        res = Number(this.pagedata.p) - 1;
      }
      if (res <= this.pagedata.page_total && res > 0) {
        this.Exam(res, this.examType);
      }
    },
    Exam(p) {
      var _this = this;
      _this
        .$http({
          method: "get",
          url: _this.examTypeUrl,
          data: {
            pagecount: p,
            page: "10"
          }
        })
        .then(res => {
          res = JSON.parse(res);
          _this.testdata = res.data.data;
          _this.$set(_this.pagedata, "data_total", res.data.page_total);
          _this.$set(_this.pagedata, "p", res.data.p);
          _this.$set(_this.pagedata, "page_rows", res.data.page_rows);
          _this.$set(_this.pagedata, "page_total", res.data.page_total);
        });
    }
  }
};
</script>

<style scoped>
.bg_yellow {
  background: #d4cbc0 !important;
}
.bg_green {
  background: #b5dcd7 !important;
}
.icon-76xinzeng {
  margin: 0 5px;
}
.answer_body {
  width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  min-height: 100%;
}
.st_sear {
  position: relative;
}
.icon-chazhao {
  position: absolute;
  right: 20px;
  top: 50%;
  margin-top: -15px;
  font-size: 20px;
}
.answer_list {
  background: #cfd6dd;
  color: #2d2525;
  padding: 10px;
  border-radius: 5px;
}
.answer_head {
  border-bottom: 1px solid #ddd;
  padding-bottom: 30px;
}
.st_btn {
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}
.answer_list:hover {
  box-shadow: 0 0 3px #30a6f5;
}
.st_title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.icon-wushuju {
  font-size: 100px;
}
.st_null {
  text-align: center;
  margin: auto;
  font-size: 25px;
}

@media screen and (max-width: 800px) {
  .answer_body {
    width: 100%;
    padding: 10px;
    margin: 0;
  }
}
</style>