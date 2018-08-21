<style scoped>
    .content-box {
        width: 100%;
        height: 100%;
        background: #ffffff;
        display: flex;
        flex-direction: column;
    }

    .top {
        min-height: 65px;
        background: #eaedf1;
        border-top: 1px solid #bbbbbb;
        border-bottom: 1px solid #bbbbbb;
        font-size: 18px;
        color: #3bc1a6;
        line-height: 65px;
        padding-left: 50px;
        padding-right: 100px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        position: relative;
    }

    .search__result {
        width: 220px;
        margin-right: 20px;
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }
    .search__result--hasTitle{
        width: 280px;
    }
    .top__count{
        position: absolute;
        right: 20px;
        top: 0px;
        display: inline-block;
    }
</style>
<template>
    <div class="content-box">
        <div class="top">
            <div class="search__result search__result--hasTitle">
                <label>月份：</label>
                <el-date-picker size="medium" v-model="po.params.month" value-format="yyyy-M" type="month"
                                placeholder="选择月份" @change="dateChange"></el-date-picker>
            </div>
            <div class="search__result">
                <el-input class="search__result-input" v-model="po.params.name" size="medium" placeholder="输入姓名"></el-input>
            </div>
            <div>
                <el-button type="success" size="small" @click="getList">查询</el-button>
            </div>
            <span class="top__count">总金额：{{vo.count}}</span>
        </div>
        <DataGrid url="/product/score" :stripe="true" :params="po.params" ref="dg" size="mini" @data="dataChange">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column prop="_id.month" label="月份" align="center"></el-table-column>
            <el-table-column label="用户名" align="center">
                <template slot-scope="scope">
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column prop="score" label="服务费合计" align="center"></el-table-column>
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
                        month: null,
                        name: ''
                    }
                },
                vo: {
                    count: 0
                }
            }
        },
        computed: {},
        methods: {
            getList(){
                this.$refs.dg.reload()
            },
            dateChange(){
                this.$nextTick(this.getList)
            },
            dataChange(data){
                console.info(data)
                this.vo.count = data.count || 0
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