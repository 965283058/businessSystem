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

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }

    .info__cell {
        width: 100%;
        display: flex;
        margin: 10px 0;
    }

    .info__cell label {
        width: 70px;
        flex-shrink: 0;
    }

    .info__cell span {
        flex: 1;
        word-break: break-all;
    }
</style>
<template>
    <div class="content-box">
        <div class="top">
            <el-button type="success" size="small" @click="reload">刷新</el-button>
            <el-button type="primary" size="small" @click="showDialog('add')">添加</el-button>
        </div>
        <div class="content">
            <DataGrid ref="dg" url="/manage/role/list" :params="po.params">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <div class="info__cell">
                            <label>菜单权限：</label>
                            <span>{{ props.row.menus.map(item=>item.text).join(',') }}</span>
                        </div>
                        <div class="info__cell">
                            <label>接口权限：</label>
                            <span>{{props.row.apis.join(',')}}</span>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="name" label="名称" width="130" align="center"></el-table-column>
                <el-table-column label="是否启用" width="120" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.status==1?'启用':'禁用'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="editor.name" label="最后编辑人" width="130" align="center"></el-table-column>
                <el-table-column label="最后编辑时间" width="160" align="center">
                    <template slot-scope="scope">
                        <div>{{getDateTimeString(scope.row.editTime)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <span class="dg_button" @click="showDialog('edit',scope.row)">编辑</span>
                        <span class="dg_button" @click="del(scope.row)">删除</span>
                    </template>
                </el-table-column>
            </DataGrid>
        </div>


        <el-dialog :title="vo.dialogTitle" :visible.sync="vo.showDialog">
            <el-form :model="po.role" ref="form" label-width='100px'>
                <el-form-item label="名称" prop="text">
                    <el-input v-model="po.role.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单权限" prop="router">
                    <el-tree ref="tree" :props="vo.treeProp" :data="vo.menus" node-key="id" show-checkbox
                             default-expand-all check-strictly
                             @check-change="treeCheck">
                    </el-tree>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="po.role.status">
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
                    params: {},
                    role: {
                        id: null,
                        name: '',
                        menus: [],
                        power: [],
                        status: 1
                    },
                },
                vo: {
                    treeProp: {
                        label: 'text',
                        children: 'children'
                    },
                    showDialog: false,
                    dialogTitle: '',
                    roleList: [],
                    menus: {}
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
            showDialog(mode, info){
                this.vo.showDialog = true
                let arr = []
                if (mode == 'add') {
                    this.po.role = {
                        id: null,
                        name: '',
                        menus: [],
                        power: [],
                        status: 1
                    }
                    this.vo.dialogTitle = '添加角色'
                } else {
                    this.vo.dialogTitle = '编辑角色'
                    arr = arr.concat(info.apis)
                    info.menus.forEach(item=> {
                        arr.push(item._id)
                    })

                    this.po.role = {
                        id: info._id,
                        name: info.name,
                        menus: info.menus.map(item=>item._id),
                        power: info.power,
                        status: info.status
                    }
                }

                this.$nextTick(()=> {
                    this.$refs.tree.setCheckedKeys(arr)
                })
            },
            edit(){
                this.$refs.form.validate().then(valid=> {
                    if (valid) {
                        let keyArr = this.$refs.tree.getCheckedKeys()
                        this.po.role.menus = []
                        this.po.role.apis = []
                        keyArr.forEach(item=> {
                            if (item.indexOf('_') == -1) {
                                this.po.role.menus.push(item)
                            } else {
                                this.po.role.apis.push(item)
                            }
                        })

                        this.$post("/manage/role/edit", this.po.role).then(data=> {
                            this.vo.showDialog = false
                            this.reload()
                        }).catch(err=> {
                            this.$message.error(err.message);
                        })
                    }
                }).catch(()=> {
                })
            },
            del(info){
                this.$confirm(`您确定要删除角色【${info.name}】的吗?`, '操作确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$post("/manage/role/del", {id: info._id}).then(data=> {
                        this.reload()
                    }).catch(err=> {
                        this.$message.error(err.message);
                    })
                }).catch(() => {

                });
            },


            treeCheck(data, chekc, children){
                this.$refs.tree.getCheckedNodes()
            },

            getMenuList(){
                this.$get('/manage/menu/treeMenu').then(data=> {
                    this.vo.menus = data.map(item=> {
                        if (item.children && item.children.length) {
                            item.children = item.children.map(child=> {
                                child.children = []
                                child.apis.forEach(api=> {
                                    child.children.push({
                                        id: api,
                                        text: `接口权限【${api}】`
                                    })
                                })
                                return child
                            })
                        } else {
                            item.children = []
                        }
                        let children = item.apis.map(api=> {
                            return {
                                id: api,
                                text: `接口权限【${api}】`
                            }
                        })
                        item.children = children.concat(item.children)
                        return item
                    })
                }).catch(err=> {
                    this.$message.error(err.message)
                })
            },
        },
        mounted(){
            this.getMenuList()
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