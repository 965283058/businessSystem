const BaseService = require('../core/baseService');
const crypto = require('crypto');

class AdminService extends BaseService {

    async login(info) {
        let admin = null
        try {
            if (info.userName.indexOf("@") > 0) {
                admin = await this.Model.Admin.findOne({"email": info.userName})
            } else {
                admin = await this.Model.Admin.findOne({"name": info.userName})
            }
        } catch (e) {
            return e
        }
        if (!admin) {
            return new Error("该用户不存在!")
        }


        let pwd_md5 = this.getAdminCryptoPwd(info.pwd);

        if (admin.pwd == pwd_md5) {
            if (admin.errCount >= 5) {
                return new Error("账号锁定中!")
            }
            if (admin.status == 0) {
                return new Error("账号已禁用!")
            }
            admin.lastLoginTime = Date.now();
            admin.errCount = 0;
            await admin.save();
            this.ctx.session.admin = admin
            if (admin.superAdmin != 1) { //如果是普通用户
                await this.updateSessionAdminPower()
            }
            return {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                power: admin.power,
                superAdmin: admin.superAdmin,
                job: admin.job,
                apis:this.admin.apis
            }
        } else {
            if (admin.errCount < 5) {
                admin.errCount++;
                await admin.save();
                return new Error("用户名或密码输入错误!")
            } else {
                setTimeout(()=> {
                    admin.errCount = 0;
                    admin.save();
                }, 1000 * 60 * 30);
                return new Error("密码输入错误超过5次,账号锁定半小时!")
            }
        }
    }

    async changePwd(info) {


        if (info.oldPwd.length == 0) {
            return new Error("原密码不能为空!")
        }

        if (!/^[\S]{6,20}$/.test(info.pwd)) {
            return new Error("新密码必须为6-35位非空字符!")
        }

        let oldPwd_md5 = this.getAdminCryptoPwd(info.oldPwd)
        let admin = this.admin

        if (oldPwd_md5 !== admin.pwd) {
            return new Error("原密码不正确，请重试！")
        }


        let pwd_md5 = this.getAdminCryptoPwd(info.pwd)

        if (pwd_md5 == oldPwd_md5) {
            return new Error("新密码不可与原密码一样！")
        }

        try {
            await this.Model.Admin.update({_id: admin._id}, {
                '$set': {
                    pwd: pwd_md5
                }
            })
            admin.pwd = pwd_md5
            this.ctx.session.admin = admin
            return true
        } catch (e) {
            return e
        }
    }

    async list(params) {


        let status = params.status || [0, 1];
        let where = {}
        if (this.admin.superAdmin != 1) {
            where["status"] = {'$nin': [-1]}
        }
        if (this.admin.superAdmin != 1) {
            where["superAdmin"] = {'$in': [-1, 0]}
        }
        if (params.name) {
            where.name = new RegExp(params.name)
        }
        if (params.status) {
            if (where.status) {
                where.status['$in'] = params.status
            } else {
                where["status"] = {'$in': params.status}
            }
        }

        try {
            let data = await this.getList('Admin', where, params.page, params.rows, {"createTime": -1}, [
                {
                    key: 'power',
                    field: 'name'
                },
                {
                    key: 'creator',
                    field: 'name'
                }
            ])
            return data
        } catch (e) {
            return e
        }
    }

    async edit(info, system = false) {
        let data = {
            email: info.email,
            name: info.name,
            job: info.job,
            power: info.power,
            status: info.status,
            superAdmin: info.superAdmin
        }
        try {
            if (info.id) {
                let admin = await this.Model.Admin.findOne({"_id": info.id})
                if (admin && admin.superAdmin == 1) {
                    return new Error("超级管理员不可编辑")
                }
                await this.Model.Admin.update({"_id": info.id}, {
                    "$set": data
                })
            } else {
                let pwd_md5 = this.getAdminCryptoPwd(data.email)
                data.pwd = pwd_md5;
                data.lastLoginTime = null
                data.createTime = Date.now()
                if (system) {
                    data.superAdmin = 1
                } else {
                    data.creator = this.admin._id
                }
                let admin = new this.Model.Admin(data)
                await admin.save()
            }
            return true
        } catch (e) {
            return e
        }
    }

    async del(id) {

        try {
            let admin = await this.Model.Admin.findOne({"_id": id})
            if (admin && admin.superAdmin === 0) {
                await this.Model.Admin.update({"_id": id}, {
                    "$set": {status: -1}
                })
                return true
            } else if (admin && admin.superAdmin === 1) {
                return new Error("无权限删除超级管理员")
            } else {
                return new Error("无此管理员")
            }
        } catch (e) {
            return e
        }

    }

    async changeStatus(id) {

        try {
            let admin = await this.Model.Admin.findOne({"_id": id})
            if (admin && admin.superAdmin === 0) {
                await this.Model.Admin.update({"_id": id}, {
                    "$set": {status: Math.abs(admin.status - 1)}
                })
                return true
            } else if (admin && admin.superAdmin === 1) {
                return new Error("无权限更改超级管理员状态")
            } else {
                return new Error("无此管理员")
            }
        } catch (e) {
            return e
        }
    }

    async resetPwd(id) {


        try {
            let admin = await this.Model.Admin.findOne({"_id": id})
            if (admin) {
                if (admin.superAdmin === 0) {
                    let pwd_md5 = this.getAdminCryptoPwd(admin.email)
                    await this.Model.Admin.update({_id: id}, {
                        '$set': {
                            pwd: pwd_md5,
                            pwdStatus: 0,
                            errCount: 0
                        }
                    })
                    return true
                } else {
                    return new Error("无权限重置超级管理员密码")
                }
            } else {
                return new Error("无此管理员")
            }
        } catch (e) {
            return e
        }

    }

    async roleList() {
        try {
            return await this.Model.AdminRole.find()
        } catch (e) {
            return e
        }
    }

    //给系统调用
    async addDeafultSuperAdmin(info) {
        try {
            let exists = await this.Model.Admin.findOne({"email": info.email})
            if (!exists) {
                await this.edit(info, true)
            }
        } catch (e) {
            console.error("添加默认管理员失败:" + e.message)
        }
    }


    getAdminCryptoPwd(pwd) {
        let hasher = crypto.createHash("md5");
        hasher.update(pwd)
        return hasher.digest('hex');
    }

    async updateSessionAdminPower() {
        try {
            let powers = await this.Model.AdminRole.find({"_id": {"$in": this.admin.power}})
            let menuIds = []

            powers.forEach(item=> {
                menuIds = menuIds.concat(item.menus)
            })

            let admin = JSON.parse(JSON.stringify(this.ctx.session.admin))

            let menus = await this.Model.AdminMenu.find({"_id": {"$in": menuIds}}).sort({index: 1})
            admin.menus = menus


            let apis = []
            powers.forEach(item=> {
                apis = apis.concat(item.apis)
            })
            admin.apis = apis

            this.ctx.session.admin = admin

        } catch (e) {
            this.output(e)
        }
    }


}
module.exports = AdminService;





