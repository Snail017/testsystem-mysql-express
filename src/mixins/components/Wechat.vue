<template>
    <div class="st_window" v-if="show">
      <div class="st_bg" @click="show=false"></div>
      <div class="st_toshare" @click="show=false" v-if="show=='shareWeixin'">
        <img src="~IMG/icon_curve.png" alt />
        <p>点击右上方分享～</p>
      </div>
      <div class="content" @click="show=false" v-if="show!='shareWeixin'">
        <p class="del"></p>
        <div class="txt" v-if="show=='wechat'">
          <p>
            长按二维码添加
            <span class="red">客服</span>微信
          </p>
          <p class="red">享受更多福利!</p>
          <img src="~IMG/img_wxChat.png" alt />
        </div>
        <div class="txt" v-if="show=='wxprogrem'">
          <p>
            长按二维码
            <span class="red">关注</span>
            CellFun小程序
          </p>
          <p class="red">马上使用红包!</p>
          <img src="~IMG/img_wxProgrem.png" alt />
        </div>
      </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
             show: false,
        }
    }
}
</script>

<style lang="scss" scoped>
.st_window {
  .st_toshare {
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    > img {
      width: 14.2rem;
      height: 13rem;
      float: right;
      margin-right: 0.8rem;
    }
    > p {
      background: #fff2de;
      border-radius: rem1(20);
      display: inline-block;
      margin: auto;
      padding: rem1(40) rem1(90);
      color: #df2c2b;
      font-size: rem1(30);
      font-weight: 600;
      margin-top: rem1(30);
    }
  }
  .st_bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 0;
    background: #000;
    opacity: 0.4;
  }

  .content {
    position: fixed;
    width: rem1(569);
    left: 50%;
    top: 30%;
    margin-left: rem1(-569/2);
    background: #fff;
    padding: rem1(30) 0;
    border-radius: rem1(20);
    img {
      width: rem1(240);
      margin: auto;
    }
    .del {
      position: absolute;
      right: rem1(20);
      top: rem1(10);
      &:after {
        content: "✕";
        font-size: rem1(30);
        display: inline-block;
        color: #aaa;
      }
    }
    > img {
      width: rem1(270);
      margin: auto;
    }
    .txt {
      text-align: center;
      width: 100%;
      font-size: rem1(34);
      p {
        margin: rem1(20);
      }
    }
    .red {
      color: #e92727;
    }
  }
}
</style>