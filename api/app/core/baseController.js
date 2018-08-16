const {Controller} = require('egg');


class BaseController extends Controller {
    get admin() {
        let admin = this.ctx.session.admin || null
        if (!admin) {
            let error = {status: -1, data: '登录超时！'}
            throw error
        }
        return admin;
    }

    parseParams() {
        let query = this.ctx.request.query
        if (query.page) {
            query.page = Number.parseInt(query.page)
        }
        if (query.rows) {
            query.rows = Number.parseInt(query.rows)
        }

        return query
    }


    checkPower(apiCode) {
        if (this.admin.superAdmin != 1 && this.admin.apis.indexOf(apiCode) == -1) {
            let err = new Error(`无[${apiCode}]权限!`)
            err.status = 403
            throw err
        }
        return true
    }

    output(data, message = '') {
        if (data instanceof Error) {
            this.ctx.body = {
                status: 10,
                message: data.message,
            }
        } else {
            this.ctx.body = {
                status: 0,
                message: message,
                data: data
            }
        }
    }

}
module.exports = BaseController;