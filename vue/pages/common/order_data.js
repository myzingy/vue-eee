import i18n from '../../local'
import vk from '../../vk'
import uri from '../../uri'
function paymentStatusObj(){
    let payment_status=['processing','canceled','closed','complete','fraud','holded','payment_review','paypal_canceled_reversal','paypal_reversed','pending','pending_payment','pending_paypal'];
    let _paymentStatusObj={};
    let data=vk.ls('data');
    i18n.locale=data.lang?data.lang:'zh';
    for(var i in payment_status){
        _paymentStatusObj[payment_status[i]]=i18n.t('order.payment.'+payment_status[i]);
    }
    return _paymentStatusObj;
}
let size_original={};
for(let i=3;i<=15;i+=0.5){
    let s=i.toFixed(1);
    size_original[s.toString()]=(s+' (US)');
}
let validateSPU = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('SPU is required'));
    } else {
        let conf=vk.getCache(uri.getConf)['data'];
        let restaurants =conf.products;
        let flag = (function(){
            for(var i in restaurants){
                if(restaurants[i].spu.toLowerCase()==value.toLowerCase())
                    return true;
            }
            return false;
        })();
        if(flag){
            callback();
        }
        callback(new Error('SPU Non-existent'));
    }
};
let paymentMethod=function(){
    return {
        'paypal_express':'Paypal express',
    };
};
let orderStatusObj=function(){
    let payment_status={
        pending:'等待处理',
        cancelled:'已取消',
        waiting_shipped:'等待发货',
        shipped:'已经发货',
        pick_waiting:'等待配货',
        picking:'配货中',
        pick_completed:'配货完成',
        pending_purchase:'等待采购',
        purchase:'采购中',
        purchase_completed:'采购完成',
        processing:'备货中',
        complete:'交易完成',
        distributing:'分发中',
        distribute_waiting:'等待分发',
        distribute_completed:'分发完成',
        distribute_return:'全部返回',
        waiting_accept:'等待验收',
        waiting_repair:'等待返修',
        being_repaired:'开始返修',
        waiting_production:'等待生产',
        in_production:'生产中',
        product_passed:'验货通过',
        rework:'返修中',
        in_stock:'已入库',
        return_process:'退货中',
        return_process_part:'退货中(部分)',
        return_completed:'已退回',
        return_part_completed:'已退回(部分)',
        exchange_process:'换货中',
        exchange_process_part:'换货中(部分)',
        exchange_completed:'换货完成',
        exchange_part_completed:'换货完成(部分)',
        waiting_transfer:'待转运',
        transferring:'转运中',
        transferred:'转运完毕',

        normal:'正常订单',
        address_changed:'修改地址',
        item_changed:'修改产品',
        shipping_method_changed:'修改物流公司',
        change_confirmed:'确认修改',
        paused:'订单暂停',
    };
    let _paymentStatusObj={};
    for(var i in payment_status){
        _paymentStatusObj[i]=i18n.t('order.status.'+i);
    }
    return _paymentStatusObj;
};
let orderLastStatusObj=function(){
    let payment_status=['address_changed','item_changed','shipping_method_changed','change_confirmed'];
    let _paymentStatusObj={};
    let data=vk.ls('data');
    i18n.locale=data.lang?data.lang:'zh';
    for(var i in payment_status){
        _paymentStatusObj[payment_status[i]]=i18n.t('order.status.'+payment_status[i]);
    }
    return _paymentStatusObj;
};
let orderShippingMethodObj=function(){
    return vk.getCache(uri.getConf)['data'].shipments;
};
let size_necklace= {
    '14.0': '14" Chain (35 cm) - Child',
    '16.0': '16" Chain (40 cm) - Young Adult',
    '18.0': '18" Chain (45 cm) - Adult',
    '20.0': '20" Chain (50 cm)',
    '22.0': '22" Chain (55 cm)',
};
let size_bracelets= {
        '16.0': '16 cm = 6.3 in ',
        '17.0': '17 cm = 6.7 in ',
        '18.0': '18 cm = 7.1 in ',
        '19.0': '19 cm = 7.5 in ',
        '20.0': '20 cm = 7.9 in ',
        '21.0': '21 cm = 8.3 in ',
        '22.0': '22 cm = 8.7 in ',
    };
export default {
    paymentStatusObj:paymentStatusObj(),
    size_original:size_original,
    validateSPU:validateSPU,
    paymentMethod:paymentMethod(),
    orderStatusObj:orderStatusObj(),
    orderLastStatusObj:orderLastStatusObj(),
    orderShippingMethodObj:orderShippingMethodObj(),
    size_necklace: size_necklace,
    size_bracelets: size_necklace,
    size_original_all:{
        25:size_original,
        26:size_necklace,
        43:size_bracelets,
    }
}