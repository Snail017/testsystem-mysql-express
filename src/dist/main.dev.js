"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("@/App"));

var _router = _interopRequireDefault(require("@/router"));

var _crypto = _interopRequireDefault(require("crypto"));

var _viewDesign = _interopRequireDefault(require("view-design"));

require("@/assets/css/iconfont.css");

require("view-design/dist/styles/iview.css");

require("@/assets/css/common.scss");

var _http = _interopRequireDefault(require("@/http"));

var _zq = _interopRequireDefault(require("@/assets/zq"));

var _index = _interopRequireDefault(require("@/lib/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_index["default"]);

_vue["default"].use(_zq["default"]);

_vue["default"].use(_crypto["default"]);

_vue["default"].use(_viewDesign["default"]);

_vue["default"].prototype.crypto = _crypto["default"];
_vue["default"].prototype.$http = _http["default"];
_vue["default"].config.productionTip = false; //获取公钥

_vue["default"].prototype.$http({
  method: 'get',
  url: "/publicKey"
}).then(function (res) {
  res = res.data;

  if (res.code == 200) {
    window.localStorage.setItem("public_key", res.msg);
  }
});

new _vue["default"]({
  router: _router["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');