const Controller = require('../core/baseController');

const delRule = {
    id: {type: 'string', required: true}
}

const changeStatusRule = {
    id: {type: 'string', required: true}
}

const roleRule = {
    name: {type: 'string', required: true},
    menus: {type: 'array', required: true},
    apis: {type: 'array', required: true},//后端接口权限（manage）
    status: {type: 'int', required: true, min: 0, max: 1}, // 0禁用 1正常
}

const listRule = {
    page: {type: 'int', required: true},
    rows: {type: 'int', required: true},
    name: {type: "string", required: false},
    status: {type: "string", required: false},
}


class RoleController extends Controller {

    async edit() {
        if (!this.checkPower("role_edit")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(roleRule, request.body);
        let reuslt = await service.role.edit(request.body)
        this.output(reuslt)
    }

    async del() {
        if (!this.checkPower("role_del")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(delRule, request.body);
        let reuslt = await service.role.del(request.body.id)
        this.output(reuslt)
    }

    async list() {
        if (!this.checkPower("role_list")) {
            return
        }
        const {request, service} = this.ctx;
        let params = this.parseParams(request.query)
        this.ctx.validate(listRule, params)
        let reuslt = await service.role.list(params)
        this.output(reuslt)
    }

    async changeStatus() {
        if (!this.checkPower("role_changeStatus")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(changeStatusRule, request.body);
        let reuslt = await service.role.changeStatus(params)
        this.output(reuslt)
    }
}

module.exports = RoleController;
