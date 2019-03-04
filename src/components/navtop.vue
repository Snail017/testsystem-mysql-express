<template>
   <div>
       <ul class="navtop nav" >
           <!--<li class="col-md-2"  @click.stop="add('name')"><i class="icon iconfont icon-icon-person"></i>姓名</li>-->
           <li  @click.stop="add('radio')"><i class="icon iconfont icon-danxuan"></i>单选</li>
           <li @click.stop="add('checkbox')"><i class="icon iconfont icon-danxuankuang-copy"></i>多选</li>
           <li @click.stop="add('judge')"><i class="icon iconfont icon-plus-judgement"></i>判断</li>
           <li @click.stop="add('QA')"><i class="icon iconfont icon-plus-shortanswer"></i>简答</li>
       </ul>
   </div>
</template>

<script>
    export default {
        name: "navtop",
        props:['questiondata','tempdata'],
        data(){
            return{

            }
        },
        mounted(){
        },
        methods:{
            add(type){
                var _this=this;
                var ls_data=$.extend(true,{},_this.tempdata.questiondata[0]);   //要对questiondata作为模板push,需要先拷贝一份。
                ls_data.questionType=type;
                if(type=='judge'&&ls_data.optiondata.length==1){     //当为判断时  选项格式改变 固定为两个选项
                    var ls_option=$.extend(true,{},ls_data.optiondata[0]);
                    ls_data.optiondata.push(ls_option);
                }
                this.questiondata.push(ls_data);
            }
        }
    }
</script>
<style scoped>
    .navtop{position: fixed;top:0;z-index: 2;background: #1d6bef;padding: 0;width: 1000px;margin: auto;}
    .navtop li{display: inline-block;list-style: none;color:#fff;text-align: center;position: relative;padding: 5px 0;width: 25%;}
    .navtop li:after{content:'';display: inline-block;height:30px;width: 1px;background: #ccc;position: absolute;right: 0;}
    .navtop li:nth-last-of-type(1):after{display: none}
    .navtop li:hover{background: orange;cursor:pointer;}
    .navtop li:hover:after{display: none}
    .navtop .icon{font-size: 20px;margin-right: 5px;vertical-align: middle;}
    @media screen and (max-width: 1000px){
        .navtop{width: 100%;}
        .navtop li:after{display: none}
    }
</style>
