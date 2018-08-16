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

    .form__api {
        width: 200px;
        margin-right: 20px;
    }
</style>
<template>
    <div class="content-box">
        <div class="top">
            <el-button type="primary" size="small" @click="showDialog('add')">添加</el-button>
        </div>
        <div class="content">
            <el-table :data="vo.menus" border>
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column label="名称" width="150" header-align="center" align="left">
                    <template slot-scope="scope">
                        <div v-if="scope.row.parentId=='0'">{{scope.row.text}}</div>
                        <div v-else style="padding-left: 30px">{{scope.row.text}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="router" label="菜单路径" width="150" header-align="center"
                                 align="left"></el-table-column>
                <el-table-column label="菜单状态" width="90" align="center">
                    <template slot-scope="scope">
                        <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.status"
                                   active-color="#13ce66" inactive-color="#ff4949"
                                   @change="changeStatus(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="icon" label="图标" width="80" header-align="center" align="left"></el-table-column>
                <el-table-column prop="index" label="显示顺序" width="80" align="center"></el-table-column>
                <el-table-column label="接口权限" header-align="center" align="left">
                    <template slot-scope="scope">
                        <div>{{scope.row.apis.join()}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <span class="dg_button" @click="showDialog('edit',scope.row)">编辑</span>
                        <span class="dg_button" @click="del(scope.row)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :title="vo.dialogTitle" :visible.sync="vo.showDialog">
            <el-form :model="po" ref="form" label-width='100px'>
                <el-form-item label="菜单名称" prop="text">
                    <el-input v-model="po.text" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" prop="router">
                    <el-input v-model="po.router" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon">
                    <el-input v-model="po.icon" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="父级菜单" prop="parentId">
                    <el-select v-model="po.parentId" placeholder="请选择活动区域">
                        <el-option label="请选择" value=""></el-option>
                        <el-option :label="item.text" :key="item.id" :value="item.id"
                                   v-for="item in vo.parentMenus"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顺序号" prop="index">
                    <el-input-number v-model="po.index" :min="1" :max="100"></el-input-number>
                </el-form-item>
                <el-form-item label="后端接口权限" prop="apis" header-align="center" align="left">
                    <div ref="apis">
                        <el-input class="form__api" size="mini" v-for="item,index in vo.apis" v-model="item.api"
                                  :key="item.id">
                            <i v-if="index>0" class="el-icon-delete" slot="append" @click="delApi(index)"></i>
                            <i v-if="index==0" class="el-icon-circle-plus-outline" slot="append" @click="addApi"></i>
                        </el-input>
                    </div>
                </el-form-item>

                <el-form-item label="状态">
                    <el-radio-group v-model="po.status">
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

    import {guid} from 'utils'
    export default {
        data(){
            return {
                po: {
                    id: null,
                    text: '',
                    router: '',
                    icon: '',
                    parentId: '',
                    index: null,
                    apis: [],//后端接口权限（manage）
                    status: 1, // 0禁用 1正常
                },
                vo: {
                    menus: [],
                    apis: [],
                    parentMenus: [{id: '0', text: '根节点'}],
                    showDialog: false,
                    dialogTitle: "",
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
                this.$get('/manage/menu/treeMenu', {all: 1}).then(data=> {
                    let menus = []
                    this.vo.parentMenus = [{id: '0', text: '根节点'}]

                    data.forEach(menu=> {
                        menus.push(menu)
                        this.vo.parentMenus.push({id: menu.id, text: menu.text})
                        if (menu.children && menu.children.length) {
                            menu.children.forEach(item=> {
                                item.text = item.text
                                menus.push(item)
                            })
                        }
                    })

                    this.vo.menus = menus


                }).catch(err=> {
                    this.$massage.error(err.message)
                })
            },
            addApi(){
                let id = guid()
                this.vo.apis.push({
                    id: id,
                    api: ''
                })
            },
            delApi(index){
                this.vo.apis.splice(index, 1)
            },
            edit(){
                this.po.apis = this.vo.apis.map(item=>item.api).filter(item=>item && item.length)
                this.$refs.form.validate().then(valid=> {
                    if (valid) {
                        this.$post("/manage/menu/edit", this.po).then(data=> {
                            this.vo.showDialog = false
                            this.reload()
                        }).catch(err=> {
                            this.$message.error(err.message);
                        })
                    }
                }).catch(()=> {
                })
            },
            changeStatus(info){
                this.$confirm(`您确定要${info.status == 1 ? "启用" : "禁用"}菜单【${info.text}】的吗?`, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post("/manage/menu/changeStatus", {id: info.id}).then(data=> {
                        this.reload()
                    }).catch(err=> {
                        this.$message.error(err.message);
                    })
                }).catch(() => {
                    info.status = Math.abs(info.status - 1)
                });
            },
            del(info){
                this.$confirm(`您确定要删除菜单【${info.text}】的吗?`, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post("/manage/menu/del", {id: info.id}).then(data=> {
                        this.reload()
                    }).catch(err=> {
                        this.$message.error(err.message);
                    })
                }).catch(() => {

                });
            },
            showDialog(mode, info){
                this.vo.showDialog = true
                this.vo.apis.length = 0
                if (mode == 'add') {
                    this.po = {
                        id: '',
                        text: '',
                        router: '',
                        icon: '',
                        parentId: '',
                        index: null,
                        apis: [],//后端接口权限（manage）
                        status: 1, // 0禁用 1正常
                    }
                    this.vo.dialogTitle = '添加菜单'
                } else {
                    this.vo.dialogTitle = '编辑菜单'
                    Object.keys(this.po).forEach(field=> {
                        this.$set(this.po, field, info[field])
                    })
                    this.vo.apis = []
                    info.apis.forEach(item=> {
                        this.vo.apis.push({
                            id: guid(),
                            api: item
                        })
                    })
                }
                if (this.vo.apis.length == 0) {
                    this.vo.apis.push({
                        id: guid(),
                        api: ''
                    })
                }
            }
        },
        mounted(){
            this.reload()
            bus.$on("reload", ()=> {
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