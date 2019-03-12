import confirm from '@/lib/components/confirm'
import msg from '@/lib/components/msg'
let zq = {
    install(Vue, option) {
        // 不重复install
        if (zq.installed) return
        zq.installed = true;
        // 扩展构造对象
        let $vm;// 存储Vue实例
        // 1. 添加全局方法或属性
        Vue.myGlobalMethod = function () {}

        // 2. 添加全局资源
        Vue.directive('my-directive', {})
        // 3. 通过全局mixin方法添加一些组件选项
        Vue.mixin({})
        // 4. 添加实例方法

        /**
         * 实例化组件方法
         **/
        Vue.$instance=function(component){
            let Ext = Vue.extend(component);
            $vm = new Ext({
                el: document.createElement('div')
            })
            // 挂载到dom中
            document.body.appendChild($vm.$el);
        },
            Vue.prototype.$hide = function () {
                $vm.show = false;
            },
            Vue.prototype.$msg=function(message, options){

                if($vm){
                    $vm.show = false;
                }

                Vue.$instance(msg)
                $vm.message = message;
                var type = typeof options === 'object';
                console.log($vm);
                if (type) {
                    // 给对象赋值
                    $vm.Zindex = options.Zindex||999;
                    $vm.duration = options.duration||3000;
                    $vm.masked=options.masked||false;
                }
                setTimeout(()=>{
                    $vm.show =false;
                },$vm.duration)
                $vm.show = true;

            },
            Vue.prototype.$confirm = function (message, options) {
                Vue.$instance(confirm)

                var type = typeof options === 'object';

                if (type) {
                    $vm.btn = options.btn || ['确定', '取消'];
                    for (let value in options.btnFun) {
                        console.log(value);
                        $vm.btnFun = function (e, index) {
                            let ty = typeof options.btnFun[index] == 'function';
                            if (ty) {
                                options.btnFun[index]();
                            }
                        }
                    }
                }
                ;
                // 给对象赋值
                $vm.Zindex = options.Zindex || 999;
                $vm.message = message || 'message';
                $vm.show = true;
            }

    }
};

export default zq;