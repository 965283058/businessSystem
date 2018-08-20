const Controller = require('../core/baseController');

const listRule = {
    page: {type: 'int', required: true},
    rows: {type: 'int', required: true},
    name: {type: "string", required: false, allowEmpty: true},
    status: {type: "string", required: false},
}

const adminRule = {
    email: {type: 'email', required: true},
    name: {type: 'string', required: true},
    superAdmin:{type: 'enum', values: [0, -1]},// 0管理员 -1普通用户
    power: {type: "array", required: true},
    status: {type: "int", required: true},
}

const loginRule = {
    userName: {type: 'string', required: true},
    pwd: {type: 'string', required: true},
}

const delRule = {
    id: {type: 'string', required: true}
}

const changeStatusRule = {
    id: {type: 'string', required: true}
}

const resetPwdRule = {
    id: {type: 'string', required: true}
}
const changePwdRule = {
    pwd: {type: 'string', required: true},
    oldPwd: {type: 'string', required: true}
}

class AdminController extends Controller {
    async login() {
        const {request, service} = this.ctx;
        this.ctx.validate(loginRule, request.body)
        let reuslt = await service.admin.login(request.body)
        this.output(reuslt)
    }

    async logout() {
        this.ctx.session.admin = null;
        this.output(true)
    }

    async changePwd() {
        const {request, service} = this.ctx;
        request.body.pwd = request.body.pwd.trim()
        request.body.oldPwd = request.body.oldPwd.trim()
        this.ctx.validate(changePwdRule, request.body);
        let reuslt = await service.admin.changePwd(request.body)
        this.output(reuslt)
    }


    async edit() {
        if (!this.checkPower("admin_edit")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(adminRule, request.body);
        let reuslt = await service.admin.edit(request.body)
        this.output(reuslt)
    }

    async del() {
        if (!this.checkPower("admin_del")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(delRule, request.body);
        let reuslt = await service.admin.del(request.body.id)
        this.output(reuslt)
    }

    async resetPwd() {
        if (!this.checkPower("admin_resetPwd")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(resetPwdRule, request.body);
        let reuslt = await service.admin.resetPwd(request.body.id)
        this.output(reuslt)
    }



    async changeStatus() {
        if (!this.checkPower("admin_changeStatus")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(changeStatusRule, request.body);
        let reuslt = await service.admin.changeStatus(request.body.id)
        this.output(reuslt)
    }


    async list() {
        if (!this.checkPower("admin_list")) {
            return
        }
        const {request, service} = this.ctx;
        let params = this.parseParams(request.query)
        this.ctx.validate(listRule, params)
        let reuslt = await service.admin.list(params)
        this.output(reuslt)
    }

    async roleList() {
        const {request, service} = this.ctx;
        let reuslt = await service.admin.roleList()
        this.output(reuslt)
    }
}

module.exports = AdminController;
