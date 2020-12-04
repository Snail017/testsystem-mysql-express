<template>
 <div v-if="windowdata.haswindow">
   <div class="window ">
     <!-- <i class="col-md-1 iconfont icon-guanbi"  @click="windowdata.haswindow=false"></i> -->
    <Row >
       <Col :md="2" :xs="4">标题</Col>
       <Col :md="22" :xs="20">
         <Input v-model="windowdata.title"/></Input>
       </Col>
    </Row>
    <Row>
       <Col :md="2" :xs="4">说明</Col>
       <Col :md="22" :xs="20">
        <testeditor  :editordata="windowdata"></testeditor>
       </Col>
    </Row>
   </div>
   <div class="bg" @click="windowdata.haswindow=false"></div>
 </div>
</template>
<script>
import testeditor from "@/components/testeditor.vue";

export default {
  name: "window",
  components: {
    testeditor,
  },
  props: ["windowdata"],
  data() {
    return {};
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.bg{
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  background: #000;
  opacity: 0.6;
  top: 0;
  z-index: 5;
}
.window {
  background: #fff;
  width: 80%;
  position: fixed;
  top: 30%;
  left: 10%;
  padding: 1rem;
  border-radius: 5px;
  z-index: 6;
}
.window .icon-guanbi {
  position: absolute;
  right: 0px;
  font-size: rem(30);
  top: rem(-10);
  padding: rem(10);
  color: grey;
}
.window input {
  border-radius: 3px;
  border: 1px solid #ccc;
}
@media screen and (max-width: 800px) {
  .window{
    top:rem(20);
    width: 95%;
    left: 2.5%;
    padding: 0 rem(10);
  }
}
</style>
