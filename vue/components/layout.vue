<template>
    <el-container :style="style()">
        <el-header style="height: 40px;">
            <v-headerTop></v-headerTop>
        </el-header>
        <el-container v-loading="pageLoadingFlag"
                      element-loading-text="Page Loading ..."
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-aside :style="getMenuStyleLeft()" class="menu-style-left" width="none">
                <v-leftMenu></v-leftMenu>
            </el-aside>
            <el-main :style="getMenuStyleRight()">
                <slot name="main"></slot>
            </el-main>
            <div class="sidle-border" @click="setMenuStyle" :style="getMenuStyleSidle()">
                <i class="el-icon-arrow-left"></i>
            </div>
        </el-container>
    </el-container>
</template>
<script>
    import vk from '../vk.js'
    import uri from '../uri.js'
    import { mapState,mapActions } from 'vuex'
    import { SET } from '../store/data.js'
    var App= {
        beforeDestroy(){
            console.log('baseApp,beforeDestroy');
            this.pageLoadingFlag=true;
        },
        updated(){
            console.log('baseApp,updated');
            let that = this;
            setTimeout(function(){
                that.pageLoadingFlag=false
            },300)
        },
        data () {
            return {
                pageLoadingFlag:true,
            };
        },
        computed: mapState({
            lang:state => state.data.lang||"zh",
            MenuStyle:state => state.data.MenuStyle||false,
        }),
        mounted(){
//            this.pageLoadingFlag=false;
        },
        methods: {
            ...mapActions([SET]),
            style:function(){
                return 'height:'+vk.height()+'px;';
            },
            getMenuStyleLeft(){
                if(this.MenuStyle){
                    vk.ls(uri.CACHEKEY.OPENMENUS,[]);
                }
                return this.MenuStyle?
                    {
                        position:'absolute',
                        height:vk.height(50)+'px',
                        'z-index': 0,
                    }:{
                        width:'200px',
                        position:'relative',
                        'z-index': 0,
                    };
            },
            getMenuStyleRight(){
                return this.MenuStyle?
                    {
                        'margin-left':'50px'
                    }:{
                        'margin-left':'0px'
                    };
            },
            getMenuStyleSidle(){
                return this.MenuStyle?
                    {
                        display:'none'
                    }:{
                        display:'block'
                    };
            },
            setMenuStyle(){
                this.SET({MenuStyle:!this.MenuStyle});
            } ,
        },
    }
    export default App
</script>