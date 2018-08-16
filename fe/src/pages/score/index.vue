<style scoped>
    .content-box {
        width: 100%;
        height: 100%;
        background: #ffffff;
        display: flex;
        flex-direction: column;
    }

    .top {
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

    .search__result {
        width: 300px;
    }

    .form__img-box {
        margin-right: 20px;
        float: left;
    }

    .form__img-box img {
        max-width: 120px;
        max-height: 120px;
    }

    .form__img-title {
        font-size: 12px;
        text-align: center;
        color: blue;
    }

    .cell {
        display: flex;
        justify-content: flex-start;
        padding-left: 30px;
    }

    .cell__caption {
        width: 80px;
        flex-shrink: 0;
        font-size: 14px;
    }

    .product__button {
        width: 80px;
        text-align: center;
        line-height: 24px;
        border: 1px solid #3bc1a6;
        border-radius: 24px;
        background: transparent;
        margin: 5px 0;
    }

    .time_join {
        width: 20px;
        text-align: center;
        display: inline-block
    }

</style>
<template>
    <div class="content-box">
        <div class="top">
            <label>选择月份：</label>
            <div class="search__result">
                <el-date-picker v-model="po.params.month" value-format="yyyy-M" type="month" placeholder="选择月"></el-date-picker>
            </div>
            <div>
                <el-button type="success" size="small" @click="getList">查询</el-button>
            </div>
        </div>
        <DataGrid url="/product/score" :stripe="true" :params="po.params" ref="dg" size="mini">
            <el-table-column prop="_id.month" label="月份" align="center"></el-table-column>
            <el-table-column label="用户名" align="center">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column prop="score" label="服务费合计" header-align="center" align="right"></el-table-column>
        </DataGrid>
    </div>
</template>

<script>
    import {getDateTimeString, getDateString} from 'utils'
    import  perview from 'components/perview'
    export default {
        data(){
            return {
                po: {
                    params: {
                        month: null
                    }
                },
                vo: {}
            }
        },
        computed: {},
        methods: {
            getList(){
                this.$refs.dg.reload()
            }
        },
        mounted(){
        },
        components: {
            perview
        },
        filters: {
            getDateString,
            getDateTimeString
        },
        watch: {}
    }
</script>