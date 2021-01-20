import { mount, createLocalVue } from '@vue/test-utils'
import answerquestion from '@/views/home.vue'
import ViewUI from 'view-design'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(ViewUI)
localVue.use(VueRouter)
describe('home.vue', () => {
  // 测试内容：data
  // 自定义props传递给AppButton组件，判断组件有获取到props
  it('data test', async () => {
    const wrapper = mount(answerquestion, {
      stubs:[
        'router-link',"Row"
      ]
    })
  
    // 每个it最后都应该销毁wrapper
    wrapper.destroy()
  })
})
