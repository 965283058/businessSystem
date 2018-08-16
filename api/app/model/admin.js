module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const AdminSchema = new Schema({
        email: {type: String, unique: true},
        name: String,
        pwd: String,
        job: String,
        errCount: {type: Number, default: 0}, //超过5次锁定
        superAdmin: {type: Number, default: 0}, // 0普通管理员 1超级管理员 -1普通用户
        power: [{type: Schema.Types.ObjectId, ref: 'AdminRole'}],
        status: {type: Number, default: 1}, //-1 删除 0禁用 1正常
        creator: {type: Schema.Types.ObjectId, ref: 'Admin', default: null},
        createTime: {type: Number, default: Date.now()},
        lastLoginTime: Number
    });

    return mongoose.model('Admin', AdminSchema);
}


