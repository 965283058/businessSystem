import Vue from 'vue'
import App from './App'
import router from './router'
import http from './plugin/http'
import extendHttp from './plugin/fetch'
import Validator from 'components/validator'
import 'element-ui/lib/theme-chalk/index.css';
import {Message, MessageBox, Loading} from 'element-ui'
import ElementUI from 'element-ui'
import DataGrid from 'components/datagrid'
import uplaod from 'components/uplaod'

Vue.use(ElementUI)
Vue.component('DataGrid', DataGrid)
Vue.component('jf-upload', uplaod)

Vue.loading = loading
Vue.Message = Message
Vue.MessageBox = MessageBox


Vue.use(http, {
    duration: 1,
    root: process.env.API_ROOT,
    timeout: 150000,
    timestamp:true,
    loading: (bool) => {
        Vue.loading(bool)
    },
    error: (text) => Vue.alert({title: "错误", text})
})

Vue.use(extendHttp)

function loading(show, text) {
    if (show) {
        this._loading = Loading.service({fullscreen: true, text: text})
    } else {
        this._loading && this._loading.close()
    }
}
Vue.component('Validator', Validator)


Validator.addRule('phone', (val, element, rule, ctx) => {
    return /^(13|14|15|17|18)\d{9}$/g.test(val.toLowerCase())
}, '{{name}}格式错误')


new Vue({
    router,
    ...App
}).$mount('#app')