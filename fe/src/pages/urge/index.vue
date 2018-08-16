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
        width: 340px;
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
            <label>结束时间：</label>
            <div class="search__result">
                <el-radio v-model="po.params.day" :label="0">结束当天</el-radio>
                <el-radio v-model="po.params.day" :label="4">结束5天</el-radio>
                <el-radio v-model="po.params.day" :label="9">结束10天</el-radio>
            </div>
            <div>
                <el-button class="search__button" type="success" size="small" @click="getList">查询</el-button>
                <el-button class="search__button" type="info" size="small" @click="urgeMultiple">催单多个商品</el-button>
                <el-button class="search__button" type="warning" size="small" @click="openAllDialog">全体弹窗</el-button>
            </div>
        </div>
        <DataGrid url="/product/urgeProductList" :stripe="true" :params="po.params" ref="dg" size="mini"
                  @selection-change="selectChange">
            <el-table-column type="selection" width="55" key="checkbox"></el-table-column>
            <el-table-column prop="createor.name" label="创建用户" width="120" align="center"></el-table-column>
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
            <el-table-column label="活动时间" width="200" align="center">
                <template slot-scope="scope">
                    {{scope.row.beginTime|getDateString}}<span class="time_join">至</span>{{scope.row.endTime|getDateString}}
                </template>
            </el-table-column>
            <el-table-column prop="voucherLink" label="券链接" width="280"
                             header-align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderLink" label="下单链接" width="280"
                             header-align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="desc" label="商品文案" width="180" header-align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="serviceCharge" label="服务费" width="100" header-align="center"
                             align="right"></el-table-column>
            <el-table-column prop="qq" label="QQ" width="100" header-align="center"></el-table-column>
            <el-table-column prop="phone" label="电话" width="180" header-align="center"></el-table-column>
            <el-table-column prop="remark" label="备注" width="200" header-align="center"
                             show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" align="center" key="setting" width="100" fixed="right">
                <template slot-scope="scope">
                    <button class="product__button" @click="urge(scope.row._id)">催单</button>
                </template>
            </el-table-column>
        </DataGrid>

        <el-dialog width="780px" :visible.sync="vo.showAllDialog" title="发送全体弹窗">
            <el-form :model="po.notice" label-width="80px" ref="noticeForm" :rules="rules">
                <el-form-item label="受众">
                    <el-radio v-model="po.notice.type" :label="0">所有用户</el-radio>
                    <el-radio v-model="po.notice.type" :label="1">所有管理员</el-radio>
                    <el-radio v-model="po.notice.type" :label="2">全部</el-radio>
                </el-form-item>
                <el-form-item label="弹窗内容" prop="content">
                    <el-input type="textarea" v-model.trim="po.notice.content" rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="vo.showAllDialog=false">取 消</el-button>
                <el-button type="primary" @click="sendAllUserNotice">发送</el-button>
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
                        day: 0
                    },
                    notice: {
                        type: 0,
                        content: ''
                    }
                },
                vo: {
                    selectRow: null,
                    showAllDialog: false,
                    auditDialogTitle: ''
                },
                rules: {
                    content: [
                        {required: true, message: '请输入通知内容', trigger: 'blur'}
                    ],
                }
            }
        },
        computed: {},
        methods: {
            getList(){
                this.$refs.dg.reload()
                this.vo.selectRow = null
            },
            selectChange(rows){
                this.vo.selectRow = rows.map(item=>item._id)
            },
            urgeMultiple(){
                if (!this.vo.selectRow || !this.vo.selectRow.length) {
                    return this.$message({message: '请先选中商品', type: 'warning'})
                }
                this.$confirm(`您确定要给多个商品发送提醒吗?`, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.urge(this.vo.selectRow.join(','))
                }).catch(() => {
                });
            },
            urge(productIds){
                this.$post("/message/send", {productIds}).then(data=> {
                    this.$message("发送成功")
                }).catch(err=> {
                    this.$alert(err.message, {type: 'error'})
                })
            },
            openAllDialog(){
                this.po.notice = {
                    type: 0,
                    content: ''
                }
                this.vo.showAllDialog = true
            },
            sendAllUserNotice(){
                this.$refs.noticeForm.validate((valid) => {
                    if(valid){
                        this.$post("/message/sendAll", this.po.notice).then(data=> {
                            this.$message("发送成功")
                            this.vo.showAllDialog = false
                        }).catch(err=> {
                            this.$alert(err.message, {type: 'error'})
                        })
                    }
                })
            }
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