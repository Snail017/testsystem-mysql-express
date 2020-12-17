<template>
	<div class="dialog message" v-if="messageData.message!=''&&messageData.message!=null">
		<span class="ico-message"></span>
		{{messageData.message}}
		<span class="ico-delete" v-if="messageData.type===-1" @click="deleteClick"></span>
		<span v-if="messageData.type===1" class="ico-success">✓</span>
		<span class="icon-loading" v-if="messageData.type===2"></span>
	</div>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      messageData: {
        message: null,
        type: 0,
      },
    };
  },
  methods: {
    showMsg(msg) {
	//   this.showTipMsg(msg, false, 0);
	  this.showTipMsgTime(msg, false, 0, 4500);
    },
    showFailMsg(msg) {
	//   this.showTipMsg(msg, true, -1);
	  this.showTipMsgTime(msg, true, -1, 4500);
    },
    showSuccessMsg(msg) {
	//   this.showTipMsg(msg, true, 1);
	  this.showTipMsgTime(msg, true, 1, 4500);
    },
    showTransMsg(msg) {
	//   this.showTipMsg(msg, false, 2);
	  this.showTipMsgTime(msg, false, 2, 4500);
    },
    showTipMsg(msg) {
      this.showTipMsgTime(msg, true, 0, 4500);
    },
    showTipMsgTime(msg, isdismiss, status, time) {
      // this.isUSDTTipShow = false
      this.messageData = {
        message: msg,
        type: status,
      };
      if (isdismiss) {
        setTimeout(() => {
          this.hiddenTipMsg();
        }, time);
      }
    },
    hiddenTipMsg() {
      this.messageData = {
        message: "",
        type: 0,
      };
    },
    // ico-delete图标点击关闭提示框
    deleteClick() {
      this.messageData = {
        message: "",
        type: 0,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px;
  background-color: #002474;
  color: #d1efff;
  text-align: center;
  line-height: 22px;
  font-size: 14px;
  z-index: 10000;
  opacity: 0.9;
}
.ico-message {
  margin: 0 8px 0 5px;
  display: inline-block;
  width: 14px;
  height: 14px;
  background-image: url(~@/assets/cell/icon_tis@2x.png);
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: text-top;
}
.ico-delete {
  margin: 0 5px;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url(~@/assets/cell/icon_fail@3x.png);
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: text-top;
}
.ico-success {
  margin: 0 5px;
  display: inline-block;
  width: 19px;
  height: 13px;
  line-height: 13px;
  font-size: rem(40);
  // background-image: url(@/assets/cell/icon_chengg.png);
  // background-size: 100%;
  background-repeat: no-repeat;
  vertical-align: text-top;
}
.icon-loading {
  margin: 0 5px;
  animation: roller 1s infinite linear;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-image: url(~@/assets/cell/icon_loading@3x.png);
  background-size: contain;
  background-repeat: no-repeat;
  vertical-align: text-top;
}
</style>
