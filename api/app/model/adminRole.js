module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const AdminRoleSchema = new Schema({
        name: String,
        menus: [{type: Schema.Types.ObjectId, ref: 'AdminMenu'}],
        apis: [],
        status: Number,  //0禁用 1正常
        editor: {type: Schema.Types.ObjectId, ref: 'Admin', default: null},
        editTime: {type: Number, default: Date.now()},
    });

    return mongoose.model('AdminRole', AdminRoleSchema);
}