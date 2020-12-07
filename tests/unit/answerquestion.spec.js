import { mount, createLocalVue } from '@vue/test-utils'
import answerquestion from '@/components/answerquestion.vue'
import ViewUI from 'view-design'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(ViewUI)
localVue.use(VueRouter)
describe('AppButton.vue', () => {
  // 测试内容：data
  // 自定义props传递给AppButton组件，判断组件有获取到props
  it('data test', async () => {
    const propsdata = {
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
    const wrapper = mount(answerquestion, {
      propsData:propsData,
      stubs:[
        'router-link',"Row"
      ]
    })
    await wrapper.vm.$nextTick()
    // 创建mock函数
    expect(wrapper.vm._data.password).toBe('12345678')
    // 每个it最后都应该销毁wrapper
    wrapper.destroy()
  })
})
