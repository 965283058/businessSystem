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
            <label>审核状态：</label>
            <div class="search__result">
                <el-checkbox-group v-model="po.result">
                    <el-checkbox :label="-1">未审核</el-checkbox>
                    <el-checkbox :label="0">已驳回</el-checkbox>
                    <el-checkbox :label="1">审核通过</el-checkbox>
                </el-checkbox-group>
            </div>
            <div>
                <el-button class="search__button" type="success" size="small" @click="getList">查询</el-button>
            </div>
        </div>
        <DataGrid url="/audit/list" :stripe="true" :params="po.params" ref="dg" size="mini">
            <el-table-column type="expand" label="查看商品" width="80">
                <template slot-scope="props">
                    <el-table :data="props.row.productList" size="mini">
                        <el-table-column prop="name" label="名称" width="180" header-align="center"></el-table-column>
                        <el-table-column label="图片" width="140" align="center">
                            <template slot-scope="scope">
                                <perview class="form__img-box">
                                    <img class="product__img" :src="scope.row.img[0]" alt="">
                                </perview>
                            </template>
                        </el-table-column>
                        <el-table-column prop="costPrice" label="原价" width="100" header-align="center"
                                         align="right"></el-table-column>
                        <el-table-column prop="price" label="券后价" width="100" header-align="center"
                                         align="right"></el-table-column>
                        <el-table-column prop="voucherLink" label="券链接" width="280"
                                         header-align="center"></el-table-column>
                        <el-table-column prop="orderLink" label="下单链接" width="280"
                                         header-align="center"></el-table-column>
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
                    </el-table>
                </template>
            </el-table-column>


            <el-table-column label="申请人" align="center">
                <template slot-scope="scope">
                    {{scope.row.applyUser.name}}
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
                    <el-form :model="po.audit" label-width="80px" v-if="vo.selectRow.result == -1">
                        <el-form-item label="审核结果">
                            <el-radio v-model="po.audit.result" :label="1">通过</el-radio>
                            <el-radio v-model="po.audit.result" :label="0">驳回</el-radio>
                        </el-form-item>
                        <el-form-item label="备注">
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
    </div>
</template>

<script>
    import {getDateTimeString, getDateString} from 'utils'
    import  perview from 'components/perview'
    export default {
        data(){
            return {
                po: {
                    result: [-1],
                    params: {
                        result: -1
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
                    auditDialogTitle: ''
                },
                rules: {
                    serviceCharge: [
                        {required: true, message: '请输入服务费用', trigger: 'blur'}
                    ],
                }
            }
        },
        computed: {},
        methods: {
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
            },
        },
        mounted(){
        },
        components: {
            perview
        },
        filters: {
            getDateString,
            getDateTimeString
        },
        watch: {
            'po.result': function (val) {
                this.po.params.result = val.join(',')
            }
        }
    }
</script>