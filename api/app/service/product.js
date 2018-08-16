const BaseService = require('../core/baseService');
const {moveFile, delFile} = require("../utils/upload")

const dayTime = 24 * 60 * 60 * 1000 - 1


const getDateString = function (time) {
    let date = new Date(time)
    return `${date.getFullYear()}-${String((date.getMonth() + 1)).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
const getDateNum = function () {
    let date = new Date()
    return `${date.getFullYear()}${String((date.getMonth() + 1)).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
}

class ProductService extends BaseService {


    async list(params) {
        try {
            let where = {}
            if (this.admin.superAdmin == -1) {//如果是普通用户只能查看自己的
                where['createor'] = this.admin._id
            }
            if (params.status !== undefined) {
                if (Array.isArray(params.status)) {
                    where['status'] = {'$in': params.status}
                } else {
                    where['status'] = params.status
                }
            }
            if (params.activityEndDate) {
                where['endDate'] = {'$in': params.activityEndDate}
            }

            let refs = null
            if (this.admin.superAdmin != -1) {
                refs = [{key: 'createor', field: 'name'}]
            }
            let data = await this.getList('Product', where, params.page, params.rows, {
                index: 1,
                createTime: -1
            }, refs)

            let cloneData = this.clone(data)

            cloneData.rows = cloneData.rows.map(item=> {
                if (item.imgType == 0) {
                    item.img[0] = `${this.app.domian}${item.img[0]}`
                }
                item.price = item.price.toFixed(2)
                item.serviceCharge = item.serviceCharge.toFixed(2)
                item.costPrice = item.costPrice.toFixed(2)
                return item
            })

            return cloneData
        } catch (e) {
            return e
        }
    }

    async edit(info) {
        let data = {
            name: info.name, //名称
            img: [info.img],//图片
            imgType: info.imgType,//图片类型 0本地图片 1链接
            costPrice: info.costPrice,//原价
            price: info.price,//券后价
            voucherLink: info.voucherLink,//券链接
            orderLink: info.orderLink,//下单链接
            desc: info.desc,//商品文案
            serviceCharge: info.serviceCharge,//服务费
            qq: info.qq,
            phone: info.phone,//电话
            status: 0, //0 待结算 1已结算 -1已驳回  -10 已取消
            beginTime: info.beginTime,//开始时间
            endTime: info.endTime + dayTime,//结束时间
            endDate: getDateString(info.endTime),
            remark: info.remark,//备注
            createTime: Date.now(),//创建日期
            createor: this.admin._id
        }

        try {
            if (info.id) {
                let prod = await this.Model.Product.findOne({"_id": info.id})
                if (prod.createor != this.admin._id) {
                    return new Error("您无权修改此商品")
                }

                if (prod.imgType == 0 && info.img != prod.img[0]) {//如果以前是本地图片，且本次上传变化了
                    await delFile(prod.img[0])
                }


                if (info.imgType == 0) {//如果新上传的是本地图片
                    let prodImg = await moveFile(info.img, `product/${getDateNum()}/${info.img.split('/').pop()}`)
                    data.img = [prodImg]
                }

                await this.Model.Product.update({"_id": info.id}, {
                    "$set": data
                })

            } else {
                if (info.imgType == 0) {
                    let prodImg = await moveFile(info.img, `product/${getDateNum()}/${info.img.split('/').pop()}`)
                    data.img = [prodImg]
                }
                data.record = []
                let prod = new this.Model.Product(data)
                await prod.save()
            }
            return true
        } catch (e) {
            return e
        }
    }

    async cancel(id, status) {
        try {
            let prod = await this.Model.Product.findOne({"_id": id})
            if (prod) {
                if (prod.createor != this.admin._id) {
                    return new Error("您无权修改此商品")
                }
                if (prod.status != 0 && prod.status != -1) {
                    return new Error("该商品状态更改")
                }
                await this.Model.Product.update({"_id": id}, {
                    "$set": {status: -10}
                })
                return true
            } else {
                return new Error("无此商品")
            }
        } catch (e) {
            return e
        }
    }

    async auditInfo(id) {
        try {
            let prod = await this.Model.Product.findOne({"_id": id})
            if (prod) {
                if (this.admin.subperAdmin == -1 && prod.createor != this.admin._id) {
                    return new Error("您无权查看此商品的审核信息")
                }
                if (!prod.record.length) {
                    return new Error("该商品无审核记录")
                }
                let lastAuditId
                for (let i = prod.record.length - 1; i >= 0; i--) {//查询到最后一次审核记录
                    if (prod.record[i].status == 2 || prod.record[i].status == -1) {
                        lastAuditId = prod.record[i].auditId
                        break;
                    }
                }
                if (lastAuditId) {
                    return await this.ctx.service.audit.info(lastAuditId)
                } else {
                    return new Error("该商品无审核记录")
                }
            } else {
                return new Error("无此商品")
            }
        } catch (e) {
            return e
        }
    }


    async score(params) {
        let where = {result: 1}
        if (params.beginTime && params.endTime) {
            where["applyTime"] = {
                "$gte": params.beginTime,
                "$lte": params.endTime
            }
        }

        if (params.activityBeginTime) {
            where["endTime"] = {
                "$lte": params.activityBeginTime
            }
        }

        if (this.admin.superAdmin == -1) {//如果是普通用户只能查看自己的
            where['applyUser'] = this.app.mongoose.Types.ObjectId(this.admin._id)  //聚合查询比较傻逼，不会自己转换ObjectId
        }


        let data = await this.Model.AuditRecord.aggregate([
            {$match: where},
            {$group: {_id: {applyUser: "$applyUser", month: '$month'}, score: {$sum: "$serviceCharge"}}},
            {$skip: (params.page - 1) * params.rows},
            {$limit: params.rows}
        ])

        let ids = data.map(item=>item._id.applyUser)
        let userList = await this.Model.Admin.find({"_id": {'$in': ids}})

        let cloneData = this.clone(data)
        cloneData = cloneData.map(item=> {
            let user = userList.find(user=>user._id == item._id.applyUser)
            item.name = user.name
            return item
        })
        return {page: params.page, rows: cloneData}
    }
}

module.exports = ProductService;