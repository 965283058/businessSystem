<style scoped>
    .box {
        min-height: 400px;
        height: 100%;
        background: #1f2d3d;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .warp {
        box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        background-color: #F9FAFC;
        border: 2px solid #8492A6;
        width: 350px;
        height: 350px;
        padding: 35px 35px 15px 35px;
        overflow: hidden;
    }

    .warp .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .errorStyle {
        font-size: 14px;
        color: #ea576f;
        display: inline-block;
    }

    .errorStyle--show {
        animation: err 0.8s linear;
    }

    @keyframes err {
        0% {
            transform: translateX(-10px);
        }
        10% {
            transform: translateX(10px);
        }
        20% {
            transform: translateX(-8px);
        }
        30% {
            transform: translateX(8px);
        }
        40% {
            transform: translateX(-6px);
        }
        50% {
            transform: translateX(6px);
        }
        60% {
            transform: translateX(-4px);
        }
        70% {
            transform: translateX(4px);
        }
        80% {
            transform: translateX(-2px);
        }
        90% {
            transform: translateX(2px);
        }
        100% {
            transform: translateX(0px);
        }
    }
</style>
<template>
    <div class="box">
        <el-form :model="po" :rules="vo.rules" label-position="left" ref="userForm" class="warp">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="userName">
                <el-input type="text" v-model="po.userName" auto-complete="off" placeholder="账号"
                          @keydown.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item prop="pwd">
                <el-input type="password" v-model="po.pwd" auto-complete="off" placeholder="密码"
                          @keydown.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item style="width:100%;">
                <el-button type="primary" style="width:100%;" @click="login()">登录
                </el-button>
            </el-form-item>
            <el-form-item>
                <span class="errorStyle" :class="{'errorStyle--show':vo.loginErrMsg}">{{vo.loginErrMsg}}</span>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

    export default {
        data: function () {
            return {
                po: {
                    userName: '',
                    pwd: ''
                },
                vo: {
                    loginErrMsg: '',
                    rules: {
                        userName: [{required: true, message: '请输入账号', trigger: 'blur'}],
                        pwd: [
                            {required: true, message: '请输入密码', trigger: 'blur'},
                            {min: 6, max: 35, message: '长度在6到35个非空字符', trigger: 'blur'}]
                    }
                }
            }
        },
        methods: {
            login(){
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        this.$post('/login', this.po).then(data=> {
                            if (data) {
                                window.sessionStorage.setItem("admin", JSON.stringify(data))
                                this.$router.replace("/")
                            }
                        }).catch(err=> {
                            this.vo.loginErrMsg = ''
                            setTimeout(()=> {
                                this.vo.loginErrMsg = err.message
                            }, 200)
                        })
                    }
                })
            }
        },
        mounted: function () {
            this.$message().close()
        },
        filters: {}
    }
</script>