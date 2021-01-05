<template>
  <div class="form-horizontal answer_body">
    <Row class="answer_head" :gutter="16">
      <Col :lg="8" :xs="24" class="st_sear">
        <Input
          type="text"
          placeholder="请输入问卷名进行搜索..."
          size="large"
          v-model="title"
          @on-enter="Exam(1)"
        ></Input>
      </Col>
      <Col :lg="5" :xs="24">
        <Select
          @change="
            examType = $event;
            answerList();
          "
          size="large"
        >
          <Option value="-1">全部</Option>
          <Option value="0">未发布</Option>
          <Option value="1">发布中</Option>
          <Option value="2">已完成</Option>
        </Select>
      </Col>
      <Col :xs="5" :md="3" style="float: right">
        <Button
          type="info"
          @click="
            examType = 3;
            answerList();
          "
        >
          <i class="iconfont icon-huishouzhan"></i>回收站
        </Button>
      </Col>
    </Row>
    <template v-if="!testdata">
      <Row
        class="answer_list"
        v-for="(item, index) in testdata"
        :key="index"
        :class="{ bg_yellow: item.status == 0, bg_green: item.status == 1 }"
      >
        <Col :xs="6">ID:{{ item.id }}[{{ item.title }}]</Col>
        <Col :xs="18" style="text-align: right">
          <span
            class="st_btn green"
            v-if="item.status == 0"
            @click.stop="ExamStatus(item.id, 1)"
          >
            <i class="iconfont icon-weibiaoti--1"></i>发布考试
          </span>

          <router-link
            tag="span"
            :to="{ path: '/questionnaire', query: { id: item.id } }"
            class="st_btn lightgreen"
            v-if="item.status != 2"
            @click.stop="ExamStatus(item.id, 2)"
          >
            <i class="iconfont icon-weibiaoti--1"></i>编辑
          </router-link>
          <router-link
            tag="span"
            :to="{ path: '/answer_list', query: { exam_id: item.id } }"
            class="st_btn green"
            v-if="item.status != 0 || examType == 3"
          >
            <i class="iconfont icon-yanjing"></i>答题情况
          </router-link>
          <span
            class="st_btn lightgreen"
            v-if="item.status == 1"
            @click.stop="ExamStatus(item.id, 2)"
          >
            <i class="iconfont icon-weibiaoti--1"></i>考试完成
          </span>
          <span
            class="st_btn blue"
            v-if="item.status == 1"
            @click.stop="ExamStatus(item.id, 0)"
          >
            <i class="iconfont icon-weibiaoti--"></i>取消发布
          </span>
          <span
            class="st_btn blue"
            @click.stop="ExamStatus(item.id, 3)"
            v-if="(item.status != 3) & (item.status != 1)"
          >
            <i class="iconfont icon-huishouzhan"></i>加入回收站
          </span>
          <span
            class="st_btn blue"
            @click.stop="deleteExam(item.id, index)"
            v-if="item.status == 3"
          >
            <i class="iconfont icon-huishouzhan"></i>删除
          </span>
          <span>
            <i class="iconfont icon-shijian"></i>
            {{ item.updatedAt }}
          </span>
        </Col>
      </Row>
      <pagenation
        v-if="pagedata.page_total > 1"
        :pagedata="pagedata"
        @page="page"
      ></pagenation>
    </template>
    <div class="st_null" v-if="testdata == ''">
      <i class="iconfont icon-wushuju"></i>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script>
import pagenation from "@/components/pagenation";
import { VerifyquestionnaireList } from "@/api";
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
        page_total: "", //共多少数据
      },
      examType: -1,
      examTypeUrl: "",
      layerdata: {
        msg: "",
        flag: false,
      },
    };
  },
  components: {
    pagenation,
  },
  watch: {
    examType: {
      handler(newVal) {
        this.examTypeUrl = "/questionnaireList?status=" + this.examType;
        this.Exam(1);
      },
      immediate: true,
    },
  },
  mounted() {
    var ls_examType = this.$route.query.examType;
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
      } else if (type == 3) {
        ls_msg = "确定删除试卷？";
      }
      _this.$confirm(ls_msg, {
        btn: ["确定", "取消"],
        btnFun: [
          function () {
            _this
              .$http({
                method: "patch",
                url: "/Exam",
                data: {
                  exam_id: exam_id,
                  status: type,
                },
              })
              .then((res) => {
                if (res.status == 200) {
                  _this.Exam(_this.pagedata.p);
                }
                _this.$msg(res.data.msg);
              });
          },
          function () {
            _this.$hide();
          },
        ],
      });
    },
    deleteExam(exam_id, index) {
      var _this = this;
      _this.$confirm("确定删除？", {
        btn: ["确定", "取消"],
        btnFun: [
          function () {
            _this
              .$http({
                method: "delete",
                url: "/Exam",
                data: {
                  exam_id: exam_id,
                  status: 3,
                },
              })
              .then((res) => {
                if (res.status == 200) {
                  _this.Exam(_this.pagedata.p);
                  _this.$msg("删除成功");
                } else {
                  _this.$msg(res.data.data.msg);
                }
              });
          },
          function () {
            _this.$hide();
          },
        ],
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
      VerifyquestionnaireList({
        pagecount: p,
        page: "10",
        title: _this.title,
      }).then((res) => {
        res = res.data;
        _this.testdata = res.data.users;
        _this.$set(_this.pagedata, "data_total", res.data.page_total);
        _this.$set(_this.pagedata, "p", res.data.p);
        _this.$set(_this.pagedata, "page_rows", res.data.page_rows);
        _this.$set(_this.pagedata, "page_total", res.data.page_total);
      });
    },
  },
};
</script>
<style scoped lang="scss">
@import "_CSS/homeAQ.scss";
</style>