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

const toLogin = function () {
    window.location.href = `${window.location.origin}/login`
}

let result = response => {
    if (response.data.status == 0) {
        return Promise.resolve(response.data.data)
    } else if (response.data.status == -1) {
        window.sessionStorage.removeItem("admin")
        if (response.config.transformLogin === undefined || response.config.transformLogin === true) {
            Vue.nextTick(()=> {
                Vue.Message.closeAll()
                Vue.MessageBox({
                    title: "提示",
                    message: "您的登录已失效，请重新登录！",
                    type: 'warning'
                }).then(data=> {
                    toLogin()
                }).catch(err=> {
                    toLogin()
                })
            })
        }
        return Promise.reject({message: ''})
    } else {
        return Promise.reject(response.data)
    }
}

let err = response => {
    // 处理http状态码
    if (`${response.status}`.charAt(0) === '4') {
        if (response.status != 400) {
            return Promise.reject({message: '请求资源不存在'})
        } else {
            return Promise.reject({message: '上传文件格式不允许'})
        }
    } else if (`${response.status}`.charAt(0) === '5') {
        return Promise.reject({message: '服务器繁忙，请稍后再试'})
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