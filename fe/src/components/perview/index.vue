<style scoped>
    .preview {
        cursor: pointer;
    }

    .preview__dialog {
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

    .preview__dialog img {
        max-height: 98%;
        max-width: 100%;
    }

</style>
<template>
    <div class="preview">
        <div @click="showPreview">
            <slot></slot>
        </div>
        <slot name="text"></slot>
        <div class="preview__dialog" v-if="show" @click="show=false">
            <img :src="src" alt="" @click.stop>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                show: false,
                src: ''
            }
        },
        computed: {},
        methods: {
            showPreview(){
                this.src = this.$el.querySelector("img").getAttribute("src")
                this.show = true
            }
        },
        mounted(){
        },
        components: {},
        filters: {}
    }
</script>