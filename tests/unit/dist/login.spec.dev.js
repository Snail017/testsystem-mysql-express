"use strict";

var _testUtils = require("@vue/test-utils");

var _login = _interopRequireDefault(require("@/views/login.vue"));

var _viewDesign = _interopRequireDefault(require("view-design"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var localVue = (0, _testUtils.createLocalVue)();
localVue.use(_viewDesign["default"]);
localVue.use(_vueRouter["default"]);
describe('AppButton.vue', function () {
  // 测试内容：data
  // 自定义props传递给AppButton组件，判断组件有获取到props
  it('data test', function _callee() {
    var buttonProps, wrapper, mockFn2, a;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            buttonProps = {
              password: '12345678',
              Confirmpassword: '12345678',
              name: "zq",
              code: '',
              img: "",
              note: "",
              isPw: 2,
              IsOk: true,
              codeData: {}
            };
            wrapper = (0, _testUtils.mount)(_login["default"], {
              data: function data() {
                return buttonProps;
              },
              stubs: ['router-link', "Row"]
            });
            _context.next = 4;
            return regeneratorRuntime.awrap(wrapper.vm.$nextTick());

          case 4:
            // 创建mock函数
            mockFn2 = jest.fn(); // 设置 Wrapper vm 的方法并强制更新。

            wrapper.setMethods({
              login: mockFn2
            });
            a = wrapper.find('.register Button');
            a.trigger('click');
            expect(mockFn2).toBeCalled(); // 断言已经获取到props

            expect(wrapper.vm._data.password).toBe('12345678'); // 每个it最后都应该销毁wrapper

            wrapper.destroy();

          case 11:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});