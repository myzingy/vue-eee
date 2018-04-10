/**
 * Created by vking on 2017/12/23.
 */
import vk from '../../../vk.js'

let printBarcode = function(barcode){
    LODOP.SET_LICENSES("","D76D30B9AF19CC9836293C0460897BF1","C94CEE276DB2187AE6B65D56B3FC2848","");
    LODOP.PRINT_INIT("打印条码"+barcode);
    LODOP.SET_PRINT_PAGESIZE(2,'40mm','70mm');
    LODOP.ADD_PRINT_BARCODE('5mm','5mm','60mm','30mm','128Auto',barcode);
    //LODOP.PREVIEW();
    console.log('LODOP.printBarcode',barcode)
    LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//(可变形)扩展缩放模式
    LODOP.PRINT();
}

let printWaybill = function(waybill,shipping_method,num=''){
    LODOP.SET_LICENSES("","D76D30B9AF19CC9836293C0460897BF1","C94CEE276DB2187AE6B65D56B3FC2848","");
    LODOP.PRINT_INIT("打印面单"+num);
    let printOption=vk.ls('this.printOption');
    if(printOption && printOption[shipping_method]>-1){
        console.log('printOption',printOption,printOption[shipping_method]);
        LODOP.SET_PRINTER_INDEX(printOption[shipping_method]);
    }
    
    //top,left,width,height
    switch (shipping_method){
        case 'EMB':
            LODOP.SET_PRINT_PAGESIZE(1,'100mm','160mm');
            LODOP.ADD_PRINT_IMAGE('0mm','0mm','100mm','160mm',"<img border='0' src='"+waybill+"' />");
            break;
        case 'UPS':
            LODOP.SET_PRINT_PAGESIZE(2,'100mm','200mm');
            LODOP.ADD_PRINT_IMAGE('5mm','5mm','160mm','100mm',"<img border='0' src='"+waybill+"' />");
            break;
        case 'FEDEX':
            LODOP.SET_PRINT_PAGESIZE(1,'100mm','200mm');
            LODOP.ADD_PRINT_IMAGE('5mm','3mm','100mm','170mm',"<img border='0' src='"+waybill+"' />");
            break;
        case 'DHL':
            LODOP.SET_PRINT_PAGESIZE(1,'100mm','200mm');
            LODOP.ADD_PRINT_IMAGE('5mm','3mm','95mm','190mm',"<img border='0' src='"+waybill+"' />");
            break;
        case 'ARAMEX':
            LODOP.SET_PRINT_PAGESIZE(1,'100mm','200mm');
            LODOP.ADD_PRINT_IMAGE('5mm','2mm','100mm','150mm',"<img border='0' src='"+waybill+"' />");
            break;
    }
    LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//(可变形)扩展缩放模式
    //LODOP.PREVIEW();
    console.log('LODOP.printWaybill',waybill,shipping_method,num);
    LODOP.PRINT();
}
let printLabel = function(spu,size,barcode){
    LODOP.SET_LICENSES("","D76D30B9AF19CC9836293C0460897BF1","C94CEE276DB2187AE6B65D56B3FC2848","");
    LODOP.PRINT_INIT("打印标签 HTML");
    //LODOP.SET_SAVE_MODE('ORIENTATION',);
    //LODOP.SET_PRINT_MODE("POS_BASEON_PAPER",true);
    //LODOP.SET_PRINT_PAGESIZE(1,'76mm','25mm');
    LODOP.SET_PRINT_PAGESIZE(1,'75mm','30mm');

    //LODOP.SET_PRINT_STYLE("AlignJustify",1);
    LODOP.SET_PRINT_STYLE("Alignment",2);
    LODOP.SET_PRINT_STYLE("FontSize",7);

    LODOP.SET_PRINT_STYLEA("NotOnlyHighPrecision",1);
    LODOP.SET_PRINT_STYLEA("ShowBarText",'00001-8008992353312');
    LODOP.SET_PRINT_STYLE("ShowBarText",0);
    //top,left,width,height
    LODOP.ADD_PRINT_BARCODE('3mm','4mm','30mm','6mm','128Auto',barcode);

    LODOP. ADD_PRINT_TEXT("10mm","0mm","25mm","5mm",barcode);

    //LODOP.ADD_PRINT_BARCODE('2mm','2mm','23mm','10mm','128C',barcode);
    //LODOP.ADD_PRINT_BARCODE('2mm','0mm','25mm','10mm','PostNet',barcode);
    LODOP. ADD_PRINT_TEXT("18mm","0mm","25mm","5mm",'SPU:'+spu+'');
    LODOP. ADD_PRINT_TEXT("22mm","0mm","25mm","5mm",!!size ? 'Size:'+size:'');
    //LODOP.SET_PRINT_STYLEA(3,"Angle",180);
    // LODOP.PREVIEW();

    //LODOP.SET_PRINT_STYLEA(0,"Stretch",2);//(可变形)扩展缩放模式


    console.log('LODOP.PREVIEW',spu,size,barcode);
    LODOP.PRINT();
}
export default {
    printBarcode:printBarcode,
    printWaybill:printWaybill,
    printLabel:printLabel,
    init:function(printServer){
        console.log('printServer',printServer);
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "http://"+printServer+":8000/CLodopfuncs.js?host="+printServer+Math.random();
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'lodop'));
    },
}
