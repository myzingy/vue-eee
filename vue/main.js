import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './config/routes'
import store from './store/'
import components from './components/' //加载公共组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './index.css'
import vk from './vk';
import uri from './uri';
Vue.use(ElementUI)


Object.keys(components).forEach((key) => {
    var name = key.replace(/(\w)/, (v) => v.toUpperCase()) //首字母大写
    //console.log(key,name);
    Vue.component(`v${name}`, components[key])
})
Vue.use(VueRouter)

const router = new VueRouter({
    routes
})
let conf=vk.getCache(uri.getConf)['data'];
let pathx='';
router.beforeEach(({meta, path}, from, next) => {
    pathx=path;
    var { auth = true } = meta
    //console.log('store.state.user.username',store.state.user.username);
    var isLogin = Boolean(store.state.user.username) //true用户已登录， false用户未登录

    //console.log('auth && !isLogin && path',auth && !isLogin && path !== '/login');
    if (auth && !isLogin && path !== '/login') {
        return next({ path: '/login' })
    }
    //
    if(conf && path !== '/login' && path !== '/home' && path !== '/signout'){
        let powerFlag=false;
        conf.power.map((item)=>{
            //console.log('setMenuNav-inPower',item.name,path);
            if(item.name==path || item.name=='/*'){
                powerFlag=true;
                return;
            }
        });
        //console.log('setMenuNav-inPower-powerFlag',powerFlag);
        if (!powerFlag) {
            return next({ path: '/login' });
        }
    }
    //
    next()
})
router['power']=function(act){
    let powerFlag=false;
    let relpath=pathx+'.';
    if(act.indexOf('/')>-1){
        relpath='';
    }
    conf.power.map((item)=>{

        //console.log('router-power',item.name,relpath+act);

        if(item.name==relpath+act || item.name=='/*'){
            powerFlag=true;
            return;
        }
    });
    return powerFlag;
}
new Vue({ store, router }).$mount('#app')