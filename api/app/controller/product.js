const Controller = require('../core/baseController');
const {saveFile} = require("../utils/upload")

const listRule = {
    page: {type: 'int', required: true},
    rows: {type: 'int', required: true},
    status: {type: 'number', required: false}
};

const prodRule = {
    name: {type: 'string', required: true},//商品名称
    img: {type: 'string', required: true},//商品图片
    imgType: {type: 'enum', values: [0, 1]},//图片类型 0本地图片 1链接
    costPrice: {type: 'number', required: true, min: 0},//原价
    price: {type: 'number', required: true, min: 0},//券后价
    commission: {type: 'number', required: true, min: 0},//佣金
    voucherLink: {type: 'string', required: true},//券链接
    orderLink: {type: 'string', required: true},//下单链接
    desc: {type: 'string', required: true},//商品文案
    serviceCharge: {type: 'number', required: true, min: 0},//服务费
    qq: {type: 'number', required: false},
    phone: {type: 'string', required: false, allowEmpty: true},//电话
    wx: {type: 'string', required: false, allowEmpty: true},//微信
    beginTime: {type: 'number', required: true},//开始时间
    endTime: {type: 'number', required: true},//结束时间
    remark: {type: 'string', required: false, allowEmpty: true},//备注
};

const infoRule = {
    id: {type: 'string', required: true}
};

const cancelRule = {
    id: {type: 'string', required: true},
    reason: {type: 'string', required: true}
};

const scoreRule = {
    page: {type: 'int', required: true},
    rows: {type: 'int', required: true},
};


const urgeRule = {
    page: {type: 'int', required: true},
    rows: {type: 'int', required: true},
    day: {type: "string", required: true, format: /^(\d(-[0-9]\d?)?)$|^(>[1-9]\d*)$/}
}

const dayTime = 24 * 60 * 60 * 1000

const getDateString = function (time) {
    let date = new Date(time)
    return `${date.getFullYear()}-${String((date.getMonth() + 1)).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const getBetweenDate = function (dateString) {
    let year = dateString.split('-')[0]
    let month = Number.parseInt(dateString.split('-')[1])

    let date = new Date()
    date.setFullYear(year)
    date.setMonth(month - 1)
    date.setDate(1)
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setMilliseconds(0)
    let beginTime = date.getTime()

    let day = 31//
    if ([0, 2, 4, 6, 7, 9, 11].indexOf(month) == -1) {
        if (month == 1) {
            day = 28
            if (year % 100 === 0 % year % 400 === 0) {
                day = 29
            } else if (year % 100 != 0 && year % 4 === 0) {
                day = 29
            }
        } else {
            day = 30
        }
    }

    date.setDate(day)
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    date.setMilliseconds(999)

    let endTime = date.getTime()
    return {beginTime, endTime}
}

class ProductController extends Controller {
    async list() {
        if (!this.checkPower("product_list")) {
            return
        }
        const {request, service} = this.ctx;
        let params = this.parseParams(request.query)
        if (typeof params.status == "string") {
            params.status = Number.parseInt(params.status)
        }

        if (params.productId) {
            params.productId = params.productId.trim()
        }

        this.ctx.validate(listRule, params);
        let reuslt = await service.product.list(params)

        this.output(reuslt)
    }

    async edit() {
        if (!this.checkPower("product_edit")) {
            return
        }
        const ctx = this.ctx;
        const {request, service} = ctx;
        const parts = ctx.multipart();
        let part;
        let params = {}
        try {
            while ((part = await parts()) != null) {
                if (part.length) {
                    params[part[0]] = part[1] && part[1].trim()
                } else { //保存图片文件
                    let name = 'product_'
                    if (part.fieldname == 'voucherImage') {
                        name = 'voucher_'
                    }
                    let pullPath = await saveFile(`temp/${name}${Date.now()}.${part.mime.split('/').pop()}`, part)
                    params[part.fieldname] = pullPath
                }
            }
            params.imgType = Number.parseInt(params.imgType)

            if (!params.id && params.imgType == 0 && !params.img) {//如果是新增商品，并且未上传图片
                throw new Error("新增商品图片不能为空")
                return
            }

            if (!params.id && !params.voucherImage) {//如果是新增商品，并且未上传优惠券截图
                throw new Error("新增商品优惠券截图不能为空")
                return
            }

            if (params.imgType == 1 && params.img.indexOf(this.app.domian) == 0) {
                throw new Error("商品外链图片不可是本网站图片！")
                return
            }

            if (params.id && params.imgType == 0 && params.img) {
                params.img = params.img.replace(this.app.domian, "")
                if (params.img.indexOf('upload/') != 0) {
                    throw new Error("商品图片路径错误")
                    return
                }
            }


            if (params.id && params.voucherImage) {
                params.voucherImage = params.voucherImage.replace(this.app.domian, "")
                if (params.voucherImage.indexOf('upload/') != 0) {
                    throw new Error("商品优惠券截图路径错误")
                    return
                }
            }


            params.price = Number.parseFloat(params.price)
            params.costPrice = Number.parseFloat(params.costPrice)
            params.commission = Number.parseFloat(params.commission)
            params.serviceCharge = Number.parseFloat(params.serviceCharge)
            params.beginTime = Number.parseInt(params.beginTime)
            params.endTime = Number.parseInt(params.endTime)


            if (params.qq) {
                params.qq = Number.parseInt(params.qq)
            }

        } catch (e) {
            return this.output(e)
        }


        ctx.validate(prodRule, params);
        let reuslt = await service.product.edit(params)
        this.output(reuslt)
    }

    async cancel() {
        if (!this.checkPower("product_cancel")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(cancelRule, request.body);
        let reuslt = await service.product.cancel(request.body)
        this.output(reuslt)
    }

    async auditInfo() {
        if (!this.checkPower("product_auditInfo")) {
            return
        }
        const {request, service} = this.ctx;
        this.ctx.validate(infoRule, request.query);
        let reuslt = await service.product.auditInfo(request.query.id)
        this.output(reuslt)
    }

    async score() {
        if (!this.checkPower("product_score")) {
            return
        }
        const {request, service} = this.ctx;
        let params = this.parseParams(request.query)

        if (params.month) {
            let {beginTime, endTime}=getBetweenDate(params.month)
            params.beginTime = beginTime
            params.endTime = endTime
            delete params.month
        }

        if (params.name) {
            params.name = params.name.trim()
        }

        this.ctx.validate(scoreRule, params);
        let reuslt = await service.product.score(params)
        this.output(reuslt)
    }

    async urgeProductList() {
        if (!this.checkPower("urge_product_list")) {
            return
        }
        const {request, service} = this.ctx;
        let params = this.parseParams(request.query)
        this.ctx.validate(urgeRule, params)
        params.activityEndDate = []

        if (request.query.day.indexOf('>') == -1) {
            let dayArr = request.query.day.split('-').map(item=> {
                return Number.parseInt(item)
            })

            let begin = Math.max(...dayArr)
            let end = Math.min(...dayArr)
            let now = Date.now()
            for (let i = begin; i >= end; i--) {
                params.activityEndDate.push(getDateString(now - dayTime * i))
            }
        } else {
            let toDay = new Date()
            toDay.setHours(23)
            toDay.setMinutes(59)
            toDay.setSeconds(59)
            toDay.setMilliseconds(999)
            params.activityEndTime = toDay.getTime() - Number.parseInt(params.day) * dayTime
        }
        params.status = 0
        let reuslt = await service.product.list(params)
        this.output(reuslt)
    }

    async userList() {
        if (!this.checkPower("product_userList")) {
            return
        }
        let reuslt = await this.ctx.service.product.userList()
        this.output(reuslt)
    }
}

module.exports = ProductController;
