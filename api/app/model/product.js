module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const ProductSchema = new Schema({  //商品
        name: {type: String}, //名称
        img: [String],//图片
        imgType: {type: Number, default: 0},//图片类型 0本地图片 1链接
        costPrice: {type: Number},//原价
        price: {type: Number},//券后价
        commission: {type: Number},//佣金
        voucherLink: String,//券链接
        voucherImage: String,//券截图
        orderLink: String,//下单链接
        desc: String,//商品文案
        serviceCharge: Number,//服务费
        qq: Number,
        phone: String,//电话
        wx: String,//微信
        status: {type: Number, default: 0}, //0待结算 1结算中 2已结算 -1已驳回  -10已取消
        beginTime: {type: Number},//开始时间
        endTime: {type: Number},//结束时间
        endDate: {type: String},//结束日期
        remark: String,//备注
        createTime: {type: Number, default: Date.now()},//创建日期
        createor: {type: Schema.Types.ObjectId, ref: 'Admin'},
        record: [{
            owner: {type: Schema.Types.ObjectId, ref: 'Admin'},
            time: {type: Number, default: Date.now()},
            oldStatus: Number,
            status: Number,
            remark: String,
            auditId: {type: Schema.Types.ObjectId, ref: 'auditRecord'},
        }],
        urge: {type: Number, default: 0},//是否被催单  0没有 1有
    });
    return mongoose.model('Product', ProductSchema);
}