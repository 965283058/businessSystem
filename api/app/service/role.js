const BaseService = require('../core/baseService');

class RoleService extends BaseService {
    async edit(info) {
        try {
            let data = {
                name: info.name,
                menus: info.menus,
                apis: info.apis,
                status: info.status,  // 0禁用 1正常
                editor: this.admin._id,
                editTime: Date.now()
            }
            if (info.id) {
                await this.Model.AdminRole.update({'_id': info.id}, {
                    '$set': data
                })
                await this.ctx.service.admin.updateSessionAdminPower()
            } else {
                let menu = new this.Model.AdminRole(data)
                await menu.save()
            }
            return true
        } catch (e) {
            return e
        }
    }

    async list(params) {

        let where = {}
        if (params.name) {
            where.name = new RegExp(params.name)
        }
        if (params.status) {
            where.status = params.status
        }

        try {
            let data = await this.getList('AdminRole', where, params.page, params.rows, {"editTime": -1}, [
                {
                    key: 'menus'
                },
                {
                    key: 'editor',
                    field: 'name'
                }
            ])
            return data
        } catch (e) {
            return e
        }
    }

    async del(id) {
        try {
            await this.Model.AdminRole.remove({"_id": id})
            return true
        } catch (e) {
            return e
        }
    }

    async changeStatus(id) {


        try {
            let role = await this.Model.AdminRole.findOne({"_id": id})
            role.status = Math.abs(menu.status - 1)
            await role.save()
            return true
        } catch (e) {
            return e
        }
    }
}

module.exports = RoleService;


