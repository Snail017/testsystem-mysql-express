<template>
    <quill-editor ref="myQuillEditor" :options="editorOption" v-model="editordata.editorTxt" ></quill-editor>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {quillEditor, Quill} from 'vue-quill-editor'
    import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
    Quill.register('modules/ImageExtend', ImageExtend)
    export default {
        name: "testeditor",
        data(){
            return{
                // 富文本框参数设置
                editorOption: {
                    placeholder:this.editordata.hasOwnProperty('placeholder')?this.editordata.placeholder:'请在此输入',
                    modules: {
                        ImageExtend: {
                            loading: true,
                            name: 'img',
                            action: '/UpLoad/Uploadpic',
                            // response 为一个函数用来获取服务器返回的具体图片地址
                            // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
                            // 则 return res.data.url
                            response: (res) => {
                                if(res.status==0){
                                    return res.data.img;
                                }else{
                                    console.log(res);
                                    return ''
                                }
                            },
                            header:(xhr)=>{
                                console.log(xhr)

                            },
                            // xhr.setRequestHeader('myHeader','myValue')
                            // formData.append('token', 'myToken')
                            // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
                            change:(xhr, formData)=> {
                                console.log(xhr)
                            }
                        },
                        // 如果不上传图片到服务器，此处不必配置
                        toolbar: {
                            container: container, //container为工具栏，此次引入了全部工具栏，也可自行配置
                            handlers: {
                                'image': function () {
                                    QuillWatch.emit(this.quill.id)
                                }
                            }
                        }
                    }
                },
            }
        },
        components:{quillEditor},
        props:['editordata'],
        mounted(){
            this.editorOption.placeholder='12456'
        }
    }
</script>

<style scoped>

</style>