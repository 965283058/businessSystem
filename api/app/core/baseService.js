const Service = require('egg').Service;


class BaseService extends Service {
    get Model() {
        return this.ctx.model
    }

    async getList(model, where = {}, page = 20, rows = 1, sort = {}, populate = null) {
        try {

            let total = await this.ctx.model[model].count(where)
            let query = this.ctx.model[model].find(where).sort(sort).limit(rows).skip((page - 1) * rows)
            if (populate instanceof Array) {
                populate.forEach(item=> {
                    if (item.field) {
                        query = query.populate(item.key, item.field)
                    } else {
                        query = query.populate(item.key)
                    }
                })
            }
            let rowList = await query.exec()
            return {page: page, rows: JSON.parse(JSON.stringify(rowList)), total: total}
        } catch (e) {
            return e
        }
    }

    get admin() {
        let admin = this.ctx.session.admin || null
        if (!admin) {
            let error = {status: -1, data: '登录超时！'}
            throw new Error('登录超时!')
        }
        return admin;
    }

    guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

    getDateNum() {
        let date = new Date()
        return `${date.getFullYear()}${String((date.getMonth() + 1)).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
    }

    clone(data) {
        return JSON.parse(JSON.stringify(data))
    }
}

module.exports = BaseService;