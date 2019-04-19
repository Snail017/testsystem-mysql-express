<template>
 <div v-if="windowdata.haswindow">
   <div class="window "><i class="col-md-1 iconfont icon-guanbi"  @click="windowdata.haswindow=false"></i>
     <div class="form-group row"><label class="col-sm-1 col-form-label">标题</label><div class="col-sm-10 "><input type="text" class="form-control" v-model="windowdata.title"/></div></div>
     <div class="form-group row"><label class="col-sm-1 col-form-label">说明</label><div class="col-sm-10"><testeditor  :editordata="windowdata"></testeditor></div></div>
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
