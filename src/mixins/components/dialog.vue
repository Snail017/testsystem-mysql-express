<template>
  <div class="icon_pop" v-if="show">
    <div class="wrapper">
      <div class="block">
        <h3 v-html="msg">
          1.您可以安装一个加密钱包 <br />
          2.联系客服获得一对一指导
        </h3>
        <button @click="show=false">{{successBTN}}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            msg:'1.您可以安装一个加密钱包 <br />2.联系客服获得一对一指导',
            show:false,
            successBTN:'知道了'
        }
    }
};
</script>

<style lang='scss' scoped>
.icon_pop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  .wrapper {
    @include flexCenter;
    height: 100%;
    .block {
      width: 90%;
      padding: 0 3%;
      border-radius: 0.64rem;
      background-color: #fff;
      box-sizing: border-box;
      text-align: center;
      max-width: 27.6rem;
      h3 {
        margin: 1.6rem 0 0.8rem;
        color: #000;
        font-size: 1.44rem;
      }
      button {
        width: 100%;
        height: 3.36rem;
        margin: 1.04rem 0 1.36rem;
        border: 0;
        border-radius: 0.32rem;
        background-color: #1d51e0;
        color: #fff;
        line-height: 3.36rem;
        font-size: 1.28rem;
      }
    }
  }
}
</style>
