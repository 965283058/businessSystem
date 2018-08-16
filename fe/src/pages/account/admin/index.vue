<style scoped>
    .content-box {
        width: 100%;
        height: 100%;
        background: #ffffff;
        position: relative;
    }

    .search {
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

    .search__item {
        display: flex;
        margin-right: 35px;
    }

    .search__item-val {
        width: 160px;
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
        <div class="search">
            <div class="search__item">
                <label>姓名：</label>
                <el-input class="search__item-val" size="small" v-model="po.params.name"></el-input>
            </div>
            <div class="search__item">
                <label>登录邮箱：</label>
                <el-input class="search__item-val" size="small" v-model="po.params.email"></el-input>
            </div>
            <div>
                <el-button class="search__button" type="success" size="small" @click="reload">查询</el-button>
                <el-button class="search__button" type="primary" size="small" @click="showDialog('add')">添加用户
                </el-button>
            </div>
        </div>
        <div class="content">
            <DataGrid ref="dg" url="/manage/admin/list" :params="po.params">
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="email" label="登录邮箱" width="280" header-align="center"
                                 align="left"></el-table-column>
                <el-table-column prop="name" label="姓名" width="130" align="center"></el-table-column>
                <el-table-column prop="job" label="职责" width="180" align="center"></el-table-column>
                <el-table-column label="账号类型" width="160" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.superAdmin==-1?'普通用户':scope.row.superAdmin==0?'管理员':'超级管理员'}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" width="160" align="center">
                    <template slot-scope="scope">
                        <div>{{getDateTimeString(scope.row.createTime)}}</div>
                    </template>
                </el-table-column>

                <el-table-column label="最后登录" width="160" align="center">
                    <template slot-scope="scope">
                        <div>{{getDateTimeString(scope.row.lastLoginTime)}}</div>
                    </template>
                </el-table-column>

                <el-table-column label="是否启用" width="120" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status===-1">已删除</span>
                        <div v-else>
                            <el-switch v-if="scope.row._id!=vo.currAdmin.id&&scope.row.superAdmin!==1" :active-value="1" :inactive-value="0"
                                       v-model="scope.row.status"
                                       active-color="#13ce66" inactive-color="#ff4949"
                                       @change="changeStatus(scope.row)"></el-switch>
                            <span v-else>不可操作</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <div v-if="canSet(scope.row)">
                            <span class="dg_button" @click="showDialog('edit',scope.row)">编辑</span>
                            <span class="dg_button" @click="resetPwd(scope.row)">重置密码</span>
                            <span class="dg_button" @click="del(scope.row)">删除</span>
                        </div>
                        <span v-else>不可操作</span>
                    </template>
                </el-table-column>
            </DataGrid>
        </div>


        <el-dialog :title="vo.dialogTitle" :visible.sync="vo.showDialog">
            <el-form :model="po.admin" ref="form" label-width='100px'>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="po.admin.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="po.admin.email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="账号类型">
                    <el-radio v-model="po.admin.superAdmin" :label="-1">普通用户</el-radio>
                    <el-radio v-model="po.admin.superAdmin" :label="0">管理员</el-radio>
                </el-form-item>
                <el-form-item label="职责" prop="job">
                    <el-input v-model="po.admin.job" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="power" header-align="center" align="left">
                    <el-checkbox-group v-model="po.admin.power">
                        <el-checkbox v-for="role in vo.roleList" :label="role._id" :key="role._id">{{role.name}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="po.admin.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="vo.showDialog = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getDateTimeString, getDateString} from 'utils'
    import bus  from 'utils/bus'
    export default {
        data(){
            return {
                po: {
                    params: {
                        name: ''
                    },
                    admin: {
                        id: null,
                        email: '',
                        name: '',
                        superAdmin: -1,
                        job: '',
                        power: [],
                        status: 1,
                    },
                },
                vo: {
                    showDialog: false,
                    dialogTitle: '',
                    roleList: [],
                    currAdmin: {},
                }
            }
        },
        computed: {},
        methods: {
            canSet(row){
                if (row._id == this.vo.currAdmin.id) {
                    return false
                }
                if (row.superAdmin != 1 && row.status !== -1) {
                    return true
                }
                return false
            },

            getDateString,
            getDateTimeString,
            getDateTimeShort(time){
                return getDateTimeString(time).substring(0, 16)
            },
            reload(){
                this.$refs.dg.reload()
            },

            changeStatus(info){
                this.$confirm(`您确定要${info.status == 1 ? "启用" : "禁用"}用户${info.name}的吗?`, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post("/manage/admin/changeStatus", {id: info._id}).then(data=> {
                        this.reload()
                    }).catch(err=> {
                        info.status = Math.abs(info.status - 1)
                        this.$alert(err.message, {type: 'error'})
                    })
                }).catch(() => {
                    info.status = Math.abs(info.status - 1)
                });
            },

            resetPwd(info){
                this.$confirm(`您确定要重置用户${info.name}的密码吗?`, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post("/manage/admin/resetPwd", {id: info._id}).then(data => {
                        this.$message('操作成功')
                    }).catch(err => {
                        this.$alert(err.message, {type: 'error'})
                    })
                }).catch(() => {
                })

            },

            showDialog(mode, info){
                this.vo.showDialog = true
                if (mode == 'add') {
                    this.po.admin = {
                        id: null,
                        email: '',
                        name: '',
                        superAdmin: -1,
                        job: '',
                        power: [],
                        status: 1
                    }
                    this.vo.dialogTitle = '添加管理员'
                } else {
                    this.vo.dialogTitle = '编辑管理员'
                    Object.keys(this.po.admin).forEach(field=> {
                        this.po.admin[field] = info[field]
                    })
                    this.po.admin.power = info.power.map(item=>item._id)
                    this.po.admin.id = info._id
                }
            },
            edit(){
                this.$refs.form.validate().then(valid=> {
                    if (valid) {
                        this.$post("/manage/admin/edit", this.po.admin).then(data=> {
                            this.vo.showDialog = false
                            this.reload()
                        }).catch(err=> {
                            this.$alert(err.message, {type: 'error'})
                        })
                    }
                }).catch(()=> {
                })
            },
            del(info){
                this.$confirm(`您确定要删除管理员【${info.name}】的吗?`, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post("/manage/admin/del", {id: info._id}).then(data=> {
                        this.reload()
                    }).catch(err=> {
                        this.$alert(err.message, {type: 'error'})
                    })
                }).catch(() => {

                });
            },

            getRoleList(){
                this.$get('/manage/admin/roleList').then(data=> {
                    this.vo.roleList = data
                }).catch(err=> {
                    this.$alert(err.message, {type: 'error'})
                })
            }
        },
        mounted(){
            this.getRoleList()
            try {
                let admin = window.sessionStorage.getItem("admin")
                this.vo.currAdmin = JSON.parse(admin)
            } catch (e) {
            }
            bus.$on("reload", ()=> {
                this.getRoleList()
                this.reload()
            })
        },
        destroyed(){
            bus.$off("reload")
        },
        components: {},
        filters: {}
    }
</script>