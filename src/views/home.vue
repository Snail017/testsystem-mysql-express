<template>
  <div class="content">
    <Row class="swap_tabs" type="flex" justify="center">
      <Col
        :md="3"
        :xs="6"
        :class="isActive == 0 ? 'active_tab' : ''"
        @click="isActive = 0"
      >
        我的问卷
      </Col>
      <Col
        :md="3"
        :xs="6"
        :class="isActive == 1 ? 'active_tab' : ''"
        @click="isActive = 1"
      >
        我的答卷
      </Col>
    </Row>
    <homeAnswer v-show="isActive == 0"></homeAnswer>
    <homeQuestion v-show="isActive == 1"></homeQuestion>
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
    };
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.content {
  width: 100%;
  margin: auto;
  text-align: center;
}
.swap_tabs {
  display: flex;
  justify-content: center;
  padding-top: rem(20);
  div {
    height: rem(60);
    border-radius: rem(4);
    border: 1px solid #dcdee2;
    color: #838383;
    text-align: center;
    line-height: rem(60);
    font-size: rem(26);

    &.active_tab {
      border-color: #1d51e0;
      color: #1d51e0;
    }
  }
}
</style>