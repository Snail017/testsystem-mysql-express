<template>
  <div>
    <div
      v-for="(items,indexs) in questiondata"
      @mouseenter="items.navOperate=true;"
      @mouseleave="items.navOperate=false"
    >
      <div class="st_question_content" @click.stop="items.isshow+=1;">
        <div style="display: flex">
          <span v-if="!topdata.sort">{{indexs+1}}.</span>
          <b v-if="topdata.sort" class="cl-red">*</b>
          <span v-html="items.editorTxt==''?'请输入题目':items.editorTxt"></span>
        </div>
        <div class="form-group pdt-10 clearfix" v-html="items.note"></div>
        <div v-if="items.questionType==1">
          <div
            v-for="(item,index) in items.optiondata"
            :class="{'optionBorder':(item.img!=''||(item.introduce.editorTxt!=''&&item.introduce.url!=''))}"
          >
            <label>
              <input type="radio" :checked="items.answer==index">
              <span v-html="item.text==''?'请输入选项'+(index+1):item.text"></span>
              <img :src="item.img" alt>
            </label>
            <span v-html="item.introduce.isUrl=='1'?item.introduce.url:item.introduce.editorTxt"></span>
          </div>
        </div>
        <div v-if="items.questionType==3">
          <div
            v-for="(item,index) in items.optiondata"
            :class="{'optionBorder':(item.img!=''||(item.introduce.editorTxt!=''&&item.introduce.url!=''))}"
          >
            <label>
              <input type="radio" :checked="items.answer==index">
              <span v-html="item.text==''?'请输入选项'+(index+1):item.text"></span>
              <img :src="item.img" alt>
            </label>
          </div>
        </div>
        <div v-if="items.questionType==2">
          <div
            v-for="(item,index) in items.optiondata"
            :class="{'optionBorder':(item.img!=''||(item.introduce.editorTxt!=''&&item.introduce.url!=''))}"
          >
            <label>
              <input type="checkbox" >
              <span v-html="item.text==''?'请输入选项'+(index+1):item.text"></span>
              <img :src="item.img" alt>
            </label>
            <span v-html="item.introduce.isUrl=='1'?item.introduce.url:item.introduce.editorTxt"></span>
          </div>
        </div>
        <!--简答-->
        <textarea v-if="items.questionType==0" class="col-md-10" readonly></textarea>
        <div class="pd-10 clearfix" v-if="items.analysis!=''">
          <span class="fl">题目解析：</span>
          <div class="fl" v-html="items.analysis"></div>
        </div>
        <div class="pd-10 btn_option">
          <div class="fr">
            <span class="btn btn-outline-primary" @click.stop="items.isshow+=1">编辑</span>
            <span class="btn btn-outline-primary" @click.stop="copy(items,indexs)">复制</span>
            <span
              class="btn btn-outline-primary"
              @click.stop="deleteQuestion(items.question_id,indexs)"
            >删除</span>
            <span
              class="btn btn-outline-primary"
              @click.stop="questiondata.length>1?($set(questiondata,indexs,questiondata[indexs-1]),$set(questiondata,indexs-1,items)):''"
            >上移</span>
            <span
              class="btn btn-outline-primary"
              @click.stop="questiondata.length>1?($set(questiondata,indexs,questiondata[indexs+1]),$set(questiondata,indexs+1,items)):''"
            >下移</span>
            <span class="btn btn-outline-primary" @click.stop="first(items.indexs)">最前</span>
            <span class="btn btn-outline-primary" @click.stop="last(items,indexs)">最后</span>
          </div>
        </div>
      </div>
      <div class="st_setquestion" v-if="items.isshow%2==1">
        <testeditor :editordata="items"></testeditor>
        <div class="row st_selecttype">
          <div class="col-md-2">
            <select name="type" id class="form-control" v-model="items.questionType">
              <!--<option value="name">姓名</option>-->
              <option value="0">简答</option>
              <option value="1">单选</option>
              <option value="2">多选</option>
              <option value="3">判断</option>
            </select>
          </div>
          <div class="col-md-3 form-check col-form-label">
            <input type="checkbox" class="form-check-input" v-model="items.mustanswer">
            <label class="form-check-label">必答</label>
            <span
              class="st_note"
              @click="items.haswindow+=1;wintxt.editorTxt=items.note;items.windowtype='note'"
            >编辑提示</span>
          </div>
          <div class="col-md-5">
            <label>题目分数：</label>
            <input type="number" style="padding-left:5px;width: 50px;" v-model="items.score">
            <span
              class="st_note"
              @click="items.haswindow+=1;wintxt.editorTxt=items.analysis;items.windowtype='analysis'"
            >设置答案解析</span>
          </div>
        </div>
        <testOption
          v-if="items.questionType!=0"
          :optiondata="items.optiondata"
          :questiondata="items"
          :index="indexs"
          :questiontype="items.questionType"
        ></testOption>
        <p class="btn btn-primary btn-block" @click="items.isshow+=1">完成编辑</p>

        <div class="bg" v-if="items.haswindow%2==1" @click="items.haswindow+=1;"></div>
        <div class="window" v-if="items.haswindow%2==1">
          <i class="iconfont icon-guanbi" @click="items.haswindow+=1;"></i>
          <testeditor :editordata="wintxt"></testeditor>
          <div style="text-align: center;" class="pd-10">
            <span class="btn btn-info" @click="items.haswindow+=1;">取消</span>
            <span
              class="btn btn-primary"
              @click="items.windowtype=='note'?items.note=wintxt.editorTxt:items.analysis=wintxt.editorTxt;items.haswindow+=1;"
            >确定</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import testeditor from "@/components/testeditor.vue";
import testOption from "@/components/testOption.vue";

export default {
  name: "setquestion",
  components: {
    testOption,
    testeditor
  },
  props: ["questiondata", "topdata"],
  data() {
    return {
      haswindow: 0,
      wintxt: {
        //给编辑模板页使用，编辑子模板无法直接对父模板data进行操作，但是可以控制data中数组的子数据
        editorTxt: ""
      },
      windowtype: "",
      score: 0,
      isshow: 0
    };
  },
  watch: {
    questiondata: {
      handler(newval) {
        this.topdata.gross_score = 0;
        for (let i in this.questiondata) {
          this.topdata.gross_score =
            Number(this.topdata.gross_score) +
            Number(this.questiondata[i].score);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    deleteQuestion(id, indexs) {
      var _this = this;
      if (id == 0) {
        _this.questiondata.length > 1
          ? _this.questiondata.splice(indexs, 1)
          : "";
        return false;
      }
      _this
        .$http({
          method: "delete",
          url: "/questions",
          data: {
            id: id
          }
        })
        .then(res => {
          if (res.status == 200) {
            _this.questiondata.splice(indexs, 1)
          }
        });
    },
    copy(res, indexs) {
      res.question_id = 0;
      for (let i in res.optiondata) {
        res.optiondata[i].option_id = 0;
      }
      let ls_data = $.extend(true, {}, res);
      this.questiondata.splice(indexs, 0, ls_data);
    },
    first(res, indexs) {
      if (indexs > 0) {
        let ls_data = $.extend(true, {}, res);
        this.questiondata.splice(indexs, 1);
        this.questiondata.unshift(ls_data);
      }
    },
    last(res, indexs) {
      if (indexs < this.questiondata.length - 1) {
        let ls_data = $.extend(true, {}, res);
        this.questiondata.splice(this.questiondata.length, 1);
        this.questiondata.push(ls_data);
      }
    }
  }
};
</script>

<style scoped>
.optionBorder {
  border: 1px solid #ccc;
  margin: 10px 0;
  padding: 5px;
}
.st_question_content {
  padding: 10px 100px;
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

.st_setquestion {
  background: #fafafa;
  width: 100%;
  padding: 20px 40px;
  position: relative;
}

.st_setquestion:before {
  content: "";
  display: block;
  width: 1px;
  height: 1px;
  border-top: 15px transparent;
  border-bottom: 15px solid #ddd;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  position: absolute;
  top: -15px;
  left: 10%;
}
.btn_option {
  margin-left: -16%;
  width: 120%;
  position: relative;
  height: 48px;
}
@media screen and (min-width: 1000px) {
}
@media screen and (max-width: 850px) {
  .btn {
    padding: 5px 3px;
  }
  .st_question_content {
    padding: 10px 30px;
  }
}
</style>
