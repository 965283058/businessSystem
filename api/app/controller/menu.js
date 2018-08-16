const Controller = require('../core/baseController');

const delRule = {
    id: {type: 'string', required: true}
}

const changeStatusRule = {
    id: {type: 'string', required: true}
}

const menuRule = {
    text: {type: 'string', required: true},
    router: {type: 'string', required: true},
    icon: {type: 'string', required: true},
    parentId: {type: 'string', required: false},
    index: {type: 'int', required: true},
    apis: {type: 'array', required: false},//后端接口权限（manage）
    status: {type: 'int', required: true, min: 0, max: 1}, // 0禁用 1正常
}


class MenuController extends Controller {

    async edit() {
        const {request, service} = this.ctx;
        this.ctx.validate(menuRule, request.body);
        let reuslt = await service.menu.edit(request.body)
        this.output(reuslt)
    }

    async del() {
        if (this.checkPower("menu_del")) {
            const {request, service} = this.ctx;
            this.ctx.validate(delRule, request.body);
            let reuslt = await service.menu.del(request.body.id)
            this.output(reuslt)
        }
    }


    async changeStatus() {
        if (this.checkPower("menu_changeStatus")) {

            const {request, service} = this.ctx;
            this.ctx.validate(changeStatusRule, request.body);
            let reuslt = await service.menu.changeStatus(request.body.id)
            this.output(reuslt)
        }
    }


    async treeMenu() {
        const {request, service} = this.ctx;
        let all = false
        if (request.query.all) {
            all = true
        }

        let reuslt = await service.menu.treeMenu(all)
        this.output(reuslt)
    }
}

module.exports = MenuController;
