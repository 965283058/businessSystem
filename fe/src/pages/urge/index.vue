<style scoped>
    .content-box {
        width: 100%;
        height: 100%;
        background: #ffffff;
        display: flex;
        flex-direction: column;
    }

    .top {
        height: auto;
        min-height: 65px;
        background: #eaedf1;
        border-top: 1px solid #bbbbbb;
        border-bottom: 1px solid #bbbbbb;
        font-size: 18px;
        color: #3bc1a6;
        line-height: 50px;
        padding: 7.5px 10px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .search__result {
        width: 400px;
        height: 50px;
        flex-shrink: 0;
    }

    .search__radio {
        margin: 0;
        margin-right: 10px;
    }
    .search__radio >>> .el-radio__label{
        padding-left: 3px;
    }

    .search__result--input {
        width: 200px;
        display: flex;
        align-items: center;
        margin-right: 20px;
    }

    .form__img-box {
        margin-right: 20px;
        float: left;
    }

    .form__img-box img {
        max-width: 120px;
        max-height: 120px;
    }



    .time_join {
        width: 20px;
        text-align: center;
        display: inline-block
    }

    .dg__button {
        text-align: center;
        font-size: 14px;
        line-height: 24px;
        color: #0028ff;
        cursor: pointer;
    }

    .dg__button--black {
        color: black;
    }

    .dg__button--green {
        color: #259b24;
    }

</style>
<template>
    <div class="content-box">
        <div class="top">
            <label>结束时间：</label>
            <div class="search__result">
                <el-radio class="search__radio" v-model="po.params.day" label="0">结束当天</el-radio>
                <el-radio class="search__radio" v-model="po.params.day" label="1-5">结束1-5天</el-radio>
                <el-radio class="search__radio" v-model="po.params.day" label="5-10">结束5-10天</el-radio>
                <el-radio class="search__radio" v-model="po.params.day" label=">10">10天以上</el-radio>
            </div>
            <div class="search__result search__result--input">
                <el-input class="top__input" placeholder="输入商品ID进行搜索" v-model="po.params.productId"
                          size="medium"></el-input>
            </div>
            <div class="search__result search__result--input">
                <el-select class="top__input" clearable v-model="po.params.userId" placeholder="请选择招商员" size="medium">
                    <el-option v-for="item in vo.userList"
                               :key="item._id"
                               :label="item.name"
                               :value="item._id">
                    </el-option>
                </el-select>
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

            <el-table-column key="createTime" prop="createTime" label="提交时间" width="95" align="center" sortable="true">
                <template slot-scope="scope">
                    <div>{{scope.row.createTime|getDateString}}</div>
                    <div>{{scope.row.createTime|getTimeString}}</div>
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
            <el-table-column key="active" label="活动时间" width="200" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.beginTime|getDateTimeString}}</div>
                    <span class="time_join">至</span>
                    <div>{{scope.row.endTime|getDateTimeString}}</div>
                </template>
            </el-table-column>
            <el-table-column key="price" prop="price" label="券后价" width="100" align="center"></el-table-column>
            <el-table-column key="commission" label="佣金" width="100" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.commission+'%'}}</div>
                </template>
            </el-table-column>
            <el-table-column key="serviceCharge" prop="serviceCharge" label="服务费" width="100"
                             align="center"></el-table-column>
            <el-table-column key="desc" prop="desc" label="商品文案" min-width="200" header-align="center"></el-table-column>
            <el-table-column key="remark" prop="remark" label="备注" min-width="200" header-align="center"></el-table-column>
            <el-table-column prop="createor.name" label="招商员" width="100" align="center"></el-table-column>
            <el-table-column label="操作" align="center" key="setting" width="100" fixed="right">
                <template slot-scope="scope">
                    <p class="dg__button" @click="openInfoDialog(scope.row)">查看详情</p>
                    <p class="dg__button dg__button--green" v-if="canUrge(scope.row)" @click="urge(scope.row._id)">
                        提醒</p>
                    <p class="dg__button dg__button--black" v-else>已提醒</p>
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

        <el-dialog width="780px" :visible.sync="vo.showInfoDialog" title="商品详情">
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
            return {
                po: {
                    params: {
                        day: '0',
                        userId:'',
                        productId:''
                    },
                    notice: {
                        type: 0,
                        content: ''
                    }
                },
                vo: {
                    userList:[],
                    product: null,
                    showInfoDialog: false,
                    selectRow: null,
                    showAllDialog: false,
                    auditDialogTitle: '',
                    now: null
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
            openInfoDialog(prod){
                this.vo.product = prod
                this.vo.showInfoDialog = true
            },
            getList(){
                this.$refs.dg.reload()
                this.vo.selectRow = null
                this.vo.now = Date.now()
            },
            canUrge(prod){
                let time = null
                for (let i = prod.record.length - 1; i >= 0; i--) {
                    if (prod.record[i].remark == "催单" && prod.record[i].status === null && prod.record[i].oldStatus === null) {
                        time = prod.record[i].time
                        break
                    }
                }
                if (time && this.vo.now - time < (24 * 60 * 60 * 1000)) {
                    return false
                }
                return true

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
                    this.getList()
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
                    if (valid) {
                        this.$post("/message/sendAll", this.po.notice).then(data=> {
                            this.$message("发送成功")
                            this.vo.showAllDialog = false
                        }).catch(err=> {
                            this.$alert(err.message, {type: 'error'})
                        })
                    }
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
        mounted(){
            this.vo.now = Date.now()
            this.getUserList()
        },
        components: {
            perview,
            productInfo
        },
        filters: {
            getDateString,
            getDateTimeString,
            getTimeString(val){
                let str = getDateTimeString(val)
                return str.substring(10)
            }
        },
        watch: {
            'po.result': function (val) {
                this.po.params.result = val.join(',')
            }
        }
    }
</script>