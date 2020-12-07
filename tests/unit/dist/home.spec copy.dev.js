"use strict";

var _testUtils = require("@vue/test-utils");

var _home = _interopRequireDefault(require("@/views/home.vue"));

var _viewDesign = _interopRequireDefault(require("view-design"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var localVue = (0, _testUtils.createLocalVue)();
localVue.use(_viewDesign["default"]);
localVue.use(_vueRouter["default"]);
describe('home.vue', function () {
  // 测试内容：data
  // 自定义props传递给AppButton组件，判断组件有获取到props
  it('data test', function _callee() {
    var wrapper;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            wrapper = (0, _testUtils.mount)(_home["default"], {
              propsData: propsData,
              stubs: ['router-link', "Row"]
            });
            _context.next = 3;
            return regeneratorRuntime.awrap(wrapper.vm.$nextTick());

          case 3:
            // 创建mock函数
            expect(wrapper.vm._data.password).toBe('12345678'); // 每个it最后都应该销毁wrapper

            wrapper.destroy();

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});