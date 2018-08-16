<template>
    <textarea ref="editor">
    </textarea>
</template>

<script>
    export default {
        props: {
            options: {
                type: Array,
                required: false
            },
            width: {
                type: [Number, String],
                default: '100%'
            },
            height: {
                type: [Number, String],
                default: 200
            },
            uploadPath: {
                type: String,
                default: ''
            },
            value: String,
            readonly: {
                type: Boolean,
                required: false
            },
            tools: {
                type: Array,
                default: function () {
                    return ['source', '|', 'undo', 'redo', '|', 'preview', 'template','plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
                        'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
                        'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', 'formatblock',
                        'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                        'strikethrough','lineheight', 'removeformat', '|', 'table', 'hr','emoticons',   'pagebreak','anchor', 'link', 'unlink']
                }
            }
        },
        data(){
            return {
                id: null,
                editor: null,
                elWidth: null,
                elHeight: null
            }
        },

        methods: {
            guid() {
                function S4() {
                    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                }
                return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
            },
            init(){
                this.id = this.guid()
                this.$refs.editor.id = this.id
                let self = this
                this.$nextTick(()=> {
                    self.editor = KindEditor.create('#' + self.id, {
                        width:self.getUnit(self.elWidth),
                        height: self.getUnit(self.elHeight) ,
                        minWidth: self.getUnit(self.elWidth),
                        minHeight: self.getUnit(self.elHeight),
                        allowFileManager: false,
                        filePostName: 'file',
                        uploadJson: self.uploadPath,
                        allowImageUpload: Boolean(self.uploadPath),
                        afterChange: function () {
                            self.$emit("input", this.html())
                        },
                        items: self.tools
                    });
                    if (!self.readonly) {
                        self.editor.readonly(self.readonly);
                    }
                    self.editor.html(self.value)
                })
            },
            remove(){
                this.elWidth = this.editor.width
                this.elHeight = this.editor.height
                KindEditor.remove('#' + this.id);
                this.editor.remove()
                this.editor=null
                this.id = null
            },
            getUnit(value){
                if(String(value).split('').pop()=="%"){
                    return value
                }else{
                    return Number.parseFloat(value) + 'px'
                }
            }
        },
        mounted(){
            this.elWidth = this.width
            this.elHeight = this.height

            this.init()
        },
        activated(){
            if (!this.id) {
                this.init()
            }
        },
        deactivated(){
            this.remove()
        },
        destroyed(){
            this.remove()
        },
        watch: {
            value: function (val) {
                if (this.editor && this.editor.html() != val) {
                    this.editor.html(val)
                }
            },
            readonly: function (val) {
                this.editor.readonly(val);
            }
        }
    }
</script>
