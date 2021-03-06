import Vue from 'vue'

export const post = function (url, params, opts = {}) {
    opts.headers = getHeaders(opts.headers)
    if (!(params instanceof FormData)) {
        opts["headers"]["content-type"] = 'application/json'
    }
    return Vue.http.post(url, params, opts).then(result, err)
}

export const get = function (url, params, opts = {}) {
    return Vue.http.get(url, Object.assign({}, {params: params}, opts)).then(result, err)
}

const confirmLogin = function (config, message) {
    if (config.transformLogin !== false) {
        Vue.nextTick(()=> {
            Vue.Message.closeAll()
            Vue.MessageBox({
                title: "提示",
                message: message,
                type: 'warning'
            }).then(data=> {
                goLogin()
            }).catch(err=> {
                goLogin()
            })
        })
    }
}
const goLogin = function () {
    window.sessionStorage.removeItem("admin")
    window.location.href = window.location.origin+`${process.env.ROUTER_ROOT}/login`.replace(/\/\//g,'/')
}

let result = response => {
    if (response.status == 200) {
        if (response.data.status === 0) {
            return Promise.resolve(response.data.data)
        } else if (response.data.status == -1) {
            confirmLogin(response.config, "您的登录已失效，请重新登录！")
            return Promise.reject({message: ''})
        } else {
            return Promise.reject(response.data)
        }
    } else {
        if (response.data.message == "invalid csrf token") {
            confirmLogin(response.config, "您的安全码已失效，请重新登录！")
            return Promise.reject({message: ''})
        } else {
            return err(response)
        }
    }
}

let err = response => {
    if (typeof response === 'object') {
        // 处理http状态码
        if (`${response.status}`.charAt(0) === '4') {
            if (response.status != 400) {
                return Promise.reject({message: '请求资源不存在'})
            } else {
                return Promise.reject({message: '上传文件格式不允许'})
            }
        } else if (`${response.status}`.charAt(0) === '5') {
            return Promise.reject({message: '服务器繁忙，请稍后再试'})
        } else if (`${response.status}`.charAt(0) === '6') {
            return Promise.reject({message: '网络超时'})
        }
        return Promise.reject({message: '请求失败'})
    } else if (typeof response === 'string') {
        return Promise.reject({message: response})
    } else {
        return Promise.reject({message: '请求失败'})
    }
}


const plugin = (Vue, opts) => {
    if (!Vue.prototype.$post) {
        Vue.prototype.$post = post
    }

    if (!Vue.prototype.$get) {
        Vue.prototype.$get = get
    }

}

export default plugin

const getHeaders = (headers)=> {
    if (!headers) {
        headers = {}
    }
    headers['x-csrf-token'] = window.localStorage.getItem("token")
    return headers
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURIComponent(arr[2]);
    else
        return null;
}