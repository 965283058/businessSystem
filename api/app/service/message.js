const BaseService = require('../core/baseService');
const {moveFile, delFile} = require("../utils/upload")

const dayTime = 24 * 60 * 60 * 1000 - 1
class MessageService extends BaseService {


    async send(params) {
        try {
            let admins = await this.Model.Product.distinct('createor', {_id: {'$in': params.productList}})
            let userList = []
            admins.forEach(item=> {
                userList.push({
                    user: item,
                    status: 0
                })
            })

            let message = new this.Model.Message({
                content: params.content,
                userList: userList,
                type: 0,
                time: Date.now(),
                productList: params.productList,
            })
            await message.save()
            await this.Model.Product.update(
                {_id: {'$in': params.productList}},
                {$inc: {urge: 1}},
                {multi: true}
            )
            return true
        } catch (e) {
            return e
        }
    }


    async sendAll(params) {
        try {
            let where = {}
            if (params.type == 0) {
                where["subperAdmin"] = -1 //查询用户
            } else if (params.type == 1) {
                where["subperAdmin"] = 0//查询管理员
            } else {
                where["subperAdmin"] = {'$ne': 1} //查询非超级管理员
            }
            let admins = await this.Model.Admin.find(where, '_id')
            let userList = []
            admins.forEach(item=> {
                userList.push({
                    user: item,
                    status: 0
                })
            })

            let message = new this.Model.Message({
                content: params.content,
                userList: userList,
                type: params.type,
                time: Date.now(),
                productList: []
            })
            await message.save()
            return true
        } catch (e) {
            return e
        }
    }

    async read(id) {
        try {
            await this.Model.Message.update(
                {
                    _id: id,
                    userList: {$elemMatch: {user: this.admin._id}}
                },
                {$set: {"userList.$.status": 1}}
            )
            return true
        } catch (e) {
            return e
        }
    }

    async list() {
        try {

            let where = {
                'userList': {
                    '$elemMatch': {
                        'status': 0,
                        'user': this.admin._id
                    }
                }
            }
            if (this.admin.superAdmin == -1) {
                where.type = {'$in': [0, 2]}
            } else if (this.admin.superAdmin == 0) {
                where.type = {'$in': [1, 2]}
            } else {
                return []
            }
            let messageList = await this.Model.Message.find(where, 'content')
            return this.clone(messageList).map(item=> {
                if (!item.content) {
                    item.content = "您有一条商品催单消息"
                }
                return item
            })
        } catch (e) {
            return e
        }
    }
}

module.exports = MessageService;