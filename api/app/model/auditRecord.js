module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;

    const AuditRecordSchema = new Schema({  //审核记录
        productList: [{type: Schema.Types.ObjectId, ref: 'Product'}],
        chatImg: String,//聊天记录图片
        voucherImg: String,//优惠券截图
        accountImg: String,//到账截图
        serviceCharge: Number,//服务费
        remark: String,//备注
        month: String,//当前月份 如：2018-02
        applyTime: {type: Number, default: Date.now()},//申请日期
        applyUser: {type: Schema.Types.ObjectId, ref: 'Admin'},
        auditor: {type: Schema.Types.ObjectId, ref: 'Admin'},//审核人
        auditorTime: Number,//审核人
        result: {type: Number, default: -1},//审核结果 -1未审核 0已驳回 1审核通过
        notes: String
    });
    return mongoose.model('AuditRecord', AuditRecordSchema);
}