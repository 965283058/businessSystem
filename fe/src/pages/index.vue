<style scoped>
    .base-warp {
        width: 100%;
        height: 100%;
        min-width: 768px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-sizing: border-box;
    }

    .jf-header {
        height: 60px;
        /*padding-left: 40px;*/
        background: #3bc1a6;
        flex-shrink: 0;
    }

    .jf-header__title {
        color: #FFFFFF;
        font-size: 32px;
        line-height: 60px;
        float: left;
        margin-left: 9px;
    }

    .header_button {
        width: 130px;
        height: 40px;
        line-height: 40px;
        font-size: 20px;
        border-radius: 5px;
        border: 0;
        color: #000;
        float: left;
        margin: 10px 0 0 20px;
    }

    .header_button:hover {
        outline: 0;
        box-shadow: 0 0 1px 0 #ffffff;
    }

    .header_button:active {
        outline: 0;
    }

    .jf-layout {
        width: 100%;
        height: 100%;
        overflow: scroll;
    }

    .jf-content {
        display: flex;
        flex: 1;
    }

    .jf-user-menu {
        cursor: pointer;
        float: right;
        margin-right: 50px;
        color: #FFF;
        font: 16px bold;
        line-height: 60px;
    }

    .router {
        color: #333333;
        display: block;
    }

    .jf-menus {
        width: 155px;
        height: 100%;
        flex-shrink: 0;
    }

    .left-menu {
        height: 100%;
        background: #46425a;
        overflow-x: hidden;
        padding-top: 20px;
    }

    .left-menu::-webkit-scrollbar {
        width: 2px;
    }

    .jf-view-content {
        flex: 1;
        overflow: auto;
        display: block;
    }

    body .left-menu__item {
        color: #cccccc;
        font-weight: bold;
        font-size: 18px;
    }

    body .left-menu__item--active {
        background: #46425a;
        color: #ffffff;
    }

    body .left-menu__item:hover {
        background: #46425a;
        color: #ffffff;
    }

    .menu__icon {
        display: inline-block;
        width: 40px;
        height: 30px;
        background: url("./assets/images/menu_home.png") no-repeat;
        background-position: left center;
        background-size: 25px 25px;
    }

    .menu__icon--home {
        background: url("./assets/images/menu_home.png") no-repeat;
    }

    .menu__icon--user {
        background: url("./assets/images/menu_user.png") no-repeat;
    }

    .menu__icon--order {
        background: url("./assets/images/menu_order.png") no-repeat;
    }

    .menu__icon--correction {
        background: url("./assets/images/menu_correction.png") no-repeat;
    }

    .menu__icon--power {
        background: url("./assets/images/menu_power.png") no-repeat;
    }

    .menu--child {
        padding-left: 15px;
        font-size: 14px;
    }

</style>

<style>
    .dg_button {
        color: #65cad8;
        display: inline-block;
        cursor: pointer;
    }

    .dg_button:hover {
        color: #3bc1a6;
    }

    body .left-menu__item .el-submenu__title {
        color: #cccccc;
        font-weight: bold;
        font-size: 18px;
    }

    body .left-menu__item .el-submenu__title:hover {
        background: #46425a;
        color: #ffffff;
    }


</style>

<template>
    <div class="base-warp">
        <div class="jf-header">
            <span class="jf-header__title">团队招商业绩登记平台</span>
            <el-dropdown class="jf-user-menu">
                <span>{{admin.job?admin.job:(admin.superAdmin==-1?"招商员":'管理员')}}-{{admin.name}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="showPasswordDialog()">修改密码</span></el-dropdown-item>
                    <el-dropdown-item><span @click="logout()">退出登录</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-row class="jf-content">
            <div class="jf-menus">
                <el-menu default-active="2" class="left-menu">
                    <template v-for="(menu,index) in menus">
                        <el-submenu :index="index+''" v-if="menu.children&&menu.children.length"
                                    class="left-menu__item">
                            <div slot="title"><i :class="menu.icon"></i>{{menu.text}}</div>
                            <el-menu-item v-if="menu.children" v-for="(child,inx) in menu.children"
                                          :index="index+''+inx" :key="child.id">
                                <div class="menu--child" @click="to(child)">{{child.text}}</div>
                            </el-menu-item>
                        </el-submenu>

                        <el-menu-item v-else :index="index+''+index" class="left-menu__item"
                                      :class="{'left-menu__item--active':menu.id==activeMenu.id}">
                            <div @click="to(menu)"><i :class="menu.icon"></i>{{menu.text}}</div>
                        </el-menu-item>
                    </template>
                </el-menu>
            </div>
            <div class="jf-view-content">
                <router-view></router-view>
            </div>
        </el-row>

        <el-dialog title="修改密码" :visible.sync="showPwdDialog">
            <el-form :model="po" ref="form" label-width='100px' :rules="rules">
                <el-form-item label="当前密码" prop="oldPwd">
                    <el-input type="password" v-model="po.oldPwd" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="pwd">
                    <el-input type="password" v-model="po.pwd" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="pwdConfirm">
                    <el-input type="password" v-model="po.pwdConfirm" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="showPwdDialog = false">取 消</el-button>
                <el-button type="primary" @click="changePwd">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="管理员通知" :visible.sync="msgDialog.show" width="400px" :show-close="false"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <span>{{msgDialog.text}}</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeMsgDialog">{{msgDialog.btnText}}</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import bus  from 'utils/bus'
    export default {
        data: function () {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入新密码'));
                } else if (value !== this.po.pwd) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            }


            return {
                po: {
                    oldPwd: '',
                    pwd: '',
                    pwdConfirm: ''
                },
                admin: {},
                activeMenu: "",
                menuData: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                menus: [],
                showPwdDialog: false,

                rules: {
                    oldPwd: [
                        {required: true, message: '请输入当前密码', trigger: 'blur'},
                        {min: 6, max: 35, message: '长度在 6 到 35 个字符', trigger: 'blur'}
                    ],
                    pwd: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, max: 35, message: '长度在 6 到 35 个字符', trigger: 'blur'}
                    ],
                    pwdConfirm: [{validator: validatePass2, trigger: 'blur'}]
                },
                messageList: [],
                messageTimer: null,

                msgDialog: {
                    id: null,
                    text: '',
                    show: false,
                    btnText: '',
                    timer: null
                }
            }
        },
        components: {},
        methods: {
            showPasswordDialog(){
                this.po = {
                    oldPwd: '',
                    pwd: '',
                    pwdConfirm: ''
                }
                this.showPwdDialog = true
            },
            changePwd(){
                this.$refs.form.validate().then(valid=> {
                    if (valid) {
                        this.$post("/manage/admin/changePwd", this.po).then(data=> {
                            this.showPwdDialog = false
                            this.$message("修改成功！")
                            this.$post('/logout').then(()=> {
                                window.sessionStorage.removeItem("admin")
                                this.$router.replace("/login")
                            })
                        }).catch(err=> {
                            this.$alert(err.message, {type: 'error'})
                        })
                    }
                }).catch(()=> {
                })
            },
            to(menu){
                this.activeMenu = menu
                this.$router.replace(menu.router)
                bus.$emit("selectMenu", menu)
            },
            logout(){
                this.$confirm("您确定退出登录吗？", "提示").then(()=> {
                    this.$post('/logout').then(()=> {
                        window.sessionStorage.removeItem("admin")
                        this.$router.replace("/login")
                    }).catch(err => {
                        this.$alert(err.message, {type: "error"})
                    })
                }).catch(() => {
                });
            },
            reload(){
                bus.$emit("reload")
            },
            getMenuList(){
                this.$get('/manage/menu/treeMenu').then(data=> {
                    this.menus = data
                    this.$nextTick(()=> {
                        let menu = data[0]
                        if (menu.children && menu.children.length) {
                            menu = menu.children[0]
                        }
                        this.to(menu)
                    })
                }).catch(err=> {
                    this.$alert(err.message, {type: 'error'})
                })
            },
            getMessage(){
                this.$get('/message/list').then(data=> {
                    this.messageList = data
                    this.showMessage()
                }).catch(err=> {

                })
            },
            showMessage(){
                if (this.messageList && this.messageList.length) {
                    this.msgDialog.id = this.messageList[0]._id
                    this.msgDialog.text = this.messageList[0].content
                    this.msgDialog.btnText = '10秒后可以关闭'
                    this.msgDialog.show = true
                    let time = 10
                    this.msgDialog.timer = setInterval(()=> {
                        time -= 1
                        this.msgDialog.btnText = `${time}秒后可以关闭`
                        if (time == 0) {
                            this.msgDialog.btnText = `关闭`
                            clearInterval(this.msgDialog.timer)
                        }
                    }, 1000)
                }
            },
            closeMsgDialog(){
                if (this.msgDialog.btnText == "关闭") {
                    this.msgDialog.show = false
                    let index = -1
                    for (let i = 0; i < this.messageList.length; i++) {
                        if (this.messageList[i]._id == this.msgDialog.id) {
                            index = i
                            break
                        }
                    }
                    if (index > -1) {
                        this.messageList.splice(index, 1)
                    }
                    this.readMessage(this.msgDialog.id)
                    this.msgDialog.id = null
                }

            },
            readMessage(id){
                this.$post("/message/read", {id}).then(data => {
                    this.showMessage()
                }).catch(err => {
                    this.showMessage()
                })
            }
        },
        beforeRouteEnter(to, form, next){
            let admin = window.sessionStorage.getItem("admin")
            if (!admin) {
                window.location.href = window.location.origin + "/login"
            } else {
                next()
            }
        },
        mounted () {
            try {
                let admin = window.sessionStorage.getItem("admin")
                if (!admin) {
                    return this.$router.replace("/login")
                }
                this.admin = JSON.parse(admin)
                this.getMenuList()
            } catch (e) {
                this.$router.replace("/login")
            }
            this.getMessage()
            this.messageTimer = setInterval(this.getMessage, 1000 * 60)
        },
        beforeDestroy(){
            clearInterval(this.messageTimer)
            clearInterval(this.msgDialog.timer)
        },
        filters: {}
    }
</script>