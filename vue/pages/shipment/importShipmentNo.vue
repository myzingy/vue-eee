<template>
    <v-layout>
        <div slot="main">

            <el-upload
                    class="upload-demo"
                    :action="uri"
                    :show-file-list="false"
                    name="file"
            >
                <el-button size="small"  type="primary" v-if="$router.power('/shipment/doImportShipmentNo')">
                    {{$t('导入物流')}}</el-button>

            </el-upload>
            <el-button @click="downloadImportFileExample()">{{$t('下载物流模板')}}</el-button>
        </div>
    </v-layout>
</template>
<script>
    import Vue from 'vue'
    import vk from '../../vk.js'
    import uri from '../../uri.js'

    import i18n from '../../local'
    var App= {
        data() {
            return {
                uri:'/api/'+uri.importShipmentNo.act,
            }
        },

        methods: {
            downloadImportFileExample(){
                window.open('/download/importShipment/importShipmentNoExample.csv');
            },
        }
    }
    export default {i18n,...App}
</script>