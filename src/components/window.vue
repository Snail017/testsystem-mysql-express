<template>
 <div v-if="windowdata.haswindow">
   <div class="window "><i class="col-md-1 iconfont icon-guanbi"  @click="windowdata.haswindow=false"></i>
    <Row>
       <Col span="2">标题</Col>
       <Col span="10">
        <Input v-model="windowdata.title"/></Input>
       </Col>
    </Row>
    <Row>
       <Col span="2">说明</Col>
       <Col span="10">
        <testeditor  :editordata="windowdata"></testeditor>
       </Col>
    </Row>
   </div>
   <div class="bg" @click="windowdata.haswindow=false"></div>
 </div>
</template>
<script>
    import testeditor from '@/components/testeditor.vue'

    export default {
      name: 'window',
        components: {
            testeditor
        },
        props:['windowdata'],
        data () {
          return {
          }
        },
        mounted(){

        }
    }
</script>
<style scoped>
    .window{background:#fff;width: 800px;position: fixed;top:30%;left: 50%;margin-left:-400px;padding:1rem;border-radius: 5px;z-index: 3;}
    .window .icon-guanbi{position: absolute;right: 1px;font-size: 30px;top:-5px;color: grey;}
    .window input{border-radius: 3px;border:1px solid #ccc;}
    @media screen and (max-width: 1000px){
        .window{width:80%;left:10%;margin-left: 0;}
    }

</style>
