<style scoped>
    .box {
        padding: 20px;
    }

    .form {
        width: 700px;
    }

    .form .img {
        width: 200px;
    }
</style>
<template>
    <div class="box">
        <el-form ref="form" :model="po" :rules="rules" label-width="80px" class="form" size="mini">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="po.name"></el-input>
            </el-form-item>

            <el-form-item label="图片类型">
                <el-radio-group v-model="po.imgType">
                    <el-radio :label="0">上传图片</el-radio>
                    <el-radio :label="1">图片外链</el-radio>
                </el-radio-group>
            </el-form-item>


            <el-form-item label="上传图片" v-if="po.imgType==0">
                <jf-upload class="img" :url="po.img" ref="upload">
                    <span>查看大图</span>
                </jf-upload>
            </el-form-item>

            <el-form-item label="图片外链" v-show="po.imgType==1" prop="img">
                <el-input v-model="po.img" clearable></el-input>
            </el-form-item>

            <el-form-item label="原价" prop="costPrice">
                <el-input v-model="po.costPrice" clearable></el-input>
            </el-form-item>

            <el-form-item label="券后价" prop="price">
                <el-input v-model="po.price" clearable></el-input>
            </el-form-item>

            <el-form-item label="佣金" prop="commission">
                <el-input v-model="po.commission" clearable></el-input>
            </el-form-item>

            <el-form-item label="券链接" prop="voucherLink">
                <el-input v-model="po.voucherLink" clearable></el-input>
            </el-form-item>

            <el-form-item label="券截图" prop="voucherLink">
                <jf-upload :url="po.voucherImage" ref="voucherImageUpload" width="620" height="160">
                    <span>查看大图</span>
                </jf-upload>
            </el-form-item>


            <el-form-item label="下单链接" prop="orderLink">
                <el-input v-model="po.orderLink" clearable></el-input>
            </el-form-item>

            <el-form-item label="商品描述" prop="desc">
                <el-input type="textarea" v-model="po.desc"></el-input>
            </el-form-item>

            <el-form-item label="服务费用" prop="serviceCharge">
                <el-input v-model="po.serviceCharge"></el-input>
            </el-form-item>

            <el-form-item label="商家QQ" prop="qq">
                <el-input v-model="po.qq" maxlength="15"></el-input>
            </el-form-item>

            <el-form-item label="商家电话" prop="phone">
                <el-input v-model="po.phone" maxlength="11"></el-input>
            </el-form-item>

            <el-form-item label="商家微信">
                <el-input v-model="po.wx" maxlength="25"></el-input>
            </el-form-item>


            <el-form-item label="活动时间" prop="time">
                <el-date-picker type="datetime" placeholder="开始日期" value-format="timestamp"
                                v-model="po.beginTime"></el-date-picker>
                <span>——</span>
                <el-date-picker type="datetime" placeholder="结束时间" value-format="timestamp"
                                v-model="po.endTime" default-time="23:59:59"></el-date-picker>
            </el-form-item>

            <el-form-item label="备注">
                <el-input type="textarea" v-model="po.remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="cancel">{{vo.mode=='add'?"重置":'返回'}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data(){
            const urlReg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/
            const checkTime = (rule, value, callback) => {
                if (!this.po.beginTime && !this.po.endTime) {
                    return callback(new Error('请选择活动时间'));
                }
                if (!this.po.beginTime) {
                    return callback(new Error('请选择活动开始时间'));
                }
                if (!this.po.endTime) {
                    return callback(new Error('请选择活动结束时间'));
                }
                if (this.po.endTime < this.po.beginTime) {
                    return callback(new Error('开始时间不能大于结束时间'));
                }
                callback();
            };

            const checkImg = (rule, value, callback) => {
                if (this.po.imgType == 1) {
                    if (!this.po.img) {
                        return callback(new Error('请输入图片外链'));
                    }
                    if (!urlReg.test(this.po.img)) {
                        return callback(new Error('图片链格式不正确'));
                    }
                }
                callback();
            };
            const checkQQ = (rule, value, callback) => {
                if (!/^[1-9]\d{4,14}$/.test(value)) {
                    return callback(new Error('QQ号码格式不正确'));
                }
                callback();
            };
            const checkPhone = (rule, value, callback) => {
                if (value && !/^[1]\d{10}$/.test(value)) {
                    return callback(new Error('手机号码格式不正确'));
                }
                callback();
            };


            return {
                po: {
                    name: '', //名称
                    img: '',//图片
                    imgType: 0,//图片类型 0本地图片 1链接
                    costPrice: null,//原价
                    price: null,//券后价
                    commission: null,//佣金
                    voucherLink: '',//券链接
                    voucherImage: '',//券截图
                    orderLink: '',//下单链接
                    desc: '',//商品文案
                    serviceCharge: null,//服务费
                    qq: '',
                    phone: '',//电话
                    wx: '',//微信
                    beginTime: null,//开始时间
                    endTime: null,//结束时间
                    remark: '',//备注
                },
                poClone: null,
                vo: {
                    mode: 'add',
                    scrollEl: null
                },

                rules: {
                    name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                        {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
                    ],
                    img: [
                        {validator: checkImg, required: true, trigger: 'blur'},
                    ],
                    costPrice: [
                        {required: true, message: '请输入商品原价', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '请输入商品券后价', trigger: 'blur'}
                    ],
                    commission: [
                        {required: true, message: '请输入商品券佣金', trigger: 'blur'}
                    ],
                    voucherLink: [
                        {required: true, message: '请输入券链接', trigger: 'blur'},
                        {type: 'url', message: '券链接格式不正确', trigger: 'blur'}
                    ],
                    orderLink: [
                        {required: true, message: '请输入下单链接', trigger: 'blur'},
                        {type: 'url', message: '下单链接格式不正确', trigger: 'blur'}
                    ],
                    desc: [
                        {required: true, message: '请填写商品文案', trigger: 'blur'}
                    ],
                    serviceCharge: [
                        {required: true, message: '请填写服务费', trigger: 'blur'}
                    ],
                    qq: [
                        {required: true, message: '请填写QQ', trigger: 'blur'},
                        {validator: checkQQ, trigger: 'blur'},
                    ],
                    phone: [
                        {validator: checkPhone, trigger: 'blur'},
                    ],
                    time: [
                        {validator: checkTime, required: true, trigger: 'change'}
                    ]
                }
            }
        },
        computed: {},
        methods: {
            numberFilter(val, oldVal, field){
                if (val == oldVal) {
                    return
                }
                let newVal = (val + '')

                if (newVal.length > 1) {//.字符不能在首位
                    newVal = newVal.replace(/[^\d.]/g, '')
                } else {
                    newVal = newVal.replace(/[^\d]/g, '')
                }
                let dotIndex = newVal.indexOf('.') //小数点的位置

                if (dotIndex > -1 && newVal.lastIndexOf('.') != dotIndex) {//去除多余的点
                    newVal = newVal.slice(0, dotIndex + 1) + newVal.slice(dotIndex + 1).replace(/\./g, '')
                }

                if (newVal.indexOf("0") == 0 && dotIndex !== 1 && newVal.length > 1) {//禁止连续输入多个0
                    newVal = newVal.slice(1)
                }

                if (dotIndex > 0 && newVal.length > dotIndex + 3) { //限制输入2位小数
                    newVal = newVal.slice(0, dotIndex + 3)
                }
                let sliceLength = 9//整数位限制输入9位
                if (dotIndex > 0) {
                    sliceLength = 12
                }
                if (newVal.length > sliceLength) {
                    newVal = newVal.slice(0, sliceLength)  //限制输入9位
                }
                this.$nextTick(()=> {
                    this.$set(this.po, field, newVal)
                })
            },
            toErrorEl(prop){
                if (this.vo.scrollEl) {
                    let errEl = this.$el.querySelector(`label[for=${prop}]`)
                    if (errEl) {
                        this.vo.scrollEl.scrollTop = errEl.scrollTop
                    }
                }
            },
            save(){
                this.$refs.form.validate((reslut, error)=> {
                    if (!reslut) {
                        this.toErrorEl(Object.keys(error)[0])
                        return
                    }

                    let fd = new FormData()
                    if (this.po.id) {
                        fd.append("id", this.po.id)
                    }

                    if (this.po.imgType == 0) {
                        let fileInput = this.$refs.upload.$el.querySelector('input[type=file]')
                        if (fileInput && fileInput.files.length) {
                            fd.append("img", fileInput.files[0])
                        } else if (!this.po.id) {
                            return this.$message.error("请选择商品图片")
                        }
                    } else {
                        fd.append("img", this.po.img)
                    }

                    if (!fd.has("img") && !this.po.img.trim()) {
                        return this.$message.error("请选择商品图片")
                    }


                    let voucherImageFiles = this.$refs.voucherImageUpload.$el.querySelector('input[type=file]').files
                    if (voucherImageFiles && voucherImageFiles.length) {
                        fd.append("voucherImage", voucherImageFiles[0])
                    } else if (!this.po.id || (this.po.id && !this.po.voucherImage)) {
                        return this.$message.error("请选择商品券截图")
                    }

                    Object.keys(this.po).forEach(key=> {
                        if (!fd.has(key)) {
                            fd.append(key, this.po[key])
                        }
                    })


                    this.$post("/product/edit", fd).then(data=> {
                        if (this.po.id) {
                            this.$message("修改成功")
                            this.$router.back()
                        } else {
                            this.$message("添加成功")
                            this.reset()
                        }
                    }).catch(err=> {
                        this.$alert(err.message, {type: 'error'})
                    })
                })
            },
            getInfo() {
                if (this.$route.params.id) {
                    let str = window.sessionStorage.getItem("productInfo")
                    try {
                        let info = JSON.parse(str)
                        if (info._id == this.$route.params.id) {
                            this.vo.mode = 'edit'
                            Object.keys(this.po).forEach(key=> {
                                if (key !== "img") {
                                    if (!(!info[key] && info[key] !== 0)) {
                                        this.po[key] = info[key]
                                    }
                                } else {
                                    this.po[key] = info.img[0]
                                }
                            })
                            this.$set(this.po, "id", info._id)
                        }
                    } catch (e) {
                        this.$router.back()
                    }
                }
            },
            reset() {
                this.$refs.form.resetFields()
                if (this.$refs.upload) {
                    this.$refs.upload.reset()
                }
                this.$refs.voucherImageUpload.reset()
                this.po = JSON.parse(JSON.stringify(this.poClone))
            },
            cancel() {
                if (this.$route.params.id) {
                    this.$router.back()
                } else {
                    this.reset()
                }

            }
        },
        mounted() {
            this.poClone = JSON.parse(JSON.stringify(this.po))
            this.getInfo()
            this.vo.scrollEl = getScrollElement(this.$el)
        },
        components: {},
        filters: {},
        watch: {
            'po.costPrice': function (val, oldVal) {
                this.numberFilter(val, oldVal, 'costPrice')
            },
            'po.price': function (val, oldVal) {
                this.numberFilter(val, oldVal, 'price')
            },
            'po.serviceCharge': function (val, oldVal) {
                this.numberFilter(val, oldVal, 'serviceCharge')
            },
            'po.commission': function (val, oldVal) {
                this.numberFilter(val, oldVal, 'commission')
            },
            '$route': function () {
                this.vo.mode = 'add'
                this.reset()
            }
        }
    }

    function getScrollElement(el) {
        var coordinate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'y';

        coordinate = coordinate.toUpperCase();
        var parent = el.parentNode;
        var attr = 'overflow' + coordinate;
        var value = void 0;
        while (parent.tagName !== 'HTML' && parent.tagName !== 'body' && parent.nodeType === 1) {
            value = getStyle(parent, attr);
            if (value === 'auto' || value === 'scroll') {
                return parent;
            }
            parent = parent.parentNode;
        }
        return window;

        function getStyle(el, attr) {
            return window.getComputedStyle(el, null)[attr];
        }
    }
</script>