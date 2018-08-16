<style scoped>
    .header {
        width: 100%;
        min-width: 1080px;
        height: 130px;
        background: #383c40;
        display: flex;
        align-items: center;
        position: relative;
    }

    .header__logo {
        margin-left: 450px;
    }

    .manage {
        display: block;
        color: #fff6dd;
        font-size: 30px;
        position: absolute;
        right: 50px;
    }

    @media only screen and (max-device-width: 414px) {
        .header {
            height: 1.2rem;
            min-width: 100%;
            background-repeat: no-repeat;
            background-size: cover;
            overflow: hidden;
        }

        .header__logo {
            margin-left: 1rem;
            height: 0.6rem;
        }

        .manage {
            display: none;
        }
    }

</style>
<template>
    <div class="header">
        <img src="./assets/logo.png" class="header__logo" alt="">
        <router-link v-if="isAdmin" class="manage" to="/manage">进入后台</router-link>
    </div>
</template>

<script>
    export default {
        data(){
            return {}
        },
        computed: {
            isAdmin(){
                let userStr = window.sessionStorage.user
                if (userStr) {
                    let user = JSON.parse(userStr)
                    return user.power.length > 0 || user.superAdmin == 1
                } else {
                    return false
                }
            }
        },
        methods: {},
        mounted(){
            console.info(this.isAdmin)
        },
        components: {},
        filters: {}
    }
</script>