<template>
  <div>
    <div class="st_top_content">
      <div class="header clearfix">
        <div class="fl" v-if="Ispaper==0">
          <Button type="primary" @click="$emit('submitAnswer',1)">提交考试</Button>
        </div>
        <div class="fl" v-if="Ispaper==1">
          <Button type="primary" @click="$emit('checkAnswer',1)">提交改卷</Button>
        </div>
        <div class="fr" v-if="Ispaper!=0">
          <p>试卷总分：{{topdata.score_sum}}</p>
        </div>
        <div class="fr">
          <p v-if="Ispaper==0">试卷倒计时：{{topdata.testTime}}分钟</p>
          <p>试卷题目数：{{questiondata.length>0?questiondata.length:0}}</p>
        </div>
      </div>
    </div>
    <div class="title">
      <h1 class="st_title">{{titledata.title}}</h1>
      <div v-html="titledata.editorTxt" class="st_subtitile"></div>
    </div>
    <div v-for="(items,indexs) in questiondata">{{items}}
      <div class="st_question_content clearfix">
        <div style="display: flex">
          <span v-if="!topdata.sort">{{indexs+1}}.</span>
          <b v-if="topdata.sort" class="cl-red">*</b>
          <span v-html="items.editorTxt"></span>({{items.score}}分)
          <span style="color:red;margin-left:5px;" v-if="Ispaper!=0">得分：<input v-if="items.questionType==0" type="number" v-model="items.gainScore" :readonly="Ispaper==2?true:false"  style="width:80px;" :placeholder="'不超过'+items.score+'分'"/> <template v-else>{{items.gainScore}}</template>  </span>  
        </div>
        <div class="pdt-10"  v-html="items.note"></div>
        <div v-if="items.questionType==1">
          <div
            v-for="(item,index) in items.optiondata"
            :class="{'optionBorder':(item.img!=''||(item.introduce.editorTxt!=''&&item.introduce.url!=''))}"
          >
            <label>
              <input
                :name="'radio'+indexs"
                type="radio"
                :value="index"
                v-model='items.answer'
                :disabled="Ispaper!=0"
              />
              <span v-html="item.text"></span>
              <span v-html="item.introduce"></span>
              <div v-if="item.img!=''">
                <img :src="item.img" alt />
              </div>
            </label>
            <span v-html="item.introduce.isUrl=='1'?item.introduce.url:item.introduce.editorTxt"></span>
          </div>
        </div>
        <div v-if="items.questionType==3">
          <div v-for="(item,index) in items.optiondata">
            <label @focus="items.answer+'&'+(index+1)">
              <input
                :name="'judge'+indexs"
                type="radio"
                :disabled="Ispaper!=0"
                v-model='items.answer'
              />
              <span v-html="item.text"></span>
              <img v-if="item.img!=''" :src="item.img" alt />
            </label>
          </div>
        </div>
        <div v-if="items.questionType==2">
          <div
            v-for="(item,index) in items.optiondata"
            :class="{'optionBorder':(item.img!=''||(item.introduce.editorTxt!=''&&item.introduce.url!=''))}"
          >
            <label>
              <input type="checkbox" :disabled="Ispaper!=0"  v-model="item.answer" />
              <span v-html="item.text"></span>
              <img v-if="item.img!=''" :src="item.img" alt />
            </label>
            <span v-html="item.introduce.isUrl=='1'?item.introduce.url:item.introduce.editorTxt"></span>
          </div>
        </div>
        <!--简答-->
        <div>
          <Input v-if="items.questionType==0" type="textarea" v-model="items.answer" :readonly="Ispaper!=0"></Input>
        </div>
        <div class="pd-10 clearfix" v-if="isExamAnswer">
          <span class="fl">题目解析：</span>
          <div class="fl" v-html="items.analysis"></div>
        </div>
        <div v-if="Ispaper!=0">正确答案：<span v-if="items.questionType==0">{{items.realAnswer}}</span><span v-else-if="items.realAnswer!=null&&items.realAnswer!=''">第{{items.realAnswer}}选项</span></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "answerquestion",
  components: {},
  props: ["questiondata", "topdata", "titledata", "isExamAnswer"],
  data() {
    return {
      Ispaper:
        window.location.hash.indexOf("/paper?") != -1
          ? 0
          : window.location.hash.indexOf("/checkpaper?") != -1
          ? 1
          : 2
    };
  },
  watch: {
    "topdata.testTime": {
      handler(newVal, oldVal) {
        var _this = this;
        if (newVal == 0) {
          _this.$emit("submitAnswer", 1);
        }
        if (_this.Ispaper == 0) {
          setTimeout(() => {
            _this.topdata.testTime = _this.topdata.testTime - 1;
          }, 60000);
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
.st_top_content {
  margin: auto;
  width: 1000px;
  z-index: 2;
  position: fixed;
  top: 0px;
}
.header {
  color: #fff;
  width: 1000px;
  margin: auto;
  padding: 0 20px;
}
.header > div {
  padding: 10px 0;
}
.header p {
  display: inline-block;
  margin: 0;
  padding: 0 10px;
  vertical-align: middle;
  text-shadow: 3px 0px 3px #000;
}
.header label {
  vertical-align: middle;
  margin: 0;
}
.title {
  cursor: pointer;
  min-height: 100px;
  background: #fff;
  width: 1000px;
  margin: auto;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  margin-top: 15px;
}
.st_subtitile {
  color: #555555;
  line-height: 24px;
  text-align: left;
  font-size: 16px;
  padding: 0 50px;
  margin-left: 0;
  margin-top: 20px;
}
.st_title {
  font-size: 24px !important;
  font-weight: bold;
  color: #f53d05;
  vertical-align: middle;
  text-align: center;
  margin: 0;
  padding: 15px 0;
  line-height: 24px;
}

.st_question_content {
  padding: 40px;
  background: #fff;
  border-bottom: 1px solid #ddd;
}
input:disabled {
  background: #fff;
}
.st_question_content .icon-ren {
  color: #999;
}
.st_setquestion .st_note {
  text-decoration: underline;
  color: #0a6ebd;
  cursor: pointer;
}

.st_setquestion .st_selecttype {
  margin: 10px 0;
}

@media screen and (max-width: 1000px) {
  .st_top_content {
    width: 100%;
  }
  .header {
    width: 100%;
  }
  .title {
    width: 100%;
  }
}
</style>
