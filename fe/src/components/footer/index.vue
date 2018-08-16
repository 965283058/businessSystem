<style scoped>
    .footer {
        width: 100%;
        height: 130px;
    }
    .footer__content {
        background: #f6f6f6;
        text-align: center;
        line-height: 60px;
        font-size: 14px;
    }
    .footer__content span,
    .footer__content a{
        margin-right: 7px;
    }
    .footer__link {
        color: #000000;
    }
    .footer__link--img{
        position: relative;
        top: 5px;
    }
    .footer__img-warp {
        display: block;
        text-align: center;
    }
    .footer__img-warp img{
        height: 31px;
        margin-right: 20px;
        margin-top: 15px;
    }

    @media only screen and (max-device-width: 414px){
        .footer {
            width: 100%;
            height: auto;
        }
        .footer__content {
            background: #f6f6f6;
            text-align: center;
            font-size: 0.34rem;
            line-height: 0.7rem;
        }
        .footer__content span,
        .footer__content a{
            display:block ;
            margin: 0;
            padding: 0;

        }
        .footer__link--img{
            width: 0.4rem;
            position: relative;
            top: 5px;
        }
        .footer__img-warp {
            display: block;
            text-align: center;
        }
        .footer__img-warp img{
            height: 1rem;
            margin-right: 0.1rem;
            margin-top: 0.2rem;
        }
    }

</style>
<template>
    <div class="footer">
        <div class="footer__content">
            <span> <span>Copyright 2016 Houbank.com,All Rights Reserved.</span><span>上海厚本金融信息服务有限公司</span></span>
            <span>沪ICP备15002211号-2 </span>
            <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010102002097"
               class="footer__link"><img class="footer__link--img" src="./assets/ghs.png">沪公网安备 31010102002097号</a>
        </div>
        <div class="footer__img-warp">
            <img src="./assets/wx_seal.png" alt=""/>
            <img src="./assets/cert.png" alt=""/>
            <img src="./assets/cnnic.png" alt=""/>
            <img src="./assets/v_seal.png" alt=""/>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {}
        },
        computed: {},
        methods: {},
        mounted(){
        },
        components: {},
        filters: {}
    }
</script>