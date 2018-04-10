import Vue from 'vue';
import App from '../app.vue'
import vk from '../vk.js'
import uri from '../uri.js'
/**
 * auth true登录才能访问，false不需要登录，默认true
 */
export default [
    {
        path: '/',
        component: App,
        children: [
            {
                path: '/login', //登录
                meta: { auth: false },
                component: resolve => require(['../pages/login/index.vue'], resolve)
            },
            {
                path: '/signout', //退出
                component: resolve => require(['../pages/signout/index.vue'], resolve)
            },
            {
                path: '/home', //个人主页
                component: resolve => require(['../pages/home/index.vue'], resolve)
            },
            {
                path: '/', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/home/index.vue'], resolve)
            },
            {
                path: '/file_upload', //文件上传
                meta: { auth: true },
                component: resolve => require(['../pages/home/upload.vue'], resolve)
            },
            {
                path: '/category/index', //产品分类列表
                meta: { auth: true },
                component: resolve => require(['../pages/category/index.vue'], resolve)
            },
            {
                path: '/product/index', //产品列表
                meta: { auth: true },
                component: resolve => require(['../pages/product/index.vue'], resolve)
            },
            {
                path: '/fittings/index', //配件列表
                meta: { auth: true },
                component: resolve => require(['../pages/fittings/index.vue'], resolve)
            },
            {
                path: '/fittings/stock', //配件库存列表
                meta: { auth: true },
                component: resolve => require(['../pages/fittings/stock.vue'], resolve)
            },
            {
                path: '/series/index', //产品标签列表
                meta: { auth: true },
                component: resolve => require(['../pages/series/index.vue'], resolve)
            },
            {
                path: '/commodity/category/index', //商品分类列表
                meta: { auth: true },
                component: resolve => require(['../pages/commodity/category/index.vue'], resolve)
            },
            {
                path: '/commodity/index', //商品列表
                meta: { auth: true },
                component: resolve => require(['../pages/commodity/commodity/index.vue'], resolve)
            },
            {
                path: '/commodity/site/index', //站点列表
                meta: { auth: true },
                component: resolve => require(['../pages/commodity/site/index.vue'], resolve)
            },
            {
                path: '/product/template/index', //版图管理
                meta: { auth: true },
                component: resolve => require(['../pages/product_template/index.vue'], resolve)
            },
            {
                path: '/product/template/process-list', //选品列表
                meta: { auth: true },
                component: resolve => require(['../pages/product_template/process-list.vue'], resolve)
            },
            {
                path: '/product/template/factory-index', //开版列表
                meta: { auth: true },
                component: resolve => require(['../pages/product_template/factory-list.vue'], resolve)
            },
            {
                path: '/product/template/studio-index', //渲染列表
                meta: { auth: true },
                component: resolve => require(['../pages/product_template/studio-list.vue'], resolve)
            },
            {
                path: '/product/template/studio-price-list', //渲染费用
                meta: { auth: true },
                component: resolve => require(['../pages/product_template/studio-price-list.vue'], resolve)
            },
            {
                path: '/product/template/factory-price-list', //开版费用
                meta: { auth: true },
                component: resolve => require(['../pages/product_template/factory-price-list.vue'], resolve)
            },
			{

                path: '/produce/factory/index', //工厂管理
                meta: { auth: true },
                component: resolve => require(['../pages/factory/index.vue'], resolve)
            },
            {
                path: '/produce/factory_produce', //生产管理
                meta: { auth: true },
                component: resolve => require(['../pages/produce/index.vue'], resolve)
            },
            {
                path: '/produce/factory_produce_record', //生产记录
                meta: { auth: true },
                component: resolve => require(['../pages/produce/record.vue'], resolve)
            },
            {
                path: '/produce/factory_produce_report', //生产宝宝
                meta: { auth: true },
                component: resolve => require(['../pages/produce/report.vue'], resolve)
            },
            {
                path: '/produce/purchase', //采购管理
                meta: { auth: true },
                component: resolve => require(['../pages/purchase/index.vue'], resolve)
            },
            {
                path: '/stock/storehouseList', //仓库列表
                meta: { auth: true },
                component: resolve => require(['../pages/stock/storehouseList.vue'], resolve)
            },
            {
                path: '/stock/storehouseAreaRel', //仓库配置
                meta: { auth: true },
                component: resolve => require(['../pages/stock/storehouseAreaRel.vue'], resolve)
            },
            {
                path: '/stock/areaList', //国家地区管理
                meta: { auth: true },
                component: resolve => require(['../pages/stock/areaList.vue'], resolve)
            },
            {
                path: '/stock/index', //库存列表
                meta: { auth: true },
                component: resolve => require(['../pages/stock/index.vue'], resolve)
            },
            {
                path: '/stock/restockList', //补库存列表
                meta: { auth: true },
                component: resolve => require(['../pages/stock/restockList.vue'], resolve)
            },
            {
                path: '/stock/presellList', //预占库存列表
                meta: { auth: true },
                component: resolve => require(['../pages/stock/presellList.vue'], resolve)
            },
            {
                path: '/stock/logList', //库存日志
                meta: { auth: true },
                component: resolve => require(['../pages/stock/logList.vue'], resolve)
            },
            {
                path: '/stock/stockJxc', //进销存-库存管理
                meta: { auth: true },
                component: resolve => require(['../pages/stock/stockJxc.vue'], resolve)
            },
            {
                path: '/stock/stockJxcLogList', //进销存-日志管理
                meta: { auth: true },
                component: resolve => require(['../pages/stock/stockJxcLogList.vue'], resolve)
            },
            {
                path: '/stock/stockZero', //清仓产品库存为0
                meta: { auth: true },
                component: resolve => require(['../pages/stock/stockZero.vue'], resolve)
            },

            {
                path: '/shipment/eub', //EUB物流管理
                meta: { auth: true },
                component: resolve => require(['../pages/shipment/eub.vue'], resolve)
            },
            {
                path: '/template/email', //邮件模板
                meta: { auth: true },
                component: resolve => require(['../pages/template/email/index.vue'], resolve)
            },
            {
                path: '/template/email/log', //邮件模板日志
                meta: { auth: true },
                component: resolve => require(['../pages/template/email/log_index.vue'], resolve)
            },
            {
                path: '/sales/exportEmail', //导出用户邮箱
                meta: { auth: true },
                component: resolve => require(['../pages/sales/exportEmail.vue'], resolve)
            },
            {
                path: '/count/salesReport', //销量统计
                meta: { auth: true },
                component: resolve => require(['../pages/count/salesReport.vue'], resolve)
            },
            {
                path: '/system/menu', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/system/menu.vue'], resolve)
            },
            {
                path: '/system/role', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/system/role.vue'], resolve)
            },
            {
                path: '/system/power', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/system/power.vue'], resolve)
            },
            {
                path: '/system/user', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/system/user.vue'], resolve)
            },
            {
                path: '/system/categories', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/system/categories.vue'], resolve)
            },
            {
                path: '/system/cron', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/system/cron.vue'], resolve)
            },
            {
                path: '/order/list', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/list.vue'], resolve)
            },
            {
                path: '/order/list/approved', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/list-approved.vue'], resolve),
                props: {query:{approved:1}}
            },
            {
                path: '/order/list/distribution', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/list-distribution.vue'], resolve),
                props: {query:{distribution:1}}
            },
            {
                path: '/order/list/issue', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/list-issue.vue'], resolve),
                props: {query:{issue:1}}
            },
            {
                path: '/order/list/delivery', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/list-delivery.vue'], resolve),
                props: {query:{delivery:1}}
            },
            {
                path: '/order/create', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/create.vue'], resolve),
            },
            {
                path: '/order/refund/apply', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/refund-apply.vue'], resolve),
                props: {query:{type:'apply'}}
            },
            {
                path: '/order/refund/list', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/refund-list.vue'], resolve),
                props: {query:{type:'list'}}
            },
            {
                path: '/order/return/list', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/order-return.vue'], resolve),
                props: {query:{type:'list'}}
            },
            {
                path: '/order/return/shipment', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/order-return-shipment.vue'], resolve),
                props: {query:{type:'list'}}
            },
            {
                path: '/order/shipment/fail', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/shipment-fail.vue'], resolve),
                props: {query:{type:'list'}}
            },
            {
                path: '/emb/embzip', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/emb/embzip.vue'], resolve),
                props: {query:{issue:1}}
            },
            {
                path: '/emb/embunzip', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/emb/embunzip.vue'], resolve),
                props: {query:{issue:1}}
            },
            {
                path: '/emb/orderreturn', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/emb/orderreturn.vue'], resolve),
                props: {query:{issue:1}}
            },
            {
                path: '/supplies/index', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/supplies/index.vue'], resolve),
            },
            {
                path: '/defective', //首页
                meta: { auth: true },
                component: resolve => require(['../pages/order/list-item-defective.vue'], resolve),
            },
            {
                path: '*', //其他页面，强制跳转到登录页面
                redirect: '/login'
            },
        ]
    }
]