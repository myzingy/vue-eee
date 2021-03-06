export default {
    //user
    login:{act:'login',code:10000},
    upload:{act:'user.FileUpload-upload',code:10001},
    getConf:{act:'user.user-Lib-conf',code:11000,timeout:86400},
    getFile:{act:'user.FileUpload-getFiles',code:10002},
    removeFile:{act:'user.FileUpload-remove',code:1003},

    //category
    categoryCreate:{act:'user.category-ProductCategory-create',code:30002},
    categoryUpdate:{act:'user.category-ProductCategory-edit',code:30003},
    categoryDelete:{act:'user.category-ProductCategory-del',code:30004},
    categoryTree:{act:'user.category-ProductCategory-getTree',code:30005,timeout:86400},
    //product
    productList:{act:'user.product-Product-getLists',code:31002},
    productInfo:{act:'user.product-Product-getInfo',code:31003},
    productCreate:{act:'user.product-Product-create',code:31004},
    productUpdate:{act:'user.product-Product-edit',code:31005},
    productDelete:{act:'user.product-Product-del',code:31006},
    productAttributes:{act:'user.product-Product-getProductAttributes',code:31007,timeout:86400},
    productCustomMaterial:{act:'user.product-Product-getProductCustomMaterial',code:31008,timeout:86400},
    productExport:{act:'user.product-Product-excelExport',code:31009,timeout:86400},
    productSupplyStock:{act:'user.product-Product-supplyStock',code:31010},
    productEditSeries:{act:'user.product-Product-editSeries',code:31011},
    //product_template
    productTemplateList:{act:'user.product_template-Template-getLists',code:31101},
    productTemplateInfo:{act:'user.product_template-Template-getInfo',code:31102},
    productTemplateCreate:{act:'user.product_template-Template-create',code:31103},
    productTemplateUpdate:{act:'user.product_template-Template-edit',code:31104},
    productTemplateDelete:{act:'user.product_template-Template-del',code:31105},
    productTemplateConfigs:{act:'user.product_template-Template-getTemplateConfigs',code:31106,timeout:86400},
    productTemplateAttributes:{act:'user.product_template-TemplateAttributes-getLists',code:31107},
    productTemplateSetProgress:{act:'user.product_template-Template-setProgress',code:31108},
    productTemplateCancel:{act:'user.product_template-Template-cancel',code:31109},
    productTemplateExpedited:{act:'user.product_template-Template-expedited',code:31110},
    productTemplateSetPaid:{act:'user.product_template-Template-setPaid',code:31111},
    productTemplateCopy:{act:'user.product_template-Template-copyTemplate',code:31112},
    productTemplateExport:{act:'user.product_template-Template-excelExport',code:31113},
    //product_series
    productSeriesList:{act:'user.product-ProductSeries-getLists',code:31201,timeout:86400},
    productSeriesInfo:{act:'user.product-ProductSeries-getInfo',code:31202},
    productSeriesCreate:{act:'user.product-ProductSeries-create',code:31203},
    productSeriesUpdate:{act:'user.product-ProductSeries-edit',code:31204},
    productSeriesDelete:{act:'user.product-ProductSeries-del',code:31205},
    //fittings
    fittingsList:{act:'user.fittings-Fittings-getLists',code:32002,timeout:86400},
    fittingsInfo:{act:'user.fittings-Fittings-getInfo',code:32003},
    fittingsCreate:{act:'user.fittings-Fittings-create',code:32004},
    fittingsUpdate:{act:'user.fittings-Fittings-edit',code:32005},
    fittingsDelete:{act:'user.fittings-Fittings-del',code:32006},
    fittingsAttributes:{act:'user.fittings-Fittings-getFittingsAttributes',code:32007,timeout:86400},
    //fittings stock
    fittingsStockList:{act:'user.fittings-FittingsStock-getLists',code:32102,timeout:86400},
    fittingsStockInfo:{act:'user.fittings-FittingsStock-getInfo',code:32103},
    fittingsStockUpdate:{act:'user.fittings-FittingsStock-edit',code:32105},

    //site
    commoditySiteList:{act:'user.site-CommoditySite-getLists',code:33001,timeout:86400},
    commoditySiteInfo:{act:'user.site-CommoditySite-info',code:33002},
    commoditySiteCreate:{act:'user.site-CommoditySite-create',code:33003},
    commoditySiteUpdate:{act:'user.site-CommoditySite-edit',code:33004},
    commoditySiteDelete:{act:'user.site-CommoditySite-del',code:33005},
    commoditySiteMailConfigInfo:{act:'user.site-SiteMailConfig-info',code:33006},
    commoditySiteMailConfigEdit:{act:'user.site-SiteMailConfig-edit',code:33007},
    //commodity category
    commodityCategoryTree:{act:'user.commodity-Category-getTree',code:33010,timeout:86400},
    commodityCategorySync:{act:'user.commodity-Category-syncCategory',code:33011},
    commodityCategorySortSync:{act:'user.commodity-CommodityCategoryMap-sync',code:33012},
    commodityCategoryMapEdit:{act:'user.commodity-CommodityCategoryMap-edit',code:33013},
    //commodity
    commodityList:{act:'user.commodity-Commodity-getLists',code:33020},
    commodityInfo:{act:'user.commodity-Commodity-info',code:33021},
    commodityCreate:{act:'user.commodity-Commodity-create',code:33022},
    commodityUpdate:{act:'user.commodity-Commodity-edit',code:33023},
    commodityDelete:{act:'user.commodity-Commodity-del',code:33024},
    commoditySync:{act:'user.commodity-Commodity-syncCommodity',code:33025},
    commodityExport:{act:'user.commodity-Commodity-excelExport',code:33026},
    //factory
    factoryList:{act:'user.produce-Factory-getLists',code:34001},
    factoryInfo:{act:'user.produce-Factory-info',code:34002},
    factoryCreate:{act:'user.produce-Factory-create',code:34003},
    factoryUpdate:{act:'user.produce-Factory-edit',code:34004},
    factoryDelete:{act:'user.produce-Factory-del',code:34005},
    //factory produce
    factoryProduceList:{act:'user.produce-FactoryProduce-getLists',code:34010},
    factoryProduceConfigs:{act:'user.produce-FactoryProduce-getConfigs',code:34011,timeout:86400},
    factoryProduceSet:{act:'user.produce-FactoryProduce-setProduce',code:34012},
    factoryProduceAccept:{act:'user.produce-FactoryProduce-setAccept',code:34013},
    factoryProduceExpedited:{act:'user.produce-FactoryProduce-setConfirm',code:34014},
    factoryProduceRecordList:{act:'user.produce-FactoryProduceRecord-getLists',code:34015},
    factoryProduceExport:{act:'user.produce-FactoryProduce-excelExport',code:34016},
    factoryProduceInfo:{act:'user.produce-FactoryProduce-getInfo',code:34017},
    factoryBatchStart:{act:'user.produce-FactoryProduce-batchStartProduce',code:34018},
    factoryProduceRecordExport:{act:'user.produce-FactoryProduceRecord-excelExport',code:34019},
    factoryProduceReportList:{act:'user.produce-FactoryProduceStatistics-getReport',code:34020},
    //purchase
    purchaseList:{act:'user.produce-Purchase-getLists',code:34020},
    purchaseConfigs:{act:'user.produce-Purchase-getConfigs',code:34021,timeout:86400},
    purchaseSet:{act:'user.produce-Purchase-setProduce',code:34022},
    purchaseSetConfirm:{act:'user.produce-Purchase-setConfirm',code:34023},
    purchaseInfo:{act:'user.produce-Purchase-getInfo',code:34024},
    purchaseExport:{act:'user.produce-Purchase-excelExport',code:34025},
    //stock
    stock:{act:'user.stock-Lib-index',code:33001},
    restock:{act:'user.stock-Lib-restock',code:33002},
    stockDrop:{act:'user.stock-Lib-drop',code:33003},
    stockDropCancel:{act:'user.stock-Lib-drop_cancel',code:33004},
    stockAdjustment:{act:'user.stock-Lib-adjustment',code:33005},
    restockList:{act:'user.stock-Lib-restockList',code:33011},
    presellList:{act:'user.stock-Lib-presellList',code:33021},
    storehouseList:{act:'user.stock-Lib-storehouseList',code:33031},
    getStorehouse:{act:'user.stock-Lib-getStorehouse',code:33032},
    storehouseAdd:{act:'user.stock-Lib-storehouseAdd',code:33033},
    storehouseUpdate:{act:'user.stock-Lib-storehouseUpdate',code:33034},
    storehouseAreaRel:{act:'user.stock-Lib-storehouseAreaRel',code:33041},
    storehouseAreaRelAdd:{act:'user.stock-Lib-storehouseAreaRelAdd',code:33042},
    getStorehouseAreaRel:{act:'user.stock-Lib-getStorehouseAreaRel',code:33043},
    storehouseAreaRelUpdate:{act:'user.stock-Lib-storehouseAreaRelUpdate',code:33044},
    storehouseAreaRelDelete:{act:'user.stock-Lib-storehouseAreaRelDelete',code:33045},
    areaList:{act:'user.stock-Lib-areaList',code:33051},
    areaAdd:{act:'user.stock-Lib-areaAdd',code:33052},
    getArea:{act:'user.stock-Lib-getArea',code:33053},
    areaUpdate:{act:'user.stock-Lib-areaUpdate',code:33054},
    areaDelete:{act:'user.stock-Lib-areaDelete',code:33055},
    logList:{act:'user.stock-Lib-logList',code:33061},
    stockJxc:{act:'user.stock-Lib-stockJxc',code:33071},
    stockJxcLogList:{act:'user.stock-Lib-stockJxcLogList',code:33081},
    stockZero:{act:'user.stock-Lib-stockZero',code:33082},
    stockZeroChangeStatus:{act:'user.stock-Lib-stockZeroChangeStatus',code:33083},
    getStock:{act:'user.stock-Lib-getStock',code:33090},
    getAllStorehouse:{act:'user.stock-Lib-getAllStorehouse',code:33091},
    getPresellStatus:{act:'user.stock-Lib-getPresellStatus',code:33092},
    getLogType:{act:'user.stock-Lib-getLogType',code:33093},
    getJxcLogType:{act:'user.stock-Lib-getJxcLogType',code:33094},
    getProductInfo:{act:'user.stock-Lib-getProductInfo',code:33095},
    getProductPrice:{act:'user.stock-Lib-getProductPrice',code:33099},
    getAllShipmentMethod:{act:'user.stock-Lib-getAllShipmentMethod',code:33096},
    getShipmentMethodType:{act:'user.stock-Lib-getShipmentMethodType',code:33097},
    getAllArea:{act:'user.stock-Lib-getAllArea',code:33098},

    //shipment
    importShipmentNo:{act:'user.shipment-Lib-doImportShipmentNo',code:36001},
    eubCount:{act:'user.order-EubLib-count',code:36002},
    eubExport:{act:'user.order-EubLib-export',code:36003},
    exportUpsEds:{act:'user.shipment-Lib-exportUpsEds',code:36004},
    exportUpsTpl:{act:'user.shipment-Lib-exportUpsTpl',code:36005},
    exportDhlTpl:{act:'user.shipment-Lib-exportDhlTpl',code:36006},
    exportFedexTpl:{act:'user.shipment-Lib-exportFedexTpl',code:36007},
    exportAramexTpl:{act:'user.shipment-Lib-exportAramexTpl',code:36008},

    //template
    templateEmailList:{act:'user.template-email-Lib-index',code:35001},
    templateEmailDelete:{act:'user.template-email-Lib-delete',code:35002},
    templateEmailView:{act:'user.template-email-Lib-view',code:35003},
    templateEmailLogList:{act:'user.template-email-EmailLog-index',code:35007},
    templateEmailLogView:{act:'user.template-email-EmailLog-view',code:35008},
    getAllSite:{act:'user.template-email-Lib-getAllSite',code:35004},
    getAllTemplateType:{act:'user.template-email-Lib-getAllTemplateType',code:35005},
    getTemplateStatus:{act:'user.template-email-Lib-getTemplateStatus',code:35006},
    //system
    //getRoles:{act:'user.getRoles',code:20000},
    getRoles:{act:'user.system-Lib-getRoles',code:20000},
    getPermissions:{act:'user.system-Lib-getPermissions',code:20001},
    getUsers:{act:'user.getUsers',code:20002},
    bindRoles:{act:'user.system-Lib-bindRoles',code:20003},
    setRoleAdmin:{act:'user.system-Lib-setRoleAdmin',code:20004},
    updateRole:{act:'user.system-Lib-updateRole',code:20005},
    deleteRole:{act:'user.system-Lib-deleteRole',code:20006},
    deleteUser:{act:'user.user-Lib-deleteUser',code:20007},
    updateUser:{act:'user.user-Lib-updateUser',code:20008},
    deletePower:{act:'user.system-Lib-deletePower',code:20009},
    updatePower:{act:'user.system-Lib-updatePower',code:20010},
    getCategories:{act:'user.system-Lib-getCategories',code:20011,timeout:86400},
    updateCategories:{act:'user.system-Lib-updateCategories',code:20012},
    deleteCategories:{act:'user.system-Lib-deleteCategories',code:20013},
    autoPower:{act:'user.system-Lib-autoPower',code:20014,timeout:-1},
    getCrons:{act:'user.cron-CronLib-getCrons',code:20015},
    getCronActs:{act:'user.cron-CronLib-getCronActs',code:20016,timeout:-1},
    runCron:{act:'user.cron-CronLib-runCron',code:20017},
    //order
    orderQuery:{act:'user.order-Lib-query',code:210000},
    getOrders:{act:'user.order-Lib-getOrders',code:21000},
    getOrderInfo:{act:'user.order-Lib-getOrderInfo',code:21001},
    setOrder:{act:'user.order-Lib-setOrder',code:21002},
    acceptancePassed:{act:'user.order-Lib-acceptancePassed',code:21003},
    getIssueOrders:{act:'user.order-Lib-getIssueOrders',code:21004},
    setOrderIssue:{act:'user.order-Lib-setOrderIssue',code:21005},
    orderDelivery:{act:'user.order-Lib-orderDelivery',code:21006}, //发货
    createOrder:{act:'user.order-Lib-createOrder',code:21007},
    setRefundStatus:{act:'user.order-RefundLib-setRefundStatus',code:21008},//退款状态
    distributionExport:{act:'user.order-Lib-distributionExport',code:21009},//打印库存单
    distributionCount:{act:'user.order-Lib-distributionCount',code:21010},//库存单总量
    setOrderAddress:{act:'user.order-Lib-setOrderAddress',code:21011},//订单地址
    getRefundOrders:{act:'user.order-RefundLib-getRefundOrders',code:21012},//退款订单
    getReturnOrders:{act:'user.order-ReturnLib-getReturnOrders',code:21013},//退换货物流管理
    setReturnStatus:{act:'user.order-ReturnLib-setReturnStatus',code:21014},//退换货物流管理
    getReturnTrackno:{act:'user.order-ReturnLib-getReturnTrackno',code:21015},//退换货物流管理
    pushReturnTrackno:{act:'user.order-ReturnLib-pushReturnTrackno',code:21016},//退换货物流管理
    getUpdateAddressUrl:{act:'user.order-Lib-getUpdateAddressUrl',code:21017},//获取修改地址链接
    orderInvoiceExport:{act:'user.order-InvoiceLib-export',code:21018},//导出购物发票
    orderPickedDelivery:{act:'user.order-Lib-orderPickedDelivery',code:21019}, //配货+发货
    manualSendMail:{act:'user.order-Lib-manualSendMail',code:21020}, //配货+发货
    //order-item-defective 次品
    itemDefectiveLists:{act:'user.order-ItemDefectiveLib-lists',code:21021}, //列表
    itemDefectiveSet:{act:'user.order-ItemDefectiveLib-setStatus',code:21022}, //修改
    itemDefectiveAdd:{act:'user.order-ItemDefectiveLib-add',code:21023}, //新建
    orderShipmentFail:{act:'user.order-ShipmentFailLib-lists',code:21024}, //面单错误日志
    flushShipment:{act:'user.order-Lib-flushShipment',code:21025}, //打印面单
    itemDefectiveExport:{act:'user.order-ItemDefectiveLib-excelExport',code:21026}, //导出
    //order-emb
    getEmbs:{act:'user.emb-Lib-getEmbs',code:23000},
    updateEmb:{act:'user.emb-Lib-updateEmb',code:23001},
    deleteEmb:{act:'user.emb-Lib-deleteEmb',code:23002},
    getEmbItems:{act:'user.emb-Lib-getEmbItems',code:23003},
    pushEmbItem:{act:'user.emb-Lib-pushEmbItem',code:23004},
    popEmbItem:{act:'user.emb-Lib-popEmbItem',code:23005},
    delEmbItem:{act:'user.emb-Lib-delEmbItem',code:23006},
    updateEmbItem:{act:'user.emb-Lib-updateEmbItem',code:23007},
    actionExport:{act:'user.emb-Lib-actionExport',code:23008},
    embOrderReturnIndex:{act:'user.emb-Lib-orderReturnIndex',code:23009},
    embOrderReturnCreate:{act:'user.emb-Lib-orderReturnCreate',code:23010},
    embOrderReturnVerify:{act:'user.emb-Lib-orderReturnVerify',code:23011},
    embOrderReturnPrint:{act:'user.emb-Lib-orderReturnPrint',code:23012},
    embOrderReturnShip:{act:'user.emb-Lib-orderReturnShip',code:23013},
    embOrderReturnCancel:{act:'user.emb-Lib-orderReturnCancel',code:23014},
    embOrderReturnContacted:{act:'user.emb-Lib-orderReturnContacted',code:23015},
    embOrderReturnAttributes:{act:'user.emb-Lib-orderReturnAttributes',code:23016},
    //耗材
    getSupplies:{act:'user.supplies-Lib-getSupplies',code:23010},
    updateSupplies:{act:'user.supplies-Lib-updateSupplies',code:23011},
    pushSupplies:{act:'user.supplies-Lib-pushSupplies',code:23012},
    //comment
    setComment:{act:'user.comment-Lib-setComment',code:22000},
    getComment:{act:'user.comment-Lib-getComment',code:22001},
    //cachekey
    CACHEKEY:{OPENMENUS:'OPENMENUS'},
    exportEmail:{act:'user.sales-Lib-exportEmail',code:24001},
    salesReport:{act:'user.count-Lib-salesReport',code:24101},
}