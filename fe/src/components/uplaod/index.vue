<style scoped>
    .content__input-upload {
        display: inline-block;
        margin: 0;
    }

    .upload-warp {
        position: relative;
        background: #FFFFFF;
        overflow: hidden;
        border: 1px solid #D2D6D9;
        border-radius: 3px;
    }

    .upload__button {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 2;
        cursor: pointer;
    }

    .upload__button[disabled] {
        cursor: not-allowed;
    }

    .upload__logo {
        width: 100%;
        height: 100%;
        background: url("./assets/logo_upload.png") no-repeat center center;
        background-size: 20px 20px;
    }

    .upload__button--hasImg .upload__logo {
        display: none;
    }

    .upload__button--hasImg:hover {
        background: rgba(0, 0, 0, 0.5);
    }

    .upload__button--hasImg:hover .upload__logo {
        display: block;
    }

    .upload__file {
        width: 100%;
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 3;
        opacity: 0;
        cursor: pointer;
    }

    .upload__file[disabled] {
        cursor: not-allowed;
    }

    .upload__preview {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }

    .upload__preview img {
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        margin: -1px;
    }

    .upload__text {
        text-align: center;
        font-size: 12px;
        line-height: 30px;
        cursor: pointer;
    }

    .preview-box {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 10;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .preview-box img {
        max-height: 100%;
    }
</style>
<template>
    <div class="content__input-upload">
        <div class="upload-warp" :style="style">
            <div class="upload__preview"><img :src="po.url" alt=""></div>
            <div class="upload__button" :class="{'upload__button--hasImg':po.url}" :disabled="disabled">
                <div class="upload__logo"></div>
                <input v-if="!vo.reset" type="file" class="upload__file" :accept="accept" :disabled="disabled"
                       @change="_selectFile($event)">
            </div>
        </div>

        <el-tooltip effect="dark" content="点击查看预览" placement="bottom" :disabled="!po.url" class="upload__text">
            <h5 @click="_showPreview">
                <slot></slot>
            </h5>
        </el-tooltip>
        <div class="preview-box" v-if="vo.showPreview" @click="vo.showPreview=false">
            <img :src="po.url" alt="" @click.stop>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                po: {
                    url: null
                },
                vo: {
                    showAvatar: false,
                    showPreview: false,
                    reset: false
                }
            }
        },
        computed: {
            style(){
                let w = Number.parseInt(this.width) || 200
                let h = Number.parseInt(this.height) || 200
                return {
                    width: w + 'px',
                    height: h + 'px'
                }
            }
        },
        props: {
            width: {
                type: [String, Number],
                default: 200
            },
            height: {
                type: [String, Number],
                default: 200
            },
            name: String,
            accept: String,
            disabled: {
                type: Boolean,
                default: false
            },
            url: String
        },
        methods: {
            _showPreview(){
                if (this.po.url) {
                    this.vo.showPreview = true
                }
            },
            _selectFile(e){
                let file = null
                if (e.target.files.length > 0) {
                    file = e.target.files[0]
                    let reader = new FileReader()
                    reader.readAsDataURL(file)
                    let _this = this
                    reader.onload = function (event) {
                        _this.po.url = this.result;
                    }
                }
//                this.$emit('success', file, this.name)
            },
            reset(){
                this.vo.reset = true
                this.po.url = ''
                this.$nextTick(()=> {
                    this.vo.reset = false
                })
            }
        },
        mounted(){

        },
        components: {},
        filters: {},
        watch: {
            'url': {
                handler: function (val, oldVal) {
                    if (val === oldVal) {
                        return
                    }
                    if (val && typeof val == "string") {
                        this.po.url = val
                    }
                },
                immediate: true
            }
        }
    }
</script>