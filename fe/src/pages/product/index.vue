<style scoped>
    .content-box {
        width: 100%;
        height: 100%;
        background: #ffffff;
        display: flex;
        flex-direction: column;
    }

    .top {
        height: 65px;
        background: #eaedf1;
        border-top: 1px solid #bbbbbb;
        border-bottom: 1px solid #bbbbbb;
        font-size: 18px;
        line-height: 65px;
        padding-left: 50px;
    }
    .text-warn{
        display: inline-block;
        line-height: 65px;
        margin-left: 50px;
    }

    .product__img {
        width: 120px;
    }

    .dg__button {
        width: 110px;
        text-align: center;
        line-height: 24px;
        border: 1px solid #3bc1a6;
        border-radius: 24px;
        background: transparent;
        margin: 5px 0;
    }

    .time_join {
        width: 20px;
        text-align: center;
        display: inline-block
    }

    .form__img-box {
        margin-right: 20px;
        float: left;
    }

    .form__title {
        font-size: 16px;
        text-align: center;
    }

    .form__img-box img {
        max-width: 120px;
        max-height: 120px;
    }

    .form__img-title {
        font-size: 12px;
        text-align: center;
        color: blue;
    }

    .cell {
        display: flex;
        justify-content: flex-start;
        padding-left: 30px;
    }

    .cell__caption {
        width: 80px;
        flex-shrink: 0;
        font-size: 14px;
    }

</style>
<template>
    <div class="content-box">
        <div class="top">
            <el-button type="success" size="small" @click="getList">刷新</el-button>
            <el-button type="primary" size="small" @click="apply" v-if="hasPower('audit_apply')&&vo.showApply">提交申请</el-button>
            <p class="text-warn">黄色背景的为管理员催单，请尽快提交</p>
        </div>
        <DataGrid url="/product/list" :firstLoad="false" :params="po.params" ref="dg"
                  @selection-change="selectChange" :row-style="dgRowStyle">
            <el-table-column type="selection" width="55" v-if="status=='wait'||status=='fail'" key="checkbox">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="180" header-align="center"></el-table-column>
            <el-table-column label="图片" width="140" align="center">
                <template slot-scope="scope">
                    <perview class="form__img-box">
                        <img class="product__img" :src="scope.row.img[0]" alt="点击查看大图" title="点击查看大图">
                    </perview>
                </template>
            </el-table-column>
            <el-table-column prop="costPrice" label="原价" width="100" header-align="center"
                             align="right"></el-table-column>
            <el-table-column prop="price" label="券后价" width="100" header-align="center" align="right"></el-table-column>
            <el-table-column prop="voucherLink" label="券链接" width="280" header-align="center"></el-table-column>
            <el-table-column prop="orderLink" label="下单链接" width="280" header-align="center"></el-table-column>
            <el-table-column prop="desc" label="商品文案" width="180" header-align="center"></el-table-column>
            <el-table-column prop="serviceCharge" label="服务费" width="100" header-align="center"
                             align="right"></el-table-column>
            <el-table-column prop="qq" label="QQ" width="100" header-align="center"></el-table-column>
            <el-table-column prop="phone" label="电话" width="180" header-align="center"></el-table-column>
            <el-table-column label="活动时间" width="200" align="center">
                <template slot-scope="scope">
                    {{scope.row.beginTime|getDateString}}<span class="time_join">至</span>{{scope.row.endTime|getDateString}}
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="180" header-align="center"></el-table-column>

            <el-table-column label="操作" width="135" align="center" fixed="right"
                             v-if="status=='wait'||status=='fail'||status=='done'" key="setting">
                <template slot-scope="scope">
                    <button class="dg__button" @click="toEdit(scope.row)" v-if="hasPower('product_edit')&&(status=='wait'||status=='fail')">
                        修改
                    </button>
                    <button class="dg__button" @click="openAuditDialog(scope.row._id)" v-if="status=='fail'">查看驳回原因
                    </button>
                    <button class="dg__button" @click="openAuditDialog(scope.row._id)" v-if="status=='done'">查看审核信息
                    </button>

                    <button class="dg__button" @click="cancel(scope.row)" v-if="hasPower('product_cancel')">
                        取消活动
                    </button>

                </template>
            </el-table-column>
        </DataGrid>

        <el-dialog width=" 780px
                    " :visible.sync="vo.showApplyDialog" v-if="vo.showApply&&vo.showApplyDialog">
            <el-form ref="form" :model="po.apply" :rules="rules" label-width="80px" class="form">
                <el-form-item label="上传图片">
                    <div class="form__img-box">
                        <h5 class="form__title">聊天截图</h5>
                        <jf-upload class="img" :url="po.apply.chatImg" ref="chatImg">
                            <span>查看大图</span>
                        </jf-upload>
                    </div>
                    <div class="form__img-box">
                        <h5 class="form__title">优惠券截图</h5>
                        <jf-upload class="img" :url="po.apply.voucherImg" ref="voucherImg">
                            <span>查看大图</span>
                        </jf-upload>
                    </div>
                    <div class="form__img-box">
                        <h5 class="form__title">到账截图</h5>
                        <jf-upload class="img" :url="po.apply.accountImg" ref="accountImg">
                            <span>查看大图</span>
                        </jf-upload>
                    </div>
                </el-form-item>
                <el-form-item label="服务费" prop="serviceCharge">
                    <el-input v-model="po.apply.serviceCharge"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="po.apply.remark" rows="4"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer">
                <el-button @click="vo.showApplyDialog = false">取 消</el-button>
                <el-button type="primary" @click="applySubmit">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog width="780px" :visible.sync="vo.showAuditDialog" title="审核信息">
            <el-collapse accordion :value="['info','audit']" v-if="vo.auditInfo">
                <el-collapse-item title="申请信息" name="info">
                    <div class="cell">
                        <label class="cell__caption">申请人：</label>
                        <div>{{vo.auditInfo.applyUser.name}}</div>
                    </div>
                    <div class="cell">
                        <label class="cell__caption">申请时间：</label>
                        <div>{{vo.auditInfo.applyTime|getDateTimeString}}</div>
                    </div>
                    <div class="cell">
                        <label class="cell__caption">截图信息：</label>
                        <div class="cell__content">
                            <perview class="form__img-box">
                                <h5 class="form__img-title">聊天截图</h5>
                                <img :src="vo.auditInfo.chatImg" alt="">
                            </perview>
                            <perview class="form__img-box">
                                <h5 class="form__img-title">优惠券截图</h5>
                                <img :src="vo.auditInfo.voucherImg" alt="">
                            </perview>
                            <perview class="form__img-box">
                                <h5 class="form__img-title">到账截图</h5>
                                <img :src="vo.auditInfo.accountImg" alt="">
                            </perview>
                        </div>
                    </div>

                    <div class="cell">
                        <label class="cell__caption">服务费：</label>
                        <div>{{vo.auditInfo.serviceCharge}}</div>
                    </div>
                    <div class="cell">
                        <label class="cell__caption">备注信息：</label>
                        <div>{{vo.auditInfo.remark}}</div>
                    </div>
                </el-collapse-item>
                <el-collapse-item title="审核信息" name="audit">
                    <div class="cell">
                        <label class="cell__caption">审核人：</label>
                        <div>{{vo.auditInfo.auditor.name}}</div>
                    </div>
                    <div class="cell">
                        <label class="cell__caption">审核时间：</label>
                        <div>{{vo.auditInfo.auditTime|getDateTimeString}}</div>
                    </div>
                    <div class="cell">
                        <label class="cell__caption">审核结果：</label>
                        <div> {{vo.auditInfo.result==-1?'未审核':vo.auditInfo.result==1?'审核通过':'已驳回'}}</div>
                    </div>
                    <div class="cell">
                        <label class="cell__caption">审核信息：</label>
                        <div>{{vo.auditInfo.notes}}</div>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <div slot="footer">
                <el-button @click="vo.showAuditDialog=false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getDateTimeString, getDateString} from 'utils'
    import  perview from 'components/perview'

    export default {
        data(){
            return {
                po: {
                    params: {
                        status: null
                    },
                    apply: {
                        productIds: '',
                        chatImg: '',
                        voucherImg: '',
                        accountImg: '',
                        serviceCharge: null,
                        remark: ''
                    },
                    applyClone: null
                },
                vo: {
                    selectItem: [],
                    showApply: false,
                    showApplyDialog: false,
                    showAuditDialog: false,
                    auditInfo: null,
                    superAdmin: -1,
                    admin:null
                },
                rules: {
                    serviceCharge: [
                        {required: true, message: '请输入服务费用', trigger: 'blur'}
                    ],
                }
            }
        },
        computed: {
            status(){
                return this.$route.params.status
            }
        },
        methods: {
            hasPower(code){
                if (this.vo.admin.superAdmin === 1) {
                    return true
                }
                if (this.vo.admin.apis.indexOf(code) > -1) {
                    return true
                }
                return false
            },
            resetForm(){
                this.vo.selectItem = []
                this.po.apply = JSON.parse(JSON.stringify(this.po.applyClone))
            },
            getList(){
                this.vo.selectItem = []
                this.$refs.dg.reload()
            },
            dgRowStyle({row, rowIndex}) {
                if (this.vo.superAdmin != -1) {
                    return ''
                }
                if (this.status != 'wait' && this.status != 'fail') {
                    return ''
                }
                if (row.urge > 0) {
                    return 'background: #FFEC8B'
                }
                return '';
            },
            dgRowClass({row, rowIndex}) {
                if (this.vo.superAdmin != -1) {
                    return ''
                }
                if (this.status != 'wait' && this.status != 'fail') {
                    return ''
                }
                if (row.urge > 0) {
                    return 'warning'
                }
                return '';
            },
            toEdit(item){
                window.sessionStorage.setItem("productInfo", JSON.stringify(item))
                this.$router.push(`/product/edit/${item._id}`)
            },
            cancel(info){
                this.$confirm(`您确定要商品【${info.name}】的活动吗，该操作不可逆?`, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post("/product/cancel", {id: info._id}).then(data=> {
                        this.getList()
                        return this.$message.info("操作成功！")
                    }).catch(err=> {
                        this.$alert(err.message, {type: 'error'})
                    })
                }).catch(() => {
                    info.status = Math.abs(info.status - 1)
                });
            },
            selectChange(selected){
                this.vo.selectItem = selected
            },
            apply(){
                if (this.vo.selectItem.length == 0) {
                    return this.$message("未选中任何行")
                }
                this.vo.showApplyDialog = true
            },
            applySubmit(){
                let chatImgFileInput = this.$refs.chatImg.$el.querySelector('input[type=file]')
                if (!chatImgFileInput.files || !chatImgFileInput.files.length) {
                    return this.$message.error("请选择聊天截图")
                }

                let voucherImgFileInput = this.$refs.voucherImg.$el.querySelector('input[type=file]')
                if (!voucherImgFileInput.files || !voucherImgFileInput.files.length) {
                    return this.$message.error("请选择优惠券截图")
                }


                let accountImgFileInput = this.$refs.accountImg.$el.querySelector('input[type=file]')
                if (!accountImgFileInput.files || !accountImgFileInput.files.length) {
                    return this.$message.error("请选择到账截图")
                }
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let fd = new FormData()
                        fd.append("chatImg", chatImgFileInput.files[0])
                        fd.append("voucherImg", voucherImgFileInput.files[0])
                        fd.append("accountImg", accountImgFileInput.files[0])
                        fd.append("productIds", this.vo.selectItem.map(item=>item._id).join(','))
                        fd.append("serviceCharge", this.po.apply.serviceCharge)
                        fd.append("remark", this.po.apply.remark)

                        this.vo.showApplyDialog = false
                        this.$post("/audit/apply", fd).then(data=> {
                            this.$message("提交成功", {type: 'success'})
                            this.resetForm()
                            this.getList()
                        }).catch(err=> {
                            this.$alert(err.message, {type: 'error'})
                        })
                    }
                });
            },
            init(){
                this.vo.showApply = false
                if (this.status == 'wait' || this.status == 'fail') {
                    this.vo.showApply = true
                    this.po.applyClone = JSON.parse(JSON.stringify(this.po.apply))
                }
                switch (this.status) {
                    case 'wait':
                        this.po.params.status = 0
                        document.title = '商品管理-待结算'
                        break;
                    case 'auditing':
                        this.po.params.status = 1
                        document.title = '商品管理-审核中'
                        break;
                    case 'fail':
                        this.po.params.status = -1
                        document.title = '商品管理-已驳回'
                        break;
                    case 'done':
                        this.po.params.status = 2
                        document.title = '商品管理-已结算'
                        break;
                    case 'cancel':
                        this.po.params.status = -10
                        document.title = '商品管理-已取消'
                        break;
                }
                this.getList()
            },

            openAuditDialog(id){
                this.vo.auditInfo = null
                this.$get("/product/auditInfo", {id}).then(data=> {
                    this.vo.auditInfo = data
                    this.vo.showAuditDialog = true
                }).catch(err=> {
                    this.$alert(err.message, {type: 'error'})
                })
            }

        },
        beforeRouteUpdate (to, from, next) {// 在当前路由改变，但是该组件被复用时调用
            this.$nextTick(this.init)
            next()
        },
        created(){
            try {
                let admin = JSON.parse(sessionStorage.getItem("admin"))
                this.vo.admin = admin
                this.vo.superAdmin = admin.superAdmin
            } catch (e) {
            }
        },
        mounted(){
            this.init()
        },
        components: {perview},
        filters: {
            getDateString,
            getDateTimeString
        },
        watch: {
            'po.apply.serviceCharge': function (val, oldVal) {
                if (val == oldVal) {
                    return
                }
                let newVal = (val + '')

                if (newVal.length > 1) {//.字符不能在首位
                    newVal = newVal.replace(/[^\d.]/g, '')
                } else {
                    newVal = newVal.replace(/[^\d]/g, '')
                }
                let dotIndex = newVal.indexOf('.') //小数点的位置

                if (dotIndex > -1 && newVal.lastIndexOf('.') != dotIndex) {//去除多余的点
                    newVal = newVal.slice(0, dotIndex + 1) + newVal.slice(dotIndex + 1).replace(/\./g, '')
                }

                if (newVal.indexOf("0") == 0 && dotIndex !== 1 && newVal.length > 1) {//禁止连续输入多个0
                    newVal = newVal.slice(1)
                }

                if (dotIndex > 0 && newVal.length > dotIndex + 3) { //限制输入2位小数
                    newVal = newVal.slice(0, dotIndex + 3)
                }
                let sliceLength = 9//整数位限制输入9位
                if (dotIndex > 0) {
                    sliceLength = 12
                }
                if (newVal.length > sliceLength) {
                    newVal = newVal.slice(0, sliceLength)  //限制输入9位
                }
                this.$nextTick(()=> {
                    this.po.apply.serviceCharge = newVal
                })
            },
        }
    }
</script>