import { mount, createLocalVue } from '@vue/test-utils'
import login from '@/views/login.vue'
import ViewUI from 'view-design'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(ViewUI)
localVue.use(VueRouter)
describe('AppButton.vue', () => {
  // 测试内容：data
  // 自定义props传递给AppButton组件，判断组件有获取到props
  it('data test', async () => {
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
    const wrapper = mount(login, {
      data() {
        return buttonProps
      },
      stubs:[
        'router-link',"Row"
      ]
    })
    await wrapper.vm.$nextTick()
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
})
