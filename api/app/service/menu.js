const BaseService = require('../core/baseService');

class MenuService extends BaseService {
    async edit(info) {
        try {
            if (info.id) {
                await this.Model.AdminMenu.update({'_id': info.id}, {
                    '$set': {
                        text: info.text,
                        router: info.router,
                        icon: info.icon,
                        parentId: info.parentId,
                        index: info.index,
                        apis: info.apis,//后端接口权限（manage）
                        status: info.status  // 0禁用 1正常
                    }
                })
                await this.ctx.service.admin.updateSessionAdminPower()
            } else {
                let menu = new this.Model.AdminMenu({
                    text: info.text,
                    router: info.router,
                    icon: info.icon,
                    parentId: info.parentId,
                    index: info.index,
                    apis: info.apis,//后端接口权限（manage）
                    status: info.status  // 0禁用 1正常
                })
                await menu.save()
            }
            return true
        } catch (e) {
            return e
        }
    }

    async treeMenu(showDisable) {
        let data = null
        let admin = this.admin
        if (admin) {
            if (admin.superAdmin == 1) {
                try {
                    let where = {}
                    if (!showDisable) {
                        where = {"status": 1}
                    }
                    data = await this.Model.AdminMenu.find(where).sort({'parantId': 1, 'index': 1});
                } catch (e) {
                    return e
                }
            } else {
                data = this.admin.menus
            }
            let json = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].parentId == 0) {
                    let menu = {
                        id: data[i]._id,
                        text: data[i].text,
                        icon: data[i].icon,
                        router: data[i].router,
                        index: data[i].index,
                        apis: data[i].apis,
                        status: data[i].status,
                        parentId: data[i].parentId,
                        children: []
                    }
                    for (let j = 0; j < data.length; j++) {
                        if (data[j].parentId == data[i]._id) {
                            menu.children.push(
                                {
                                    id: data[j]._id,
                                    text: data[j].text,
                                    icon: data[j].icon,
                                    router: data[j].router,
                                    index: data[j].index,
                                    status: data[j].status,
                                    parentId: data[j].parentId,
                                    apis: data[j].apis
                                }
                            )
                        }
                    }
                    json.push(menu)
                }
            }
            return json
        }
    }

    async del(id) {
        try {
            await this.Model.AdminMenu.remove({"_id": id})
            return true
        } catch (e) {
            return e
        }
    }

    async changeStatus(id) {
        try {
            let menu = await this.Model.AdminMenu.findOne({"_id": id})
            menu.status = Math.abs(menu.status - 1)
            await menu.save()
            return true
        } catch (e) {
            return e
        }

    }
}

module.exports = MenuService;


