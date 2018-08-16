const BaseService = require('../core/baseService');
const {moveFile, delFile} = require("../utils/upload")

class AuditService extends BaseService {
    async apply(info) {
        try {
            let prodList = await this.Model.Product.find({"_id": {'$in': info.productList}})

            for (let prod of prodList) {
                if (prod.createor != this.admin._id) {
                    return new Error("您无权提交此商品")
                }
                if (![0, -1].includes(prod.status)) {
                    return new Error(`${prod.name}不可提交结算`)
                }
            }

            let dateNum = this.getDateNum()

            let chatImg = await moveFile(info.chatImg, `apply/${dateNum}/chat_${info.chatImg.split('/').pop()}`)
            let voucherImg = await moveFile(info.voucherImg, `apply/${dateNum}/voucher_${info.voucherImg.split('/').pop()}`)
            let accountImg = await moveFile(info.accountImg, `apply/${dateNum}/account_${info.accountImg.split('/').pop()}`)
            let data = {
                productList: info.productList,
                chatImg,
                voucherImg,
                accountImg,
                serviceCharge: info.serviceCharge,
                remark: info.remark,
                applyUser: this.admin._id,
                applyTime: Date.now(),
                month: `${dateNum.substring(0, 4)}-${dateNum.substring(4, 6)}`
            }

            let auditRecord = new this.Model.AuditRecord(data)
            await auditRecord.save()

            await this.Model.Product.update(
                {"_id": {'$in': info.productList}},
                {
                    status: 1,
                    '$push': {
                        record: {
                            owner: this.admin._id,
                            time: Date.now(),
                            oldStatus: 0,
                            status: 1,
                            remark: "提交审核",
                            auditId: auditRecord._id,
                        }
                    },
                    urge: 0
                },
                {multi: true}
            )
            return true
        } catch (e) {
            return e
        }
    }

    async list(params) {
        try {
            let where = {}
            if (Array.isArray(params.result)) {
                where['result'] = {'$in': params.result}
            } else if (params.result) {
                where['result'] = params.result
            }

            if (params.id) {
                where['_id'] = params.id
            }

            if (this.admin.superAdmin == -1) {//如果是普通用户只能查看自己的
                where['applyUser'] = this.admin._id
            }


            let data = await this.getList('AuditRecord', where, params.page, params.rows, {
                applyTime: 1
            }, [{key: 'productList'}, {key: 'applyUser', field: 'name'}, {key: 'auditor', field: 'name'}])

            let cloneData = JSON.parse(JSON.stringify(data))

            cloneData.rows = cloneData.rows.map(item=> {
                item.chatImg = `${this.app.domian}${item.chatImg}`
                item.voucherImg = `${this.app.domian}${item.voucherImg}`
                item.accountImg = `${this.app.domian}${item.accountImg}`
                item.serviceCharge = item.serviceCharge.toFixed(2)

                item.productList = item.productList.map(prod=> {
                    if (prod.imgType == 0) {
                        prod.img[0] = `${this.app.domian}${prod.img[0]}`
                    }
                    prod.price = prod.price.toFixed(2)
                    prod.serviceCharge = prod.serviceCharge.toFixed(2)
                    prod.costPrice = prod.costPrice.toFixed(2)

                    return prod
                })
                return item
            })


            return cloneData
        } catch (e) {
            return e
        }
    }

    async do(params) {
        try {
            let rocord = await this.Model.AuditRecord.findOne({"_id": params.id})
            if (!rocord) {
                return new Error(`未找到该条记录！`)
            }
            if (rocord.result !== -1) {
                return new Error(`该记录已由其他审核完成！审核结果：【${rocord.result == 1 ? '通过' : '驳回'}】`)
            }
            let productStatus = params.result == 1 ? 2 : -1
            let now = Date.now()
            await this.Model.Product.update(
                {"_id": {'$in': rocord.productList}},
                {
                    status: productStatus,
                    '$push': {
                        record: {
                            owner: this.admin._id,
                            time: now,
                            oldStatus: 1,
                            status: productStatus,
                            remark: `审核${params.result == 1 ? '通过' : '驳回'}`,
                            auditId: rocord._id,
                        }
                    }
                },
                {multi: true}
            )

            rocord.auditor = this.admin._id
            rocord.auditorTime = now
            rocord.result = params.result
            rocord.notes = params.notes
            await rocord.save()
            return true
        } catch (e) {
            return e
        }
    }


    async info(id) {
        try {
            let data = await this.list({id, page: 1, rows: 1})
            if (data.rows.length) {
                if (this.admin.superAdmin != -1) {//如果是管理员
                    return data.rows[0]
                } else if (data.rows[0].applyUser._id == this.admin._id) {//如果不是管理员，只能查看自己的单据
                    return data.rows[0]
                } else {
                    return new Error("您无权查看他人的审核信息")
                }
            } else {
                return new Error("无此记录")
            }
        } catch (e) {
            return e
        }
    }
}

module.exports = AuditService;