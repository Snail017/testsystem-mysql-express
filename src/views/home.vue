<template>
  <div class="content">
    <Row
      class="swap_tabs"
      type="flex"
      justify="center"
      :gutter="16"
      align="middle"
    >
      <Col
        :md="3"
        :xs="8"
        :class="isActive == 0 ? 'active_tab' : ''"
        @click.native="isActive = 0"
      >
        <i class="iconfont icon-shijuan"></i>
        我的问卷
      </Col>
      <Col
        :md="3"
        :xs="8"
        :class="isActive == 1 ? 'active_tab' : ''"
        @click.native="isActive = 1"
      >
        <i class="iconfont icon-shijuanpigai"></i>
        我的答卷
      </Col>
    </Row>
    <div class="seach" v-if="seashShow">
      <Input :clearable="true" placeholder="请输入试卷名进行搜索..." />
      <span @click="(searchVal = ''), (seashShow = false)" class="st_cancel"
        >取消</span
      >
    </div>
    <div class="st_tih3" v-else>
      <span>
        {{ isActive == 0 ? "问卷列表" : "答卷列表" }}
      </span>
      <div>
        <i
          class="iconfont icon-jiaru"
          v-if="isActive === 0"
          @click="$router.push('/questionnaire')"
        ></i>
        <i
          class="iconfont icon-filter"
          @click="isHide ? (isHide = false) : (isHide = true)"
        ></i>
        <i class="iconfont icon-sousuo" @click="seashShow = true"></i>
        <div v-show="isHide" class="s-seach">
          <div
            class="clearfix"
            v-for="(item, index) in stap"
            :key="index"
            @click="
              (isNoP = index),
                (examType = $event),
                $refs.myAnswer.answerList(),
                (isHide = false)
            "
          >
            <span :class="isNoP === index ? 'blue_color' : ''">{{ item }}</span>
            <i class="iconfont icon-wancheng1" v-show="isNoP === index"></i>
          </div>
        </div>
      </div>
    </div>
    <homeAnswer v-show="isActive == 1" ref="myAnswer"></homeAnswer>
    <homeQuestion v-show="isActive == 0" ref="myQues"></homeQuestion>
  </div>
</template>

<script>
import homeAnswer from "@/views/homeAnswer";
import homeQuestion from "@/views/homeQuestion";
export default {
  name: "home",
  components: {
    homeAnswer,
    homeQuestion,
  },
  data() {
    return {
      isActive: 0,
      isHide: false,
      seashShow: false,
      isNoP: Number,
      stap: ["全部", "未考试", "已完成", "回收站"],
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.content {
  width: 1000px;
  margin: rem1(20) auto 0;
  text-align: center;
}
.seach {
  display: flex;
  padding: rem(5);
  .st_cancel {
    float: right;
    width: rem(50);
    @include flexCenter();
  }
}
.s-seach {
  position: absolute;
  top: rem1(60);
  right: rem1(20);
  width: rem1(220);
  padding: 0 rem1(20);
  background: #fff;
  box-shadow: 0px rem1(4) rem1(20) 0px rgba(219, 219, 219, 0.61);
  border-radius: rem1(8);
  z-index: 3;
  font-size: rem1(26);
  > div {
    display: flex;
    align-items: center;
    margin: rem1(10) 0;
  }
  span {
    width: rem1(150);
    text-align: left;
    @include cs(#191a27, 28);
    &.blue_color {
      color: #1d51e0;
    }
  }
  .iconfont.icon-wancheng1 {
    color: #1d51e0;
    font-size: rem1(28);
  }
}
.st_tih3 {
  position: relative;
  align-items: center;
  margin: rem1(10) 0;
  padding: 0 rem1(20);
  font-size: rem(13);
  display: none;
  > span {
    flex: 3;
    color: #000;
    align-content: center;
    text-align: left;
  }
  > div {
    @include fac();
    text-align: right;
    > img {
      @include wh(40);
      margin: 0 rem1(10);
    }
    .iconfont {
      font-size: rem1(35);
      color: #353535;
      vertical-align: middle;
      margin: 0 rem1(10);
    }
  }
}
.swap_tabs {
  div {
    border-radius: rem1(4);
    color: #fff;
    font-size: rem1(26);
    background: linear-gradient(52deg, #99b2ee 0%, #d3d3e0 100%);
    margin: 0 rem1(10);
    padding: rem1(5) 0;
    &.active_tab {
      background: linear-gradient(52deg, #033786 0%, #5d7eaf 100%);
      color: #e6e6ec;
      box-shadow: 2px 2px 3px #cab3b3;
    }
  }
}
@media screen and (max-width: 1000px) {
  .content {
    width: 100%;
  }
  .st_tih3 {
    display: flex;
  }
}
</style>