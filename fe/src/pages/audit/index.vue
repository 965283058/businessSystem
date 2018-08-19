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
        color: #3bc1a6;
        line-height: 65px;
        padding-left: 50px;
        display: flex;
        justify-content: flex-start;
    }

    .search__result {
        width: 300px;
    }

    .form__img-box {
        margin-right: 20px;
        float: left;
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

    .product__button {
        width: 80px;
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

</style>
<template>
    <div class="content-box">
        <div class="top">
            <!-- <label>审核状态：</label>
             <div class="search__result">
                 <el-checkbox-group v-model="po.result">
                     <el-checkbox :label="-1">未审核</el-checkbox>
                     <el-checkbox :label="0">已驳回</el-checkbox>
                     <el-checkbox :label="1">审核通过</el-checkbox>
                 </el-checkbox-group>
             </div>-->
            <div>
                <el-button class="search__button" type="success" size="small" @click="getList">刷新</el-button>
            </div>
        </div>
        <DataGrid url="/audit/list" :firstLoad="false" :stripe="true" :params="po.params" ref="dg" size="mini">
            <el-table-column type="expand" label="查看商品" width="80">
                <template slot-scope="props">
                    <el-table :data="props.row.productList" size="mini">
                        <el-table-column key="createTime" label="提交时间" width="145" align="center">
                            <template slot-scope="scope">
                                {{scope.row.createTime|getDateTimeString}}
                            </template>
                        </el-table-column>
                        <el-table-column key="img" label="图片" width="140" align="center">
                            <template slot-scope="scope">
                                <perview class="form__img-box">
                                    <a :href="scope.row.orderLink" target="_blank" @click.stop>
                                        <img class="product__img" :src="scope.row.img[0]" alt="图片无法查看" title="点击查看商品">
                                    </a>
                                    <h5 class="dg-img__see">查看图片</h5>
                                </perview>
                            </template>
                        </el-table-column>
                        <el-table-column key="name" prop="name" label="名称" width="240"
                                         header-align="center"></el-table-column>
                        <el-table-column key="active" label="活动时间" width="200" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.beginTime|getDateTimeString}}</div>
                                <span class="time_join">至</span>
                                <div>{{scope.row.endTime|getDateTimeString}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column key="price" prop="price" label="券后价" width="100"
                                         align="center"></el-table-column>
                        <el-table-column key="commission" label="佣金" width="100" align="center">
                            <template slot-scope="scope">
                                <div>{{scope.row.commission+'%'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column key="serviceCharge" prop="serviceCharge" label="服务费" width="100"
                                         align="center"></el-table-column>
                        <el-table-column key="desc" prop="desc" label="商品文案" min-width="280"
                                         header-align="center"></el-table-column>
                        <el-table-column key="remark" prop="remark" label="备注" min-width="280"
                                         header-align="center"></el-table-column>
                        <el-table-column label="操作" width="135" align="center" fixed="right" key="setting">
                            <template slot-scope="scope">
                                <button class="product__button" @click="openInfoDialog(scope.row)">查看详情</button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column label="申请时间" align="center">
                <template slot-scope="scope">
                    {{scope.row.applyTime|getDateTimeString}}
                </template>
            </el-table-column>
            <el-table-column prop="serviceCharge" label="服务费" header-align="center"
                             align="right"></el-table-column>
            <el-table-column prop="productList.length" label="商品数量" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    {{scope.row.result==-1?'未审核':scope.row.result==1?'审核通过':'已驳回'}}
                </template>
            </el-table-column>
            <el-table-column key="notes" prop="notes" label="驳回原因" min-width="200" header-align="center"
                             v-if="status=='fail'"></el-table-column>
            <el-table-column label="申请人" align="center">
                <template slot-scope="scope">
                    {{scope.row.applyUser.name}}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" key="setting">
                <template slot-scope="scope">
                    <button class="product__button" @click="audit(scope.row)" v-if="scope.row.result==-1">审核</button>
                    <button class="product__button" @click="audit(scope.row)" v-else>查看详情</button>
                </template>
            </el-table-column>
        </DataGrid>

        <el-dialog width="780px" :visible.sync="vo.showAuditDialog" :title="vo.auditDialogTitle">
            <el-collapse accordion :value="['info','audit']">
                <el-collapse-item title="申请信息" name="info">
                    <template v-if="vo.selectRow">
                        <div class="cell">
                            <label class="cell__caption">申请人：</label>
                            <div>{{vo.selectRow.applyUser.name}}</div>
                        </div>
                        <div class="cell">
                            <label class="cell__caption">申请时间：</label>
                            <div>{{vo.selectRow.applyTime|getDateTimeString}}</div>
                        </div>
                        <div class="cell">
                            <label class="cell__caption">截图信息：</label>
                            <div class="cell__content">
                                <perview class="form__img-box">
                                    <h5 class="form__img-title">聊天截图</h5>
                                    <img :src="vo.selectRow.chatImg" alt="">
                                </perview>
                                <perview class="form__img-box">
                                    <h5 class="form__img-title">优惠券截图</h5>
                                    <img :src="vo.selectRow.voucherImg" alt="">
                                </perview>
                                <perview class="form__img-box">
                                    <h5 class="form__img-title">到账截图</h5>
                                    <img :src="vo.selectRow.accountImg" alt="">
                                </perview>
                            </div>
                        </div>

                        <div class="cell">
                            <label class="cell__caption">服务费：</label>
                            <div>{{vo.selectRow.serviceCharge}}</div>
                        </div>
                        <div class="cell">
                            <label class="cell__caption">备注信息：</label>
                            <div>{{vo.selectRow.remark}}</div>
                        </div>
                    </template>
                </el-collapse-item>
                <el-collapse-item title="审核信息" name="audit" v-if="vo.selectRow">
                    <el-form ref="auditForm" :model="po.audit" label-width="80px" v-if="vo.selectRow.result == -1"
                             :rules="auditRule">
                        <el-form-item label="审核结果">
                            <el-radio v-model="po.audit.result" :label="1">通过</el-radio>
                            <el-radio v-model="po.audit.result" :label="0">驳回</el-radio>
                        </el-form-item>
                        <el-form-item :label="po.audit.result==1?'备注':'驳回理由'" prop="notes">
                            <el-input type="textarea" v-model="po.audit.notes" rows="4"></el-input>
                        </el-form-item>
                    </el-form>

                    <template v-else>
                        <div class="cell">
                            <label class="cell__caption">审核人：</label>
                            <div>{{vo.selectRow.auditor.name}}</div>
                        </div>
                        <div class="cell">
                            <label class="cell__caption">审核时间：</label>
                            <div>{{vo.selectRow.auditTime|getDateTimeString}}</div>
                        </div>
                        <div class="cell">
                            <label class="cell__caption">审核结果：</label>
                            <div> {{vo.selectRow.result==-1?'未审核':vo.selectRow.result==1?'审核通过':'已驳回'}}</div>
                        </div>
                        <div class="cell">
                            <label class="cell__caption">审核信息：</label>
                            <div>{{vo.selectRow.notes}}</div>
                        </div>
                    </template>
                </el-collapse-item>
            </el-collapse>


            <div slot="footer" v-if="vo.selectRow&&vo.selectRow.result == -1">
                <el-button @click="reset">取 消</el-button>
                <el-button type="primary" @click="auditSubmit">确 定</el-button>
            </div>
            <div slot="footer" class="footer" v-else>
                <el-button @click="reset">关闭</el-button>
            </div>
        </el-dialog>

        <el-dialog title="商品详情" width="780px" :visible.sync="vo.showInfoDialog" v-if="vo.showInfoDialog">
            <productInfo :product="vo.product"></productInfo>
            <div slot="footer">
                <el-button @click="vo.showInfoDialog = false">取 消</el-button>
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
            const checkNote = (rule, value, callback) => {
                if (this.po.audit.result == 0 && !value.trim()) {
                    return callback(new Error('请输入驳回理由！'));
                }
                callback();
            };

            return {
                po: {
                    params: {
                        result: null
                    },
                    audit: {
                        id: '',
                        result: 1,
                        notes: ''
                    }
                },
                vo: {
                    selectRow: null,
                    showAuditDialog: false,
                    auditDialogTitle: '',
                    product: null,
                    showInfoDialog: false,
                },
                rules: {
                    serviceCharge: [
                        {required: true, message: '请输入服务费用', trigger: 'blur'}
                    ],
                },
                auditRule: {
                    notes: [
                        {required: true, validator: checkNote, trigger: 'blur'},
                    ]
                }
            }
        },
        computed: {
            status(){
                return this.$route.params.status
            }
        },
        methods: {
            init(){
                switch (this.status) {
                    case 'wait':
                        this.po.params.result = -1
                        break;
                    case 'fail':
                        this.po.params.result = 0
                        break;
                    case 'done':
                        this.po.params.result = 1
                        break;
                }
                this.getList()
            },
            getList(){
                this.$refs.dg.reload()
            },
            audit(row){
                this.reset(false)
                this.vo.selectRow = row
                this.vo.showAuditDialog = true
                if (this.vo.selectRow.result == -1) {
                    this.vo.auditDialogTitle = '审核'
                } else {
                    this.vo.auditDialogTitle = '详情'
                }
            },
            reset(closeDialog = true){
                this.po.audit = {
                    id: '',
                    result: 1,
                    notes: ''
                }
                if (closeDialog) {
                    this.vo.showAuditDialog = false
                }
            },
            auditSubmit(){
                this.$refs.auditForm.validate((valid) => {
                    if (valid) {
                        this.$confirm(`您确定要【${this.po.audit.result == 1 ? '审核通过' : '驳回申请'}】吗?`, '操作确认', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.po.audit.id = this.vo.selectRow._id
                            this.$post("/audit/do", this.po.audit).then(data=> {
                                this.$message("审核成功", {type: 'success'})
                                this.getList()
                                this.reset()
                            }).catch(err=> {
                                this.$alert(err.message, {type: 'error'})
                            })
                        }).catch(() => {
                        });
                    }
                })
            },
            openInfoDialog(prod){
                this.vo.product = prod
                this.vo.showInfoDialog = true
            },
        },
        beforeRouteUpdate (to, from, next) {// 在当前路由改变，但是该组件被复用时调用
            this.$nextTick(this.init)
            next()
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
            /* 'po.result': function (val) {
             this.po.params.result = val.join(',')
             }*/
        }
    }
</script>