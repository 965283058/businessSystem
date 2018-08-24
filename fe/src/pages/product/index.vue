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
        padding-left: 20px;
        display: flex;
        align-items: center;
    }

    .top__input {
        width: 220px;
        margin-right: 20px;
    }

    .text-warn {
        display: inline-block;
        line-height: 65px;
        margin-left: 50px;
        color: #e11920;
        font-weight: bold;
    }

    .product__img {
        width: 120px;
    }

    .dg__button {
        text-align: center;
        font-size: 14px;
        line-height: 24px;
        color: #0028ff;
        cursor: pointer;
    }

    .dg__button--red {
        color: #e11920;
    }

    .dg__button--green {
        color: #259b24;
    }

    .dg-img__see {
        color: blue;
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

    .cell a {
        word-break: break-all;
    }

    .cell__caption {
        width: 80px;
        flex-shrink: 0;
        font-size: 14px;
        text-align: right;
        color: #333333;
    }

</style>
<template>
    <div class="content-box">
        <div class="top">
            <el-input class="top__input" placeholder="输入商品ID进行搜索" v-model="po.params.productId"
                      size="medium"></el-input>


            <el-select class="top__input" clearable v-if='hasPower("product_userList")' v-model="po.params.userId"
                       placeholder="请选择招商员" size="medium">
                <el-option v-for="item in vo.userList"
                           :key="item._id"
                           :label="item.name"
                           :value="item._id">
                </el-option>
            </el-select>


            <el-button type="success" size="small" @click="getList">查询</el-button>
            <el-button type="primary" size="small" @click="apply" v-if="hasPower('audit_apply')&&vo.showApply">批量结算申请
            </el-button>
            <p class="text-warn" v-if="status=='wait'||status=='fail'">注意：背景色为黄色置顶的，请尽快申请结算！</p>
        </div>
        <DataGrid url="/product/list" :firstLoad="false" :params="po.params" ref="dg" :fit="true" size="mini"
                  @selection-change="selectChange" :row-style="dgRowStyle">
            <el-table-column type="selection" width="55" v-if="status=='wait'||status=='fail'" key="checkbox">
            </el-table-column>
            <el-table-column key="createTime" prop="createTime" label="提交时间" width="95" align="center" sortable="true">
                <template slot-scope="scope">
                    {{scope.row.createTime|getDateTimeString}}
                </template>
            </el-table-column>
            <el-table-column key="img" label="主图" width="140" align="center">
                <template slot-scope="scope">
                    <perview class="form__img-box">
                        <a :href="scope.row.orderLink" target="_blank" @click.stop>
                            <img class="product__img" :src="scope.row.img[0]" alt="图片无法查看" title="点击查看商品">
                        </a>
                        <h5 class="dg-img__see">查看图片</h5>
                    </perview>
                </template>
            </el-table-column>
            <el-table-column key="name" prop="name" label="短标题" width="240" header-align="center"></el-table-column>
            <el-table-column key="active" label="活动时间" width="150" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.beginTime|getDateTimeString}}</div>
                    <span class="time_join">至</span>
                    <div>{{scope.row.endTime|getDateTimeString}}</div>
                </template>
            </el-table-column>
            <el-table-column key="price" prop="price" label="券后价" width="80" align="center"></el-table-column>
            <el-table-column key="commission" label="佣金" width="80" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.commission+'%'}}</div>
                </template>
            </el-table-column>
            <el-table-column key="serviceCharge" prop="serviceCharge" label="服务费" width="100"
                             align="center"></el-table-column>
            <el-table-column key="desc" prop="desc" label="商品文案" min-width="200"
                             header-align="center"></el-table-column>
            <el-table-column key="remark" prop="remark" label="备注" min-width="200"
                             header-align="center"></el-table-column>

            <el-table-column key="cancelReason" label="取消理由" min-width="200" header-align="center"
                             v-if="status=='cancel'">
                <template slot-scope="scope">
                    <div>{{getCancelReason(scope.row)}}</div>
                </template>
            </el-table-column>
            <el-table-column key="createor" prop="createor.name" label="招商员" width="100" align="center"
                             v-if="vo.superAdmin!=-1"></el-table-column>
            <el-table-column label="操作" width="130" align="center" fixed="right" key="setting">
                <template slot-scope="scope">
                    <p class="dg__button" @click="openInfoDialog(scope.row)">查看详情</p>
                    <p class="dg__button dg__button--red" @click="toEdit(scope.row)"
                       v-if="hasPower('product_edit')&&(status=='wait'||status=='fail')">
                        修改
                    </p>
                    <p class="dg__button" @click="openAuditDialog(scope.row._id)" v-if="status=='fail'">查看驳回原因
                    </p>
                    <p class="dg__button dg__button--green" @click="apply(false,scope.row)"
                       v-if="vo.showApply&&hasPower('audit_apply')">
                        {{status=='wait'?'申请结算':'重新提交申请'}}
                    </p>

                    <p class="dg__button dg__button--green" @click="openAuditDialog(scope.row._id)"
                       v-if="status=='auditing'">查看结算申请
                    </p>

                    <p class="dg__button dg__button--green" @click="openAuditDialog(scope.row._id)"
                       v-if="status=='done'">查看结算信息
                    </p>

                    <p class="dg__button dg__button--red" @click="cancel(scope.row)"
                       v-if="(status=='fail'||status=='wait')&&hasPower('product_cancel')">
                        取消活动
                    </p>

                </template>
            </el-table-column>
        </DataGrid>

        <el-dialog width="780px" title="申请结算" :close-on-click-modal="false" :visible.sync="vo.showApplyDialog"
                   v-if="vo.showApply&&vo.showApplyDialog">
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


        <el-dialog width="780px" :visible.sync="vo.showInfoDialog" title="商品详情">
            <productInfo :product="vo.product"></productInfo>
            <div slot="footer">
                <el-button @click="vo.showInfoDialog = false">取 消</el-button>
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
                <el-collapse-item title="审核信息" name="audit" v-if="vo.auditInfo.auditor">
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
                <el-collapse-item title="审核信息" name="audit" v-else>
                    <div class="cell">
                        正在审核中....
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
    import  productInfo from 'components/productInfo'

    export default {
        data(){
            return {
                po: {
                    params: {
                        productId: '',
                        userId: '',
                        status: null,
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
                    product: null,
                    showInfoDialog: false,


                    showApply: false,
                    showApplyDialog: false,
                    showAuditDialog: false,
                    auditInfo: null,
                    superAdmin: -1,
                    admin: null,
                    userList: []
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
            getList(reset = true){
                if (reset) {
                    this.$refs.dg.reset()
                }
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
            openInfoDialog(prod){
                this.vo.product = prod
                this.vo.showInfoDialog = true
            },
            toEdit(item){
                window.sessionStorage.setItem("productInfo", JSON.stringify(item))
                this.$router.push(`/product/edit/${item._id}`)
            },
            getCancelReason(row){
                let reason
                for (let i = row.record.length - 1; i >= 0; i--) {
                    if (row.record[i].status == -10) {
                        reason = row.record[i].remark
                        break
                    }
                }
                return reason
            },
            cancel(info){
                this.$prompt(`您确定要商品【${info.name}】的活动吗，该操作不可逆?`, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^.+$/,
                    inputPlaceholder: '取消原因',
                    inputErrorMessage: '请输入取消原因！'
                }).then(({value}) => {
                    this.$post("/product/cancel", {id: info._id, reason: value}).then(data=> {
                        this.getList(false)
                        return this.$message.info("操作成功！")
                    }).catch(err=> {
                        this.$alert(err.message, {type: 'error'})
                    })
                }).catch(()=> {
                })
            },
            selectChange(selected){
                this.vo.selectItem = selected
            },
            apply(multiple = true, product = null){
                if (!multiple) {//如果单独提交
                    this.vo.selectItem = [];
                    this.vo.selectItem.push(product)

                    this.$refs.dg.$refs.table.clearSelection()
                }
                if (multiple && this.vo.selectItem.length == 0) {
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
                            this.getList(false)
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
            },
            getUserList(){
                this.$get("/product/userList").then(data=> {
                    this.vo.userList = data
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
            if (this.hasPower("product_userList")) {
                this.getUserList()
            }
        },
        mounted(){
            this.init()
        },
        components: {
            perview,
            productInfo
        },
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