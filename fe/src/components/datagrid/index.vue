<style scoped>
    .dg__warp {
        background-color: #FFFFFF;
        padding-bottom: 8px;
    }

    .jf-pagintion {
        background: #FFFFFF;
        margin-top: 3px;
    }
</style>
<style>
    body .jf-pagintion .el-input__inner {
        height: 28px;
    }

    body .jf-pagintion .el-input__suffix {

    }
</style>
<template>
    <div class="dg__warp" v-loading.lock="vo.loading">
        <el-table :data="vo.data" :border="border" :stripe="stripe" :fit="fit" :height="vo.height" :size="size"
                  element-loading-text="拼命加载中" :row-style="rowStyleClone" :row-class-name="rowClassClone"
                  ref="table" @sort-change="sort">
            <slot></slot>
        </el-table>
        <el-pagination class="jf-pagintion" background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="vo.currentPage"
                       :page-sizes="[10, 20, 30,50,100,200]"
                       :page-size="vo.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="vo.total">
        </el-pagination>
    </div>
</template>
<script>
    let dgList = []
    window.addEventListener("resize", function () {
        for (let dg of dgList) {
            dg.resize()
        }
    })
    export default {
        data: function () {
            return {
                po: {
                    sort: null,
                    order: null
                },
                vo: {
                    loading: false,
                    currentPage: 1,
                    pageSize: 20,
                    total: 0,
                    data: [],
                    timer: null,
                    height: 100
                }
            }
        },
        props: {
            params: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            url: String,
            method: {
                type: String,
                default: "GET"
            },
            border: {
                type: Boolean,
                default: true
            },
            stripe: {
                type: Boolean,
                default: false
            },
            fit: {
                type: Boolean,
                default: true
            },
            size: String,
            firstLoad: {
                type: Boolean,
                default: true
            },
            'row-style': {
                type: [Object, Function],
                default: function () {
                    return null
                }
            },
            'row-class-name': {
                type: [Object, Function],
                default: function () {
                    return null
                }
            },
        },
        computed: {},
        methods: {
            rowStyleClone(){
                if (this.rowStyle) {
                    let type = typeof this.rowStyle
                    if (type == "function") {
                        return this.rowStyle(...arguments)
                    } else if (type == "object") {
                        return this.rowStyle
                    }
                    return null
                }
                return null

            },
            rowClassClone(){
                if (this.rowClassName) {
                    let type = typeof this.rowClassName
                    if (type == "function") {
                        return this.rowClassName(...arguments)
                    } else if (type == "object") {
                        return this.rowClassName
                    }
                    return null
                }
                return null
            },
            handleSizeChange(val) {
                this.vo.pageSize = val
                this.loadData()
            },
            handleCurrentChange(val) {
                this.vo.currentPage = val
                this.loadData()
            },
            loadData(){
                let params = Object.assign({}, this.po, JSON.parse(JSON.stringify(this.params)), {
                    "page": this.vo.currentPage,
                    "rows": this.vo.pageSize
                })
                this.vo.loading = true;

                window.clearTimeout(this.vo.timer)
                this.vo.timer = setTimeout(() => {
                    if (this.vo.loading) {
                        this.vo.loading = false
                        this.$message({
                            type: 'error',
                            message: '服务器响应超时',
                            duration: 2000,
                            showClose: true
                        })
                    }
                }, 10000)

                let requset = null
                if (this.method == "GET") {
                    requset = this.$get(this.url, params)
                } else {
                    requset = this.$post(this.url, params)
                }

                requset.then(data => {
                    this.vo.loading = false
                    this.vo.data = data.rows
                    this.vo.total = data.total
                    this.$emit("data", data)
                }).catch(err => {
                    this.vo.loading = false
                    this.$alert({
                        type: 'error',
                        message: err.message,
                        duration: 0,
                        showClose: true
                    })
                })
            },

            sort({column, prop, order}){
                if (prop) {
                    if (!order) {
                        this.po = {
                            sort: null,
                            order: null
                        }
                    } else if (order == "ascending") {
                        this.po = {
                            sort: prop,
                            order: 1
                        }
                    } else if (order == "descending") {
                        this.po = {
                            sort: prop,
                            order: -1
                        }
                    }
                }
                this.loadData()
            },
            reset(){
                this.vo.currentPage = 1
            },
            reload(){
                this.loadData()
            },
            resize(){
                let top = document.documentElement.scrollTop
                let h = this.$el.getBoundingClientRect().top
                let parentElement = this.$el.parentElement
                if (parentElement) {
                    let ph = parentElement.getBoundingClientRect().top
                    this.vo.height = parentElement.clientHeight - (h - ph ) - 50
                }
                this.$refs.table.doLayout()
            },
            _bindEvent(){
                let self = this
                const evevtArray = ['select', 'select-all', 'selection-change', 'cell-mouse-enter', 'cell-mouse-leave',
                    'cell-click', 'cell-dblclick', 'row-click', 'row-contextmenu', 'row-dblclick', 'header-click',
                    'header-contextmenu', 'sort-change', 'filter-change', 'current-change', 'header-dragend', 'expand-change	']
                evevtArray.forEach(event=> {
                    this.$refs.table.$on(event, function () {
                        self.$emit(event, ...arguments)
                    })
                })

            }
        },
        mounted: function () {
            dgList.push(this)
            this._bindEvent()
            if (this.firstLoad) {
                this.loadData()
            }
            this.$nextTick(() => {
                this.resize()
            })
        },
        destroyed(){
            for (let i = 0; i < dgList.length; i++) {
                if (dgList[i] == this) {
                    dgList.splice(i, 1)
                }
            }
        },
        filters: {}
    }

</script>