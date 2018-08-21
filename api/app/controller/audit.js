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
    result: {type: 'enum', values: [0, 1]},//审核结果 0驳回 1通过
    notes: {type: 'string', required: false, allowEmpty: true},
}


const listRule = {
    page: {type: 'int', required: true},
    rows: {type: 'int', required: true},
    result: {type: "string", required: false, allowEmpty: true},
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
        if (request.body.result == 0 && !request.body.notes) {
            throw new Error("请填写驳回理由")
            return
        }
        let reuslt = await service.audit.do(request.body)
        this.output(reuslt)
    }

    async list() {
        if (!this.checkPower("audit_list")) {
            return
        }
        const {request, service} = this.ctx;
        let params = this.parseParams(request.query)
        if (params.productId) {
            params.productId = params.productId.trim()
        }
        this.ctx.validate(listRule, params)

        if (params.result && params.result.indexOf(",") > -1) {
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
            let now = Date.now()
            while ((part = await parts()) != null) {
                if (part.length) {
                    params[part[0]] = part[1]
                } else { //保存图片文件
                    let pullPath = await saveFile(`temp/${part.fieldname}_${now}`, part)
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
