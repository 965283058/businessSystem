<style scoped>
    .cell {
        display: flex;
        justify-content: flex-start;
        padding-left: 30px;
    }

    .cell a {
        word-break: break-all;
        color: blue;
    }
    .cell a:hover {
        text-decoration: underline;
    }

    .cell__caption {
        width: 80px;
        flex-shrink: 0;
        font-size: 14px;
        text-align: right;
        color: #333333;
    }

    .product-box .cell {
        margin-bottom: 20px;
    }

    .form__img-box {
        margin-right: 20px;
        float: left;
    }

    .form__img-box img {
        max-width: 120px;
        max-height: 120px;
    }
</style>
<template>
    <div class="product-box">
        <div class="cell">
            <label class="cell__caption">短标题：</label>
            <div>{{product.name}}</div>
        </div>
        <div class="cell">
            <label class="cell__caption">商品主图：</label>
            <perview class="form__img-box">
                <img :src="product.img[0]" alt="">
            </perview>
        </div>
        <div class="cell">
            <label class="cell__caption">原价：</label>
            <div>{{product.costPrice}}</div>
        </div>
        <div class="cell">
            <label class="cell__caption">券后价：</label>
            <div>{{product.price}}</div>
        </div>
        <div class="cell">
            <label class="cell__caption">佣金：</label>
            <div>{{product.commission}}%</div>
        </div>
        <div class="cell">
            <label class="cell__caption">券链接：</label>
            <div>
                <a :href="product.voucherLink" target="_blank">{{product.voucherLink}}</a>
            </div>
        </div>
        <div class="cell">
            <label class="cell__caption">券截图：</label>
            <perview class="form__img-box">
                <img :src="product.voucherImage" alt="">
            </perview>
        </div>
        <div class="cell">
            <label class="cell__caption">下单链接：</label>
            <a :href="product.orderLink" target="_blank">{{product.orderLink}}</a>
        </div>
        <div class="cell">
            <label class="cell__caption">商品文案：</label>
            <div>{{product.desc}}</div>
        </div>
        <div class="cell">
            <label class="cell__caption">服务费：</label>
            <div>{{product.serviceCharge}}</div>
        </div>
        <div class="cell">
            <label class="cell__caption">QQ：</label>
            <div>{{product.qq}}</div>
        </div>
        <div class="cell">
            <label class="cell__caption">电话：</label>
            <div>{{product.phone}}</div>
        </div>
        <div class="cell">
            <label class="cell__caption">微信：</label>
            <div>{{product.wx}}</div>
        </div>
        <div class="cell">
            <label class="cell__caption">活动时间：</label>
            <div>{{product.beginTime|getDateTimeString}} <span class="time_join">至</span>
                {{product.endTime|getDateTimeString}}
            </div>
        </div>
        <div class="cell">
            <label class="cell__caption">备注：</label>
            <div>{{product.remark}}</div>
        </div>
    </div>
</template>

<script>
    import {getDateTimeString, getDateString} from 'utils'
    import  perview from 'components/perview'
    export default {
        data(){
            return {}
        },
        props: {
            product: {
                type: Object,
                default: function () {
                    return null
                }
            }
        },
        computed: {},
        methods: {},
        mounted(){
        },
        components: {perview},
        filters: {getDateTimeString,getDateString}
    }
</script>