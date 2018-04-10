let menu=function(i18n){
    return {
        '/system': {
            label: i18n.t('系统管理'),
            icon: 'el-icon-setting',
            children: {
                '/system/role': {
                    label: i18n.t('部门管理'),
                    icon: 'el-icon-document',
                },
                '/system/power': {
                    label: i18n.t('权限管理'),
                    icon: 'el-icon-document',
                },
                '/system/user': {
                    label: i18n.t('用户管理'),
                    icon: 'el-icon-document',
                },
                '/system/categories': {
                    label: i18n.t('类别管理'),
                    icon: 'el-icon-document',
                },
                '/template/email': {
                    label: i18n.t('邮件模板'),
                    icon: 'el-icon-document',
                },
                '/template/email/log': {
                    label: i18n.t('邮件日志'),
                    icon: 'el-icon-document',
                },
                '/system/cron': {
                    label: i18n.t('任务监控'),
                    icon: 'el-icon-document',
                },
            },
        },
        '/order': {
            label: i18n.t('订单管理'),
            icon: 'el-icon-news',
            children: {
                '/order/list': {
                    label: i18n.t('订单列表'),
                    icon: 'el-icon-document',
                },
                '/order/list/approved': {
                    label: i18n.t('订单审核'),
                    icon: 'el-icon-document',
                },
                '/order/list/issue': {
                    label: i18n.t('联系客户'),
                    icon: 'el-icon-document',
                },
                '/order/list/distribution': {
                    label: i18n.t('配货管理'),
                    icon: 'el-icon-document',
                },
                // '/order/list/delivery': {
                //     label: i18n.t('打印面单-发货'),
                //     icon: 'el-icon-document',
                // },
                '/order/create': {
                    label: i18n.t('创建订单'),
                    icon: 'el-icon-document',
                },
                '/order/refund/apply': {
                    label: i18n.t('退款审核'),
                    icon: 'el-icon-document',
                },
                '/order/refund/list': {
                    label: i18n.t('退款管理'),
                    icon: 'el-icon-document',
                },
                '/order/return/list': {
                    label: i18n.t('退换货物流管理'),
                    icon: 'el-icon-document',
                },
                '/defective': {
                    label: i18n.t('次品管理'),
                    icon: 'el-icon-document',
                },
                '/order/shipment/fail': {
                    label: i18n.t('打单错误日志'),
                    icon: 'el-icon-document',
                },
            },
        },
        '/product': {
            label: i18n.t('product_management'),
            icon: 'el-icon-star-on',
            children: {
                '/category/index': {
                    label: i18n.t('category_management'),
                    icon: 'el-icon-document',
                },
                '/product/index': {
                    label: i18n.t('product_management'),
                    icon: 'el-icon-document',
                },
                '/fittings/index': {
                    label: i18n.t('fittings_management'),
                    icon: 'el-icon-document',
                },
                '/series/index': {
                    label: i18n.t('pdt_series_management'),
                    icon: 'el-icon-document',
                },
                '/supplies/index': {
                    label: i18n.t('耗材管理'),
                    icon: 'el-icon-document',
                },
            },
        },
        '/commodity': {
            label: i18n.t('commodity_management'),
            icon: 'el-icon-goods',
            children: {
                '/commodity/category/index': {
                    label: i18n.t('category_management'),
                    icon: 'el-icon-document',
                },
                '/commodity/index': {
                    label: i18n.t('commodity_management'),
                    icon: 'el-icon-document',
                },
                '/commodity/site/index': {
                    label: i18n.t('site_management'),
                    icon: 'el-icon-document',
                },
            },
        },
        '/product/template': {
            label: i18n.t('pdt_template_management'),
            icon: 'el-icon-picture',
            children: {
                '/product/template/index': {
                    label: i18n.t('pdt_template_management'),
                    icon: 'el-icon-document',
                },
                '/product/template/process-list': {
                    label: i18n.t('pdt_template_process'),
                    icon: 'el-icon-document',
                },
                '/product/template/factory-index': {
                    label: i18n.t('pdt_template_factory'),
                    icon: 'el-icon-document',
                },
                '/product/template/studio-index': {
                    label: i18n.t('pdt_template_studio'),
                    icon: 'el-icon-document',
                },
                '/product/template/studio-price-list': {
                    label: i18n.t('pdt_template_studio_price'),
                    icon: 'el-icon-document',
                },
                '/product/template/factory-price-list': {
                    label: i18n.t('pdt_template_factory_price'),
                    icon: 'el-icon-document',
                },
            },
        },
        '/produce': {
            label: i18n.t('produce'),
            icon: 'el-icon-sort',
            children: {
                '/produce/factory/index': {
                    label: i18n.t('produce_factory_list'),
                    icon: 'el-icon-document',
                },
                '/produce/factory_produce': {
                    label: i18n.t('produce_factory_produce'),
                    icon: 'el-icon-document',
                },
                '/produce/factory_produce_record': {
                    label: i18n.t('produce_factory_produce_record'),
                    icon: 'el-icon-document',
                },
                '/produce/factory_produce_report': {
                    label: i18n.t('produce_factory_produce_report'),
                    icon: 'el-icon-document',
                },
                '/fittings/stock': {
                    label: i18n.t('fittings_stock'),
                    icon: 'el-icon-document',
                },
                '/produce/purchase': {
                    label: i18n.t('produce_purchase'),
                    icon: 'el-icon-document',
                },
            },
        },

        '/storehouse': {
            label: i18n.t('仓库管理'),
            icon: 'el-icon-location-outline',
            children: {
                '/stock/storehouseList': {
                    label: i18n.t('仓库管理'),
                    icon: 'el-icon-document',
                },
                '/stock/storehouseAreaRel': {
                    label: i18n.t('仓库物流配置'),
                    icon: 'el-icon-document',
                },
                '/stock/areaList': {
                    label: i18n.t('国家地区管理'),
                    icon: 'el-icon-document',
                },
            },
        },

        '/stock': {
            label: i18n.t('库存管理'),
            icon: 'el-icon-location',
            children: {
                '/stock/index': {
                    label: i18n.t('库存管理'),
                    icon: 'el-icon-document',
                },
                '/stock/restockList': {
                    label: i18n.t('补库存管理'),
                    icon: 'el-icon-document',
                },
                '/stock/presellList': {
                    label: i18n.t('库存预占管理'),
                    icon: 'el-icon-document',
                },
                '/stock/logList': {
                    label: i18n.t('库存日志'),
                    icon: 'el-icon-document',
                },
                '/stock/stockZero': {
                    label: i18n.t('清仓产品库存为0'),
                    icon: 'el-icon-document',
                },
            },
        },

        '/stock_jxc': {
            label: i18n.t('进销存管理'),
            icon: 'el-icon-date',
            children: {
                '/stock/stockJxc': {
                    label: i18n.t('进销存库存'),
                    icon: 'el-icon-document',
                },
                '/stock/stockJxcLogList': {
                    label: i18n.t('进销存日志'),
                    icon: 'el-icon-document',
                },
            },
        },
        '/emb': {
            label: i18n.t('海外仓管理'),
            icon: 'el-icon-rank',
            children: {
                '/emb/embzip': {
                    label: i18n.t('转运打包'),
                    icon: 'el-icon-document',
                },
                '/emb/embunzip': {
                    label: i18n.t('转运拆包'),
                    icon: 'el-icon-document',
                },
                '/order/return/shipment': {
                    label: i18n.t('退货单号管理'),
                    icon: 'el-icon-document',
                },
                '/emb/orderreturn': {
                    label: i18n.t('原件退回列表'),
                    icon: 'el-icon-document',
                },
            },
        },
        '/shipment': {
            label: i18n.t('物流管理'),
            icon: 'el-icon-upload',
            children: {
                '/shipment/eub': {
                    label: i18n.t('EUB物流管理'),
                    icon: 'el-icon-document',
                },
            },
        },

        '/sales': {
            label: i18n.t('营销管理'),
            icon: 'el-icon-location-outline',
            children: {
                '/sales/exportEmail': {
                    label: i18n.t('导出用户邮箱'),
                    icon: 'el-icon-document',
                },
            },
        },

        '/count': {
            label: i18n.t('统计管理'),
            icon: 'el-icon-location-outline',
            children: {
                '/count/salesReport': {
                    label: i18n.t('销量统计'),
                    icon: 'el-icon-document',
                },
            },
        },
    }
}
export default menu;