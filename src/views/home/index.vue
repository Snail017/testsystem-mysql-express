<template>
  <div class="content">
    <div class="swap_tabs">
      <span :class="isActive == 0 ? 'active_tab' : ''" @click="isActive = 0"
        >我的问卷</span
      >
      <span :class="isActive == 1 ? 'active_tab' : ''" @click="isActive = 1"
        >我的答卷</span
      >
    </div>
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
    padding-top: rem1(20);

    span {
        width: 25%;
        height: rem1(60);
        border-radius: rem1(4);
        border: 1px solid #DCDEE2;
        color: #838383;
        text-align: center;
        line-height: rem1(60);
        font-size: rem1(26);

        &.active_tab {
            border-color: #1D51E0;
            color: #1D51E0;
        }
    }
}
</style>