<style scoped lang="less">

</style>
<template>
    <layOut v-cloak>
        <div slot="page-title" class="page-title" :style="{color:'#343436',fontSize:'18px',marginBottom:'15px'}">
            首页
        </div>
        <div slot="content">4444</div>
    </layOut>
</template>
<script>
    // import Utils from './../utils/index.js'
    // import {mapState,mapMutations} from 'vuex'
    import layOut from './../components/Layout.vue'

    export default {
        name: "index",
        mounted() {
            
        },
        computed:{
            // ...mapState(['author','age']) 
        },
        data() {
            return {
                
            };
        },
        methods: {
            // ...mapMutations(['changeAge'])
        },
        components:{
            layOut
        }
    };
</script>
