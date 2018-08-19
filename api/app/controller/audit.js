const Controller = require('../core/baseController');
const {saveFile} = require("../utils/upload")

const applyRule = {
    productIds: {type: 'string', required: true},
    chatImg: {type: 'string', required: true},
    voucherImg: {type: 'string', required: true},
    accountImg: {type: 'string', required: true},
    serviceCharge: {type: 'number', required: true},//服务费
    remark: {type: 'string', required: false, allowEmpty: true},//备注
}

const auditRule = {
    id: {type: 'string', required: true},
    result: {type: 'enum', values: [0, 1]},//图片类型 0驳回 1通过
    notes: {type: 'string', required: false},
}


const listRule = {
    page: {type: 'int', required: true},
    rows: {type: 'int', required: true},
    result: {type: "string", required: false},
}

const infoRule = {
    id: {type: 'string', required: true}
}


class AuditController extends Controller {

    async do() {
        if (!this.checkPower("audit_do")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(auditRule, request.body);
        let reuslt = await service.audit.do(request.body)
        this.output(reuslt)
    }

    async list() {
        if (!this.checkPower("audit_list")) {
            return
        }
        const {request, service} = this.ctx;
        let params = this.parseParams(request.query)
        this.ctx.validate(listRule, params)

        if (params.result && params.result.indexOf(",")) {
            params.result = params.result.split(',')
        }

        let reuslt = await service.audit.list(params)
        this.output(reuslt)
    }

    async apply() {
        if (!this.checkPower("audit_apply")) {
            return
        }
        const ctx = this.ctx;
        const {service} = ctx;
        const parts = ctx.multipart();
        let part;
        let params = {}
        try {
            while ((part = await parts()) != null) {
                if (part.length) {
                    params[part[0]] = part[1]
                } else { //保存图片文件
                    let pullPath = await saveFile(`temp/${part.filename}`, part)
                    params[part.fieldname] = pullPath
                }
            }
            params.serviceCharge = Number.parseFloat(params.serviceCharge)
        } catch (e) {
            return this.output(e)
        }
        ctx.validate(applyRule, params);
        params.productList = params.productIds.split(',')
        delete params.productIds
        let reuslt = await service.audit.apply(params)
        this.output(reuslt)
    }


    async info() {
        if (!this.checkPower("audit_info")) {
            return
        }
        const {request, service} = this.ctx;
        let params = this.parseParams(request.query)
        this.ctx.validate(infoRule, params)
        let reuslt = await service.audit.info(params.id)
        this.output(reuslt)
    }
}

module.exports = AuditController;
