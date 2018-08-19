<style scoped>
    .login-warp {
        min-height: 400px;
        height: 100%;
        background: url("./assets/bg.jpg") no-repeat;
        background-size: cover;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-box {
        width: 100%;
        min-width: 600px;
        box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);
        background-clip: padding-box;
        padding: 35px 0;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .login-box__content {
        width: 550px;
        margin: 0 auto;
    }

    .title {
        font-family: '微软雅黑 Bold', '微软雅黑';
        font-weight: 700;
        font-size: 48px;
        color: #ffffff;
    }

    .title--en {
        font-size: 36px;
    }

    .login__form {
        text-align: left;
    }

    .form__input {
        width: 220px;
    }

    .warp .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }

    .errorStyle {
        height: 20px;
        line-height: 20px;
        font-size: 16px;
        color: greenyellow;
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
    <div class="login-warp">
        <div class="login-box">
            <div class="login-box__content">
                <div class="title">
                    <h1>招商业绩登记平台</h1>
                    <h1 class="title--en">Investment Performance System</h1>
                </div>
                <br>
                <el-form class="login__form" :model="po" :rules="vo.rules" label-position="left" ref="userForm" inline>
                    <el-form-item prop="userName">
                        <el-input class="form__input" type="text" v-model="po.userName" placeholder="账号" wdith="220px"
                                  @keydown.enter.native="login">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pwd">
                        <el-input class="form__input" type="password" v-model="po.pwd" placeholder="密码"
                                  @keydown.enter.native="login"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="width:100%;" @click="login()">登录
                        </el-button>
                    </el-form-item>
                    <div class="errorStyle" :class="{'errorStyle--show':vo.loginErrMsg}">{{vo.loginErrMsg}}</div>
                </el-form>
            </div>
        </div>
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