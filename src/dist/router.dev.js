"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.routes = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/',
  redirect: '/home'
}, {
  path: '/home',
  name: 'home',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("@/views/home.vue"));
    });
  }
}, {
  path: '/register',
  name: 'register',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@/views/register'));
    });
  }
}, {
  path: '/login',
  name: 'login',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@/views/login'));
    });
  }
}, {
  path: '/homeQuestion',
  name: 'homeQuestion',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("@/views/homeQuestion"));
    });
  },
  meta: {
    requireAuth: true // 该路由项需要权限校验

  }
}, {
  path: '/editFrom',
  name: 'editFrom',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@/views/editFrom'));
    });
  },
  meta: {
    requireAuth: true // 该路由项需要权限校验

  }
}, {
  path: '/homeAnswer',
  name: 'homeAnswer',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("@/views/homeAnswer"));
    });
  },
  meta: {
    requireAuth: true // 该路由项需要权限校验

  }
}, {
  path: '/answer',
  name: 'answer_list',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@/views/answer_list'));
    });
  },
  meta: {
    requireAuth: true // 该路由项需要权限校验

  }
}, {
  path: '/paper',
  name: 'questionnaire',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('@/views/questionnaire'));
    });
  },
  meta: {
    requireAuth: true // 该路由项需要权限校验

  }
}];
exports.routes = routes;
var router = new _vueRouter["default"]({
  routes: routes
}); // 路由前置导航守卫

router.beforeEach(function (to, from, next) {
  // 根据路由元信息设置文档标题
  if (to.meta.title) {
    document.title = to.meta.title;
  }

  next();
}); //路由跳转后滚动到顶部

router.afterEach(function (to, from, next) {
  window.scrollTo(0, 0);
});
var _default = router;
exports["default"] = _default;