"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vuex["default"]);

var state = {};
var getters = {};
var mutations = {};
var actions = {};
var store = new _vuex["default"].Store({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions
});
var _default = store;
exports["default"] = _default;