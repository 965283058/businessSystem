<style scoped>
    .content-box {
        width: 100%;
        height: 100%;
        background: #ffffff;
        position: relative;
    }

    .top {
        height: 65px;
        background: #eaedf1;
        border-top: 1px solid #bbbbbb;
        border-bottom: 1px solid #bbbbbb;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        font-size: 18px;
        color: #3bc1a6;
        line-height: 65px;
        padding-left: 50px;
    }

    .content {
        position: absolute;
        left: 0;
        top: 65px;
        right: 0;
        bottom: 0;
        overflow: auto;
    }

    .dg_button {
        color: #3bc1a6;
        cursor: pointer;
    }

    .dg_button:hover {
        color: #3bc1af;
    }
</style>
<template>
    <div class="content-box">
        <div class="top">
            <el-button type="primary" size="small" @click="reload">刷新</el-button>
        </div>
        <div class="content">
            <DataGrid ref="dg" url="/manage/user/list" :params="po.params" @expand-change="expandChange">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="微信头像：">
                                <img :src="props.row.avatarUrl" alt="">
                            </el-form-item>
                            <el-form-item label="开奖次数：">
                                <span v-if="vo.userOtherData[props.row._id]!==undefined">{{vo.userOtherData[props.row._id].successCollage.length}}</span>
                            </el-form-item>
                            <el-form-item label="中奖次数：">
                                <span v-if="vo.userOtherData[props.row._id]!==undefined">{{vo.userOtherData[props.row._id].winner.length }}</span>
                            </el-form-item>
                            <el-form-item label="支付次数：">
                                <span v-if="vo.userOtherData[props.row._id]!==undefined">{{vo.userOtherData[props.row._id].doneOrder.length}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>

                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="nickName" label="微信昵称" width="280" header-align="center"
                                 align="left"></el-table-column>
                <el-table-column prop="gender" label="性别" width="100" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.scope==0?"女":scope.row.scope==1?"男":'未知'}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="country" label="国家" width="120" align="center"></el-table-column>
                <el-table-column prop="province" label="省份" width="150" align="center"></el-table-column>
                <el-table-column prop="city" label="城市" width="180" align="center"></el-table-column>
                <el-table-column label="首次进入小程序时间" width="160" align="center">
                    <template slot-scope="scope">
                        <div>{{getDateTimeString(scope.row.time)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="Invitation.length" label="分享小程序次数" width="120" align="center"></el-table-column>
                <el-table-column prop="shareMoments.length" label="分享到朋友圈次数" width="140"
                                 align="center"></el-table-column>
            </DataGrid>
        </div>

    </div>
</template>

<script>
    import {getDateTimeString, getDateString} from 'utils'
    import bus  from 'utils/bus'
    export default {
        data(){
            return {
                po: {
                    params: {},
                    admin: {
                        id: null,
                        email: '',
                        name: '',
                        job: '',
                        power: [],
                        status: 1,
                    },
                },
                vo: {
                    showDialog: false,
                    dialogTitle: '',
                    userOtherData: {}
                }
            }
        },
        computed: {},
        methods: {
            getDateString,
            getDateTimeString,
            getDateTimeShort(time){
                return getDateTimeString(time).substring(0, 16)
            },
            reload(){
                this.$refs.dg.reload()
            },
            expandChange(row){
                if (!this.vo.userOtherData[row._id]) {
                    this.$post("/manage/user/otherInfo", {"userId": row._id}).then(data=> {
                        this.$set(this.vo.userOtherData, row._id, data)
                    }).catch(err=> {
                        this.$message.error(`获取用户${row.nickName}信息失败！`)
                    })
                }
            }

        },
        mounted(){


        },
        components: {},
        filters: {}
    }
</script>