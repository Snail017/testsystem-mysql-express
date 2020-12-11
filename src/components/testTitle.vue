<template>
  <div>
    <div class="title" @click="titledata.haswindow = true">
      <h1 class="st_title">
        {{ titledata.title == "" ? "请输入标题" : titledata.title }}
      </h1>
      <div
        v-html="
          titledata.editorTxt == '' ? '请输入副标题' : titledata.editorTxt
        "
        class="st_subtitile"
      ></div>
    </div>
    <Window :windowdata="titledata"></Window>
  </div>
</template>

<script>
import Window from "@/components/window.vue";
export default {
  name: "testTitle",
  components: {
    Window,
  },
  props: ["titledata"],
};
</script>

<style scoped lang="scss">
.title {
  cursor: pointer;
  background: #fff;
  width: 1000px;
  margin:0 auto;
  border-bottom: 1px solid #ddd;
}
.st_subtitile {
  color: #555555;
  text-align: left;
  font-size: rem1(28);
  margin: rem1(10);
  text-align: center;
}
.st_title {
  font-size: rem1(30);
  font-weight: bold;
  color: #f53d05;
  vertical-align: middle;
  text-align: center;
  margin: rem1(10) 0;
  padding: 0;
  line-height: 24px;
}
@media screen and (max-width: 800px) {
  .title {
    width: 100%;
  }
}
</style>