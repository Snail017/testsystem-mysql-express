import { mount, createLocalVue } from '@vue/test-utils'
import login from '@/views/login.vue'
import ViewUI from 'view-design'
import VueRouter from 'vue-router'
import httpServer from "@/api/httpServer"

const localVue = createLocalVue()
localVue.use(ViewUI)
localVue.use(VueRouter)
jest.mock('axios')

localVue.prototype.$http=httpServer;

// mock掉整个axios模块
// 返回值在使用的时候自定义

describe('AppButton.vue', () => {
  const buttonProps = {
    password: '12345678',
    Confirmpassword: '12345678',
    name: "zq",
    code: '',
    img: "",
    note: "",
    isPw: 2,
    IsOk: true,
    codeData: {}
  }
 
  // 设置 Wrapper vm 的方法并强制更新。
  const wrapper = mount(login, {
    data() {
      return buttonProps
    },
    stubs:[
      'router-link',"Row"
    ]
  })
 

  // 测试内容：data
  // 自定义props传递给Row组件，判断组件有获取到props
  it('data test', async () => {
    // 创建mock函数
    const mockFn2 = jest.fn()
    // 设置 Wrapper vm 的方法并强制更新。
    wrapper.setMethods({ login: mockFn2 })
    const a = wrapper.find('.register Button')
    a.trigger('click')
    expect(mockFn2).toBeCalled()
    // 断言已经获取到props
    expect(wrapper.vm._data.password).toBe('12345678')
    // 每个it最后都应该销毁wrapper
    wrapper.destroy()
  })
  // 测试内容：axios->login()函数
  // 为了配合axios测试,需要在组件代码的两处增加return,参见AxiosTest组件
  it('login', () => {
    http.mockRejectedValue('error')
    return wrapper.vm.login().catch(e => expect(e).toMatch('error'))
  })
  // 测试内容：axios->login()函数请求rejeced的情况
  it('axios test', () => {
    // 自定义get被拒绝时返回值
    const mockFn2 = jest.fn()
    // 设置 Wrapper vm 的方法并强制更新。
    wrapper.setMethods({ login: mockFn2 })
    mockFn2.mockRejectedValue('error')
    return wrapper.vm.login().catch(e => expect(e).toMatch('error'))
  })
})
