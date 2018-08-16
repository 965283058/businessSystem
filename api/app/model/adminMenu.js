module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const MenuSchema = new Schema({
        text: String,
        router: String,
        icon: String,
        parentId: String,
        index: Number,
        apis: Array,//后端接口权限（manage）
        status: Number, // 0禁用 1正常
    });

    return mongoose.model('AdminMenu', MenuSchema);
}