import Vue  from 'vue'
import VueResource  from 'vue-resource'
import { Message,MessageBox,Loading,Alert } from 'element-ui';
import store from './store/'
import URI from './uri.js'
import i18n from './local'
Vue.use(VueResource);
window.console.warn=function(a){
    //[vue-i18n] Cannot translate the value of keypath '操作'. Use the value of keypath as default.
    if(a.indexOf('Cannot translate') > 0){
        var str = a.replace(/\[vue-i18n\] Cannot translate the value of keypath '/, '');
        str = str.replace(/'. Use the value of keypath as default./, '');

        var _ls = vk.ls('translate') ? vk.ls('translate') : {};
        _ls[str] = str;
        vk.ls('translate',_ls);
    }
    //return;
};
let vk={
    isProduction:function(){
        return process.env.NODE_ENV === 'production';
    },
    cgi:function(uri=""){

        var base_url=location.origin+(this.isProduction()?"/api":"/api");
        if(typeof uri =='string') return base_url.replace('api','')+uri;
        base_url+='/'+uri.act;
        console.log('isProduction',this.isProduction(),base_url);
        return base_url;
    },
    toast:function(msg,type='error'){
        if(type=='error')
            return Message.error(msg);
        Message({message:msg,type:type});
    },
    then:function(data,uri,param, callback){
        this.loading(false);
        console.log('vk-then',data,uri.code);
        if(data.code==-1){
            this.toast(data.message);
            sessionStorage.clear();
            window.localStorage.clear();
            location.hash='#/login';
            return;
        }
        if(data.code!=200 && data.code!=404){
            let ld=this.ls('data');
            console.log('vk-then-ld',ld);
            i18n.locale=ld.lang?ld.lang:'zh';
            this.toast(i18n.t(data.message));
            return;
        }
        this.setCache(uri,data,param);
        if(callback) callback(data,uri.code);
    },
    http:function(uri,data,callback){
        this.loading();
        var cdata=this.getCache(uri,data);
        if(cdata && !data.__force){
            console.log('cacheData',cdata);
            return this.then(cdata,uri,data,callback);
        }
        var url=this.cgi(uri);
        var that=this;
        
        if(!data.token){
            try{
                var token = store.state.user.token;
                data.token=token;
            }catch(e){}
        }
        console.log('postdata',data);
        if(data.__force){
            delete data.__force;
        }
        for(let i in data){
            if(typeof data[i]=='undefined')
                delete data[i];
        }
        Vue.http.post(url,data,{emulateJSON: true}).then(
            (response) => {
                that.then(response.body,uri,data,callback);
            },
            (response) => {
                that.then(response.body,uri,data,callback);
            }
        );
    },
    catchRule(uri){
        if(uri.timeout){
            let line=uri;
            line.key=uri.act+'_'+uri.code;
            return line;
        }
        return false;
    },
    setCache(uri,data,param){
        var rule=this.catchRule(uri);
        if(rule){
            let paramKey = param && JSON.stringify(param)!='{}' ? JSON.stringify(param) : '';
            this.ls(rule.key+paramKey,data,rule.timeout);
        }
    },
    getCache(uri,param,callback){
        var rule=this.catchRule(uri);
        if(rule){
            let paramKey = param && JSON.stringify(param)!='{}' ? JSON.stringify(param) : '';
            return this.ls(rule.key+paramKey);
        }
        return false;
    },
    ls:function(key,val=false,timeout=-1){
        key=this.encode(key,key);
        var old=window.localStorage.getItem(key);
        if(key=='data')
        console.log('ls=====>',key,old);
        var time=new Date().getTime();
        if(old){
            old=JSON.parse(this.decode(old,key));
            if(val===false){
                if(key=='data' && old) return old;
                if(old.time>time || old.time==-1){
                    return old.data;
                }
                return "";
            } 
        }
        if(val===false) return "";
        old={time:timeout==-1?-1:(time+timeout*1000),data:val};
        window.localStorage.setItem(key,this.encode(JSON.stringify(old)));
    },
    getArrObj2Arr:function(arr,key){
        var d=[];
        arr.map(function(r,i){
            d.push(r[key])
        })
        return d;
    },
    alert:function(title,confirm){
        MessageBox.alert(title, 'Message', {
            confirmButtonText: 'Ok',
            callback: action => {
                if(confirm) confirm();
            }
        });
    },
    confirm:function(title,confirm,cancel){
        MessageBox.confirm(title, 'Prompt message', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning',
            dangerouslyUseHTMLString: true,
        }).then(() => {
            if(confirm) confirm();
        }).catch(() => {
            if(cancel) cancel();
        });
    },
    numberFormat(num,floatNumber=2,pre='$'){
        if(!isFinite(num)) return num;
        var numberSplit=',';
        var number=(num/1).toFixed(floatNumber).toString();
        return number.replace(/([\d]{1,3})([\d]{3})?([\d]{3})?([\d]{3})?(\.[\d]{2})/,function(){
            var str=pre;
            for (var i=1;i<5;i++){
                str+=typeof arguments[i]!='undefined'?(arguments[i]+numberSplit):'';
            }
            str=str.substr(0,str.length-1);
            return str+arguments[5];
        });
    },
    moneyFormat(num,right='USD'){
        if(!isFinite(num)) return num;
        var numberSplit=',';
        var number=(num/1).toFixed(2).toString();
        return number.replace(/([\d]{1,3})([\d]{3})?([\d]{3})?([\d]{3})?(\.[\d]{2})/,function(){
            var str='';
            for (var i=1;i<5;i++){
                str+=typeof arguments[i]!='undefined'?(arguments[i]+numberSplit):'';
            }
            str=str.substr(0,str.length-1);
            return str+arguments[5];
        })+'('+right+')';
    },
    loading(flag=true){
        var load=Loading.service({ fullscreen: true });
        if(!flag) setTimeout(function(){load.close();},0);
    },
    date(tpl,timespace){
        if(!timespace || timespace == 0){
            return '';
        }
        tpl=tpl || "YYYY-MM-DD HH:II:SS";
        var d=new Date(timespace*1000);
        tpl=tpl.toUpperCase();
        tpl=tpl.replace('YYYY',d.getFullYear());
        var mm=d.getMonth()+1;
        tpl=tpl.replace('MM',mm>9?mm:'0'+mm);
        var dd=d.getDate();
        tpl=tpl.replace('DD',dd>9?dd:'0'+dd);
        var hh=d.getHours();
        tpl=tpl.replace('HH',hh>9?hh:'0'+hh);
        var ii=d.getMinutes();
        tpl=tpl.replace('II',ii>9?ii:'0'+ii);
        var ss=d.getSeconds();
        tpl=tpl.replace('SS',ss>9?ss:'0'+ss);
        return tpl;
    },
    encode(string,typeKey=''){
        if(!this.isProduction() || typeKey=='data') return string;
        return window.btoa(window.encodeURIComponent(string))
    },
    decode(string,typeKey=''){
        if(!this.isProduction() || typeKey=='data') return string;
        return window.decodeURIComponent(window.atob(string))
    },
    showImageView(target){

        this.previewImage.url = target.currentTarget.src;
        this.previewImage.width = target.currentTarget.naturalWidth;
        this.previewImage.show = true;
    },
    closeImagePreview(){
        this.previewImage = {url:'',show:false};
    },
    exportExcel: function (rs) { // 点击导出按钮

    },
    sxu($str,$size){
        $str=$str?$str.trim():"";
        let $space='~';
        let $size_ext=" (US)";
        let reg=new RegExp("(.*)"+$space+"([0-9]{3,})$");
        let $match=$str.match(reg);

        let $spu='',$sku='',$sizex='';
        if($match){
            $spu=$match[1];
            $sku=$str;
            $size=$match[2]/10;
        }else{
            if($size){
                $size=($size+"").split(" ");
                $size=$size[0];
                $sizex=$size*10;
                if($sizex<100){
                    $sizex="0"+$sizex;
                }
            }else{
                $sizex='999';
            }
            $spu=$str;
            $sku=$spu+$space+$sizex;
        }
        return {
            spu:$spu,
            sku:$sku,
            size:$size,
            size_ext:$size+$size_ext,
        };
    },
    skuSize(sku,isLabel){
        let it = this.sxu(sku);
        if(it.size && it.size != 99.9){
            return isLabel ? it.size_ext : it.size;
        }
        return '';
    },
    height(hx=0){
        let _h=95;
        let h=window.screen.availHeight;
        return h-_h-hx;
    },
    productAttr(data,key){
        if(!data) return '';
        if(typeof data == 'string') data = JSON.parse(data);
        if(key=='this') return data;
        switch (key){
            case 'review_img'://效果图
                if(data.attr && data.attr.length>1){
                    let item = data.attr.filter(t=>t.type=='review');
                    if(item.length>=1 && item[0].remote_url) return item[0].remote_url;
                }
                return '';
            case 'source_img'://原图
                if(data.attr && data.attr.length>1){
                    let item = data.attr.filter(t=>t.type=='source');
                    if(item.length>=1 && item[0].remote_url) return item[0].remote_url;
                }
                return '';
            case 'color'://电镀颜色
                return data.color;

        }
    },
    isEmpty(obj) {

        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;
        if(!isNaN(obj)) return Boolean(parseFloat(obj));
        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== "object") return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    },
    getUserName(uid){
        let conf=this.getCache(URI.getConf).data.nicks;
        return uid=='0'?'ONEDAY':conf[uid];
    },
    getMainImage(list){
        return !this.isEmpty(list) && !this.isEmpty(list[0].image) ? list[0].image.path : '';
    },
    filterObject(raw, allowed){
        return Object.keys(raw).filter(key => allowed.includes(key))
            .reduce((obj, key) => {
                obj[key] = raw[key];
                return obj;
            }, {});
    },
    moment: function (row, column) {
        return vk.date('YYYY-MM-DD HH:II',row[column.property]);
    },
    getOrderReturnString(order,key='increment_id'){
        let str="";
        if(order.shipped_count>0){
            if(order.reshipped==1){
                str="(重发)";
            }
            if(order.changed==1){
                str="(换货)";
            }
        }
        return str+order[key];
    },
};
Vue.directive('date', function (el, binding) {
     el.innerHTML=vk.date(binding.value[0],binding.value[1]);
})
export default vk;