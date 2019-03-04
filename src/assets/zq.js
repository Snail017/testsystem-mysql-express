var zq={};
zq.install = function (Vue, options) {
    // 1. 添加全局方法或属性
    Vue.myGlobalMethod = function () {

    }
    // 2. 添加全局资源
    Vue.directive('my-directive', {})
    // 3. 通过全局mixin方法添加一些组件选项
    Vue.mixin({})
    // 4. 添加实例方法
    Vue.prototype.$match = function (search, name) {
        /**
         *   从url中正则匹配得到数据
         **/
        var reg = new RegExp("[?&]" + name + "=([^&]*)(&|$)", "i");
        var r = search.match(reg);
        if (r != null) return unescape(r[1]);
        return null;
    }
    Vue.prototype.$layer = function (search, name) {


    }

}
export default zq;