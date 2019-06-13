<template>
  <div class="st_testradio">
    <table>
      <tr>
        <td>选项文字</td>
        <td>图片</td>
        <td>说明</td>
        <td>正确答案</td>
        <td>上移下移</td>
        <td>删除</td>
      </tr>
      <tr v-for="(items,indexs) in optiondata">
        <td>
          <input type="text" class="form-control" v-model="items.text">
          <!--<i class="iconfont icon-jiaru"></i><i class="iconfont icon-jianshao"></i>-->
        </td>
        <td>
          <img
            v-if="items.img!=''"
            @click="windowdata.has_img_window=true;windowdata.img=items.img;windowdata.text=items.text;windowdata.index=indexs;"
            :src="items.img"
            class="st_cont_img"
            alt
          >
          <i
            v-if="items.img==''"
            @click="windowdata.has_img_window=true;windowdata.img=items.img;windowdata.text=items.text;windowdata.index=indexs;"
            class="iconfont icon-tupian"
          ></i>
        </td>

        <td>
          <i
            class="iconfont icon-plus-shortanswer"
            @click="windowdata.has_introduce_window=true;windowdata.introduce=items.introduce;windowdata.index=indexs;"
          ></i>
        </td>
        <td>
          <input
            type="checkbox"
            :name="'checkbox'+index"
            v-if="questiontype==2"
            value="true"
            v-model="items.answer"
          >
          <input
            type="radio"
            :name="'radio'+index"
            v-if="questiontype==1||questiontype==3"
            :value="indexs+1"
            v-model="questiondata.answer"
          >
        </td>
        <td>
          <i
            class="iconfont icon-shangyi"
            @click="indexs>0?($set(optiondata,indexs,optiondata[(indexs-1)]),$set(optiondata,(indexs-1),items)):''"
          ></i>
          <i
            class="iconfont icon-xiayi"
            @click="indexs<(optiondata.length-1)?($set(optiondata,indexs,optiondata[(indexs+1)]),$set(optiondata,(indexs+1),items)):''"
          ></i>
        </td>
        <td>
          <i
            class="iconfont icon-jianshao"
            @click="optiondata.length==1?'':optiondata.splice(indexs,1)"
          ></i>
        </td>
      </tr>
    </table>
    <div v-if="questiontype!=3">
      <div class="col-md-3 form-check-label addoption" @click="addoption()">
        <i class="iconfont icon-tianjia"></i>添加选项
      </div>
    </div>
    <div
      class="bg"
      @click="windowdata.has_img_window=false;windowdata.has_introduce_window=false;"
      v-if="windowdata.has_img_window||windowdata.has_introduce_window"
    ></div>
    <div class="imgcontent container-fluid" v-if="windowdata.has_img_window">
      <div class="row bg-ddd cont_head">
        <div class="col-md-11">{{windowdata.text}}</div>
        <i @click="windowdata.has_img_window=false" class="col-md-1 iconfont icon-guanbi"></i>
      </div>
      <div class="row pd-10">
        <input type="text" class="col-md-8" v-model="windowdata.img">
        <div class="input-group-addon btn btn-primary btn-file col-md-2">
          <span class="fileinput-new">
            选择文件
            <i v-if="windowdata.imgload" class="iconfont icon-jiazaizhong1"></i>
          </span>
          <input
            type="file"
            name="file"
            class="file_upload"
            accept="image/*"
            @change="fileUpload($event)"
          >
        </div>
        <a :href="windowdata.img" target="_blank" class="col-md-2">
          <img :src="windowdata.img" class="st_cont_img">
        </a>
      </div>
      <div class="st_cont_btn pd-10">                                                                                                                                                                  
        <span class="btn btn-info" @click="windowdata.has_img_window=false">取消</span>
        <span class="btn btn-primary" @click="windowImg();windowdata.has_img_window=false">确定</span>
      </div>
    </div>
    <div class="imgcontent container-fluid" v-if="windowdata.has_introduce_window">
      <div class="row bg-ddd cont_head">
        <div class="col-md-11">选项说明</div>
        <i @click="windowdata.has_introduce_window=false" class="col-md-1 iconfont icon-guanbi"></i>
      </div>
      <div class="row pd-10">
        <label class="col-md-3">
          <input type="radio" name="isUrl" value="0" v-model="windowdata.introduce.isUrl">直接输入内容
        </label>
        <label>
          <input type="radio" name="isUrl" value="1" v-model="windowdata.introduce.isUrl">显示网址内容
        </label>
      </div>
      <testeditor v-if="windowdata.introduce.isUrl==0" :editordata="windowdata.introduce"></testeditor>
      <div class="row pd-10" v-if="windowdata.introduce.isUrl==1">
        <input
          type="text"
          placeholder="请输入网址https://"
          class="form-control"
          v-model="windowdata.introduce.url"
        >
      </div>
      <div class="st_cont_btn pd-10">
        <span class="btn btn-info" @click="windowdata.has_introduce_window=false">取消</span>
        <span
          class="btn btn-primary"
          @click="optiondata[windowdata.index].introduce=windowdata.introduce;windowdata.has_introduce_window=false"
        >确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import testeditor from "@/components/testeditor.vue";
export default {
  name: "testOption",
  components: {
    testeditor
  },
  props: ["optiondata", "questiontype", "questiondata", "index"],
  data() {
    return {
      windowdata: {
        has_img_window: false,
        has_introduce_window: false,
        text: "",
        img: "",
        index: 0,
        imgload: false,
        introduce: {
          isUrl: 0,
          url: "",
          editorTxt: ""
        }
      }
    };
  },
  watch: {
    questiontype: {
      handler(newVal) {
        if (newVal == 3) {
          let ls_option = $.extend(true, {}, this.questiondata.optiondata[0]);
          let ls_reduce = this.optiondata.length - 2;
          if (ls_reduce > 0) {
            this.optiondata.splice(2, ls_reduce);
          } else if (ls_reduce < 0) {
            this.optiondata.push(ls_option);
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    windowopen(res, index) {
      this.windowdata.text = res.text;
      this.windowdata.img = res.img;
      this.windowdata.index = index;
    },
    windowImg() {
      var ImgObj = new Image(); //判断图片是否存在
      ImgObj.src = this.windowdata.img;
      console.log(ImgObj);
      if (ImgObj.fileSize > 0 || (ImgObj.width > 1 && ImgObj.height > 1)) {
        this.optiondata[this.windowdata.index].img = this.windowdata.img;
      } else {
        this.windowdata.img = this.optiondata[this.windowdata.index].img;
      }
    },
    addoption() {
      console.log(this.optiondata);
      this.optiondata.push({
        text: "",
        img: "",
        introduce: this.windowdata.introduce
      });
    },
    fileUpload(e) {
      var formData = new FormData(); //通过formdata上传
      let imgFile = e.target.files[0];
      formData.append("img", imgFile);
      this.windowdata.imgload = true;
      this.$http({
          method: "post",
          url: "/UpLoad/Uploadpic",
          dataType: "JSON",
          contentType: false,
          processData: false,
          data: formData
        }).then(res => {
            res = res.data;
            this.windowdata.img = res.data.img;
            this.windowdata.imgload = false;
          })
          .then(res => {
            console.log(res);
          });
    }
  }
};
</script>

<style scoped>
.st_testradio .iconfont.icon-jiazaizhong1 {
  color: #fff;
  animation: circle 3s linear infinite;
  display: inline-block;
}
@keyframes circle {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.st_testradio .iconfont {
  vertical-align: middle;
  font-size: 25px;
  line-height: 38px;
  color: gray;
}
.st_testradio td {
  text-align: center;
  padding: 6px;
}
.st_testradio tr:nth-of-type(1) {
  background: #ddd;
}
.st_testradio td:nth-of-type(1) {
  text-align: left;
  width: 40%;
}
/*.st_testradio td:nth-of-type(1) input{width: 80%;display: inline-block;}*/
.st_testradio table {
  width: 100%;
}
.st_cont_btn {
  margin: auto;
  text-align: center;
}
.addoption {
  cursor: pointer;
}
.imgcontent {
  position: fixed;
  top: 30%;
  z-index: 3;
  background: #fff;
  width: 800px;
  left: 50%;
  margin-left: -400px;
}
.cont_head {
  border-radius: 5px 5px 0 0;
}
.st_cont_img {
  display: inline-block;
  object-fit: scale-down;
  height: 40px;
}
.cont_head > div {
  vertical-align: middle;
  line-height: 38px;
  overflow: hidden;
  white-space: pre-line;
  text-overflow: ellipsis;
}
.btn-file {
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  border-radius: 0;
}

.btn-file > input {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  font-size: 23px;
  cursor: pointer;
  filter: alpha(opacity=0);
  opacity: 0;

  direction: ltr;
}

@media screen and(max-width: 1000px) {
  .imgcontent {
    width: 80%;
  }
}
</style>