<template>
    <div>
        <div class="nav-right">
            <i class="iconfont icon-zuo"  v-if="!navShow"  @mouseenter="navShow=true" @mouseout="navShow=false"></i>
            <div v-if="navShow"  @mouseenter="navShow=true" @mouseleave="navShow=false">
               <div>
                   <p>{{topdata.gross_score}}</p>
                   <p>试卷总分</p>
               </div>
               <div>
                   <p>{{questiondata.length>0?questiondata.length:0}}</p>
                   <p>试卷题目数</p>
               </div>
               <div v-if="ispage">
                   <p>{{countdown}}</p>
                   <p>考试倒计时</p>
               </div>
           </div>
        </div>
        <div class="st_top_content" v-if="topCofig.topShow">
            <div class="header clearfix">
                <i class="iconfont icon-guanbi" @click="topCofig.topShow=false"></i>
                <Select  placeholder="请指定考试人" v-model="topdata.designated" multiple filterable>
                    <Option v-for="item in users" :value="item.id" :key="item.id">[{{item.id}}]{{item.Nickname}}</Option>
                </Select>
                <Row>
                    <Col span="6">
                      <label>立即发布 <input type="checkbox"  v-model="topdata.opentest"></label>
                    </Col>
                    <Col span="8">
                      <label>隐藏系统考题 <input type="checkbox"  v-model="topdata.sort"></label>
                    </Col>
                    <Col span="8">
                      <label>答卷时间 <Input type="text" style="width:80px;" v-model="topdata.testTime" placeholder="分钟"></Input> </label>
                    </Col>
                </Row>
                <div class="footer">
                    <div>
                        <Button type="primary" @click.stop="$emit('checkdata')">完成编辑</Button>
                        <router-link tag="Button" type="button"  target="_blank" :to="{path:'/paper',query:{paper_id:topdata.exam_id}}" ><i class="iconfont icon-yanjing"></i>预览</router-link>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
          name: 'top',
          props:['topdata','questiondata','topCofig','ispage'],
          data () {
            return {
                users:[],
                navShow:0,
                countdown:0,
            }
          },
          mounted(){
              this.getPerson();
          },
          methods:{
              getPerson(){
                  var _this=this;
                  this.$http({
                      method:"post",
                      url:"/users",
                      data:{
                          type:""
                      }
                  }).then(res=>{
                      if(res.data.code==200) _this.users=res.data.data;
                       
                  })
              },

      }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .iconfont{font-size: 12px;}
    .ivu-btn{margin-left: 5px;}
    .icon-guanbi{margin-right: 5px;font-size: 25px;position: absolute;right: 0;top:0;}
    .st_top_content{position: fixed;left:0;top:0;width: 100%;height: 100%;background: #000000b8;z-index: 3;}
    .mulselect>>>.multiselect{position: fixed;width: 500px;font-size: 12px;}
    .mulselect>>>.multiselect__input, .mulselect>>>.multiselect__single{font-size: 12px;}
    .header{overflow: hidden;width: 600px;background: #fff;padding:20px 40px 0;margin: auto;margin-top: 10%;position: relative}
    .header>div{padding: 10px 0;}
    .header label{vertical-align: middle;margin: 0;width: 49%;}
    .header label:before{content:'*';color: red;padding: 0 5px;}
    .footer:before{content:'';height: 1px;margin: 0 -40px 10px;background: #ddd;display: block;}
    .footer{text-align: center;}
    .footer .btn{width: 100px;margin:0 20px;}
    .footer>div{width: 300px;margin: auto;}
    .nav-right{position: fixed;right: 50%;margin-right: -500px;color: #fff;top:30%;z-index: 3; }
    .nav-right .icon-zuo{font-size: 35px;color: #1d6bef ;margin-top: 10px;position: absolute;right: 0px;}
    .nav-right>div{background: linear-gradient(to right, #0088ff ,blue, #1568d5);display: flex;border-radius:5px 0 0 5px;}
    .nav-right p{padding:5px 10px;text-align: center;font-size: 14px;}
    .nav-right p:nth-of-type(1){font-size: 25px;font-weight: bold;}
  
    @media screen and (max-width: 850px){
        .header{width: 90%;margin: auto;}
        .mulselect>>>.multiselect{width: 300px;;}
    }
</style>
