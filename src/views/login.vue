<template>
  <div class="register">
    <Row>
      <Col span="24">
        <Input type="text" v-model="name" placeholder="用户名((最少6位))" />
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <Input type="password" v-model="password" placeholder="密码(最少8位)" />
      </Col>
    </Row>
    <Row>
      <Col span="18">
        <Input
          type="text"
          placeholder="验证码"
          v-model="code"
          v-bind:onblur="ConfirmData()"
          @keyup.enter.native="login()"
        />
      </Col>
      <Col span="6">
        <div v-html="codeData.img" @click="getCode"></div>
      </Col>
    </Row>
    <p class="note">
      {{ note }}
    </p>
    <Row>
      <Button type="success" :disabled="!IsOk" long @click="login()"
        >登录</Button
      >
    </Row>
    <Row>
      <router-link to="/register" style="float: right">注册</router-link>
    </Row>
  </div>
</template>

<script>
import { VerifyLogin } from "@/api";
const crypto = require("crypto");
export default {
  name: "login",
  data() {
    return {
      password: "",
      Confirmpassword: "",
      name: "",
      code: "",
      img: "",
      note: "",
      isPw: 2,
      IsOk: false,
      codeData: {},
    };
  },
  mounted() {
    // this.getCode();
  },
  methods: {
    getCode() {
      var _this = this;
      return this.$http({
        method: "get",
        url: "/captcha",
      }).then((res) => {
        _this.codeData = res.data;
        return res
      });
    },
    /**
     *密码输入是否正确，正确注册按钮修改为可用
     **/
    ConfirmData() {
      if (
        this.password != "" &&
        this.name != "" &&
        this.code != "" &&
        this.password.length > 7
      ) {
        this.IsOk = true;
      }
    },
    /**
     * 验证密码数据匹配
     * 验证验证码是否匹配
     * 都为正确显示√
     */
    confirmPw() {
      this.note = "";
      if (this.code.toLowerCase() != this.codeData.msg.toLowerCase()) {
        this.note = "验证码不匹配";
      } else {
        this.isPw = 1;
        return true;
      }
    },
    login() {
      var _this = this;
      var ls_pw = _this.crypto
        .publicEncrypt(
          window.localStorage.getItem("public_key"),
          Buffer.from(
            _this.crypto
              .createHash("md5")
              .update(_this.password, "base64")
              .digest("hex")
          )
        )
        .toString("base64");
      var flag = _this.confirmPw();
      _this.getCode();
      if (flag) {
        let data = {
          name: _this.name,
          password: ls_pw,
        };

        // 下面的两处return都是为了配合单元测试,方便单元测试
        // 如果没有下面的return.在测试时就无法获取promis和最终请求结果,导致无法进行断言
        return VerifyLogin(data).then((res) => {
          res = res.data;
          if (res.code == 200) {
            window.localStorage["token"] = res.data.access_token;
            this.$Message.info({
              content: "登陆成功",
              duration: 3,
              onClose: function () {
                _this.$router.push("/home");
              },
            });
          } else {
            this.note = res.msg;
          }
          return res;
        });
      }
    },
  },
};
</script>

<style scoped>
.register .ivu-row {
  width: 80%;
  margin: 0 auto 10px;
}
.register {
  margin-top: 100px !important;
}
.note {
  height: 20px;
  font-size: 12px;
  color: red;
}
.pos {
  position: absolute;
  font-size: 25px;
  right: 0;
}
.icon-zhengque {
  color: #47cb89;
}
@media screen and (min-width: 700px) {
  .register {
    width: 600px;
    margin: auto;
    border: 1px solid #ddd;
    padding: 40px;
  }
}
</style>