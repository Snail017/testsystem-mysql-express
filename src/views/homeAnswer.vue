<template>
  <div class="form-horizontal answer_body">
    <Row class="answer_head" :gutter="16">
      <Col :lg="8" :xs="24" class="st_sear">
        <Input
          type="text"
          placeholder="请输入问卷名进行搜索..."
          size="large"
          v-model="title"
          @on-enter="answerList()"
        ></Input>
      </Col>
      <Col :lg="5" :xs="24">
        <Select @change="examType=$event; answerList()" size="large">
          <Option value="-1">全部</Option>
          <Option value="0">未考试</Option>
          <Option value="1">已完成</Option>
        </Select>
      </Col>
      <Col :lg="5" :xs="24" style="float:right">
        <Button type="info" @click="examType=2;answerList()">
          <i class="iconfont icon-huishouzhan"></i>回收站
        </Button>
      </Col>
    </Row>
    <template v-if="testdata!=''">
      <Row
        class="answer_list"
        v-for="(item,index) in testdata"
        :key=index
        :class="{'bg_yellow':item.save==0,'bg_green':item.status==1}"
      >
        <Col :xs="10">ID:{{item.hasOwnProperty('status')?item.id:item.exam_id}}[{{item.title}}]</Col>
        <Col :xs="14" style="text-align: right">
          <router-link
            tag="span"
            :to="{path:'/paper',query:{paper_id:item.id}}"
            class="st_btn green"
            v-if="item.status==0"
          >
            <i class="iconfont icon-weibiaoti--1"></i>开启考试
          </router-link>
          <span class="st_btn blue" @click="deleteAnswer(item.id)" v-if="item.status==1">
            <i class="iconfont icon-huishouzhan"></i>删除
          </span>
          <router-link
            :to="{path:'/review',query:{paper_id:item.id}}"
            class="st_btn green"
            v-if="item.status==1"
          >
            <i class="iconfont icon-yanjing"></i>查看
          </router-link>
          <span>
            <i class="iconfont icon-shijian"></i>
            {{item.updatedAt}}
          </span>
        </Col>
      </Row>
      <pagenation v-if="pagedata.page_total>1" :pagedata="pagedata" @page="page"></pagenation>
    </template>
    <div class="st_null" v-if="!testdata">
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
      examType: -1,
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
  mounted() {
    this.answerList();
  },
  methods: {
    deleteAnswer(exam_id) {
      var _this = this;
      _this.$confirm("确定删除该试卷？", {
        btn: ["确定", "取消"],
        btnFun: [
          function() {
            _this
              .$http({
                method: "patch",
                url: "/answer",
                params: {
                  exam_id: exam_id,
                  status: 2
                }
              })
              .then(res => {
                if (res.status == 200) {
                  _this.answerList();
                  _this.$hide();
                  _this.$msg(res.data.msg);
                }
              });
          }
        ]
      });
    },
    answerList() {
      var _this = this;
      this.$http({
        method: "get",
        url: "/answerList",
        params: {
          pagecount: _this.pagedata.p,
          page: "10",
          title: _this.title,
          status: _this.examType
        }
      }).then(res => {
        res = res.data;
        _this.testdata = res.data;
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
        // this.answerList(res, this.examType);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '_CSS/homeAQ.scss';
</style>