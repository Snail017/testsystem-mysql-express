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
      <tr v-for="(items,indexs) in optiondata" :key=indexs>
        <td>
          <input type="hidden" v-model="items.sort=indexs">
          <Input type="text" class="form-control" v-model="items.text"></Input>
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
            v-model="items.answer"
          >
          <input
            type="radio"
            :name="'radio'+index"
            v-if="questiontype==1||questiontype==3"
            :value="indexs"
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
            @click="optiondata.length==1?'':deleteOption(items.option_id,indexs)"
          ></i>
        </td>
      </tr>
    </table>
      <span  v-if="questiontype!=3" class="pd-10 addoption" @click="addoption()">
        <i class="iconfont icon-tianjia"></i>添加选项
      </span>
    <div
      class="bg"
      @click="windowdata.has_img_window=false;windowdata.has_introduce_window=false;"
      v-if="windowdata.has_img_window||windowdata.has_introduce_window"
    ></div>
    <div class="imgcontent container-fluid" v-if="windowdata.has_img_window">
      <Row class="bg-ddd cont_head">
        <Col span="22">{{windowdata.text}}</Col>
        <Col span="2">
           <i @click="windowdata.has_img_window=false" class=" iconfont icon-guanbi"></i>
        </Col> 
      </Row>
      <Row class="pd-10">
        <Col span='16'>
           <Input v-model="windowdata.img"></Input>
        </Col>
        <Col span="4">
            <Button type="primary"  class="btn-file">
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
            </Button>
        </Col>
        <Col span="4">
          <router-link  target="_blank"  :to="windowdata.img">
            <img :src="windowdata.img" class="st_cont_img"> 
          </router-link>
        </Col>
      </Row>
      <Row class="pd-10" type="flex" justify="center">
        <Col :md="2" :xs=6>
          <Button type="info" size="large" @click="windowdata.has_img_window=false">取消</Button>
        </Col>
        <Col :md="2" :xs=6>
          <Button type="primary" size="large"  @click="windowImg();windowdata.has_img_window=false">确定</Button>
        </Col>
      </Row>
    </div>
    <div class="imgcontent container-fluid" v-if="windowdata.has_introduce_window">
      <Row class="bg-ddd cont_head">
         <Col span="23">选项说明</Col>
         <Col span="1">
            <i @click="windowdata.has_introduce_window=false" class="iconfont icon-guanbi"></i>
         </Col>
      </Row>
       <Row class="pd-10">
         <Col span="6">
           <input type="radio" name="isUrl" value="0" v-model="windowdata.introduce.isUrl">直接输入内容
         </Col>
         <Col span="6">
           <input type="radio" name="isUrl" value="1" v-model="windowdata.introduce.isUrl">显示网址内容
         </Col>
      </Row>
      <Row  v-if="windowdata.introduce.isUrl==0" type="flex" justify="center">
        <Col span="23">
          <testeditor :editordata="windowdata.introduce"></testeditor>
        </Col>
      </Row>
      <Row class="pd-10" v-else>
          <Col span="24">
            <Input  placeholder="请输入网址https://" v-model="windowdata.introduce.url" ></Input>
          </Col>
         <Col span="6">
           <input type="radio" name="isUrl" value="1" v-model="windowdata.introduce.isUrl">显示网址内容
         </Col>
      </Row>
      <Row type="flex" justify="center" class="pd-10">
          <Col span="3">
            <Button type="info"  @click="windowdata.has_introduce_window=false">取消</Button>
          </Col>
          <Col span="3">
            <Button type="primary"   @click="optiondata[windowdata.index].introduce=windowdata.introduce;windowdata.has_introduce_window=false">确定</Button>
          </Col>
      </Row>
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
        if (newVal == 3 && this.optiondata.length < 2) {
          let ls_option = $.extend(true, {}, this.questiondata.optiondata[0]);
          this.optiondata.push(ls_option);
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
    deleteOption(option_id,indexs) {
      this.$http({
          method: "delete",
          url: "/option",
          data: {
            option_id: option_id
          }
        })
        .then(res => {
          if (res.status == 200) {
            this.optiondata.splice(indexs, 1);
          }
        });
    },
    windowImg() {
      var ImgObj = new Image(); //判断图片是否存在
      ImgObj.src = this.windowdata.img;
      ImgObj.onload=()=>{
        if (ImgObj.fileSize > 0 || (ImgObj.width > 1 && ImgObj.height > 1)) {
          this.optiondata[this.windowdata.index].img = this.windowdata.img;
        } else {
          this.windowdata.img = this.optiondata[this.windowdata.index].img;
        }
      }
    },
    addoption() {
      var _this=this;
      this.optiondata.push({
        answer:false,
        text: "",
        img: "",
        sort:_this.optiondata.length+1,
        introduce: this.windowdata.introduce,
        option_id:0,
      });
    },
    fileUpload(e) {
      var _this=this;
      var formData = new FormData(); //通过formdata上传
      let imgFile = e.target.files[0];
      formData.append("img", imgFile);
      this.windowdata.imgload = true;
      this.$http({
        method: "post",
        url: "/Uploadpic",
        dataType: "JSON",
        contentType: false,
        processData: false,
        data: formData
      })
        .then(res => {
          res = res.data;
          _this.windowdata.img = res.data.img;
          _this.windowdata.imgload = false;
        })
        .then(res => {
          console.log(res);
        });
    }
  }
};
</script>

<style scoped lang="scss">
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
  color: gray;
}
.st_testradio td {
  text-align: center;
  padding: 6px;
}
.st_testradio td:nth-of-type(1) {
  text-align: left;
  width: 40%;
}
.st_testradio tr:nth-of-type(1) {
  background: #ddd;
}
.st_testradio table {
  width: 100%;
}

.addoption {
  cursor: pointer;
  display: inline-block;
}
.imgcontent {
  position: fixed;
  top: 30%;
  z-index: 3;
  background: #fff;
  width: rem(1400);
  left: 50%;
  margin-left: -rem(1400/2);
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
  height: 38px;
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

.btn-file .file_upload {
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
  .imgcontent {
    position: fixed;
    top: 30%;
    z-index: 3;
    background: #fff;
    width: 96%;
    left: 2%;
  }
}
</style>