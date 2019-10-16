<template>
  <div class="st_answerlist">
    <div>
      <div class="st_sear">
        <Input
          type="text"
          v-model="ser_id"
          placeholder="请输入id或者用户名进行搜索..."
          @input="getanswerlist(ser_id)"
        >
          <Button slot="append" icon="ios-search" @click="getanswerlist(ser_id)"></Button>
        </Input>
      </div>
      <table v-if="listdata.length>0" border="1" cellspacing="0" cellpadding="0">
        <tr>
          <th>用户ID</th>
          <th>用户名</th>
          <th>最后提交答卷时间</th>
          <th>考卷详情</th>
          <th>成绩</th>
        </tr>
        <tr v-for="item in listdata">
          <td>{{item.user_id}}</td>
          <td>{{item.Nickname}}</td>
          <td>{{item.updatedAt}}</td>
          <td @click="examDetail(item.service_id)">
            <router-link
              :to="{path:'/checkpaper',query:{service_id:item.service_id,paper_id:exam_id}}"
              target="_blank"
              class="btn btn-primary"
            >查看考卷</router-link>
          </td>
          <td>{{item.score_sum}}</td>
        </tr>
      </table>
      <div class="st_null" v-if="listdata.length<1">
        <i class="iconfont icon-wushuju"></i>
        <p>暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "answer_list",
  data() {
    return {
      listdata: [],
      ser_id: "",
      exam_id: this.$match(window.location.hash, "exam_id")
    };
  },
  mounted() {
    this.getanswerlist("");
  },
  methods: {
    examDetail(service_id) {
      var _this = this;
      _this.$http({
        method: "get",
        url: "/Exam/GetAnswer",
        data: {
          service_id: service_id,
          exam_id: _this.$match(window.location.hash, "exam_id")
        }.then(res => {})
      });
    },
    getanswerlist(res) {
      var _this = this;
      _this
        .$http({
          method: "get",
          url: "/answerUser",
          params: {
            exam_id: _this.match(window.location.hash, "exam_id"),
            content: res
          }
        })
        .then(res => {
          if (res.status == 200) {
            _this.listdata = res.data.data;
          }
        });
    },
    /**
     *   从url中正则匹配得到数据
     **/
    match(search, name) {
      var reg = new RegExp("[?&]" + name + "=([^&]*)(&|$)", "i");
      var r = search.match(reg);
      if (r != null) return unescape(r[1]);
      return null;
    }
  }
};
</script>

<style scoped>
table {
  text-align: center;border: #f7f7ff;
}
table td,
table th {
  padding: 5px 10px;
}
table tr:nth-of-type(1){
  background: #ddd!important;
}
.st_null {
  text-align: center;
  margin: auto;
  font-size: 25px;
}
.icon-wushuju {
  font-size: 100px;
}
.st_answerlist {
  width: 1000px;
  margin: auto;
  padding: 40px 10px;
  background: #fff;
  min-height: 100%;
}
.st_answerlist table {
  width: 100%;
}
.st_sear {
  position: relative;
  margin: 20px 0;
}
.icon-chazhao {
  position: absolute;
  right: 20px;
  top: 50%;
  margin-top: -15px;
  font-size: 20px;
}

@media screen and (max-width: 1000px) {
  .st_answerlist {
    width: 100%;
  }
}
</style>