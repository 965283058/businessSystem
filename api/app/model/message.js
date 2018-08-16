module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const MessageSchema = new Schema({
        content: String,
        userList: [{
            user: {type: Schema.Types.ObjectId, ref: 'Admin'},
            status: {type: Number, default: 0},//0 未读 1已读
        }],
        type: {type: Number, default: 0},//受众 0用户 1管理员 2全部
        time: {type: Number, default: Date.now()},
        productList: [{type: Schema.Types.ObjectId, ref: 'Product'}],
    });
    return mongoose.model('Message', MessageSchema);
}


