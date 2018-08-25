import axios from 'axios'

function plugin(Vue, opts) {
    let http = axios.create()

    opts = Object.assign({}, {
        root: '',
        headers: {},
        loading: noop,
        timeout: 20000,
        duration: 1000,
        timestamp: false,
        credentials: false,
        validateStatus: null,
        autoFixedError: true,
        error: function (message) {
            console.error("======http ajax error=======", message, "========================")
        }
    }, opts)

    http.defaults.baseURL = opts.root
    http.defaults.headers = opts.headers
    http.defaults.timeout = opts.timeout
    http.defaults.duration = opts.duration
    http.defaults.withCredentials = opts.credentials
    http.defaults.validateStatus = opts.validateStatus

    requestTimeoutHandler(http, opts)
    requestLoadingHandler(http, opts)
    requestTimestampHandler(http, opts)
    requestRepeatHandler(http, opts)

    if (opts.autoFixedError) {
        responseStatusHandler(http, opts)
    }

    Vue.http = http
    Vue.prototype.$http = http
}


function requestTimeoutHandler(http, opts) {
    http.interceptors.response.use((res) => res, (err) => {
        if (err.code === 'ECONNABORTED' || err.message === 'Network Error') {
            return Promise.resolve({config: err.config, status: 601, statusText: '网络超时'})
        }
    })
}

function requestLoadingHandler(http, opts) {
    http.interceptors.request.use((config) => {
        config.loadingTimeout = 0
        config.loadingShow = false

        if (!config.onLine) {
            return config
        }

        if (config.duration !== 0) {
            config.loadingTimeout = setTimeout(() => {
                opts.loading(config.loadingShow = true)
            }, config.duration)
        }

        return config
    })

    http.interceptors.response.use((res) => {
        clearTimeout(res.config.loadingTimeout)

        if (res.config.loadingShow) {
            opts.loading(res.config.loadingShow = false)
        }

        return res
    })
}

function requestTimestampHandler(http, opts) {
    http.interceptors.request.use((config) => {
        if (!config.onLine) {
            return config
        }

        if (config.method.toLowerCase() === 'get' && opts.timestamp) {
            config.url = `${config.url}${config.url.indexOf('?') < 0 ? '?' : '&'}t=${Date.now()}`
        }

        return config
    })
}

function requestRepeatHandler(http, opts) {
    let cache = []

    http.interceptors.request.use((config) => {
        config.requestId = ''

        if (!config.onLine) {
            return config
        }

        if (config.method.toLowerCase() === 'get') {
            config.requestId = `${config.method.toLowerCase()}${config.url}${config.params ? JSON.stringify(config.params) : ''}`
        }

        if (config.method.toLowerCase() === 'post') {
            config.requestId = `${config.method.toLowerCase()}${config.url}${config.data ? JSON.stringify(config.data) : ''}`
        }

        if (cache.indexOf(config.requestId) === -1) {
            cache.push(config.requestId)
        } else {
            console.warn('The last request was in the pending state, not to send multiple requests')
            return Promise.reject('repeat requests')
        }

        return config
    })

    http.interceptors.response.use((res) => {
        cache.splice(cache.indexOf(res.config.requestId), 1)
        return res
    })
}

function responseStatusHandler(http, opts) {
    http.interceptors.response.use((res) => {
        if (res.status === 601) {
            return Promise.reject(res.statusText)
        }
        return res
    })
}

function noop() {
}

export default plugin