import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementLocale from 'element-ui/lib/locale'
Vue.use(VueI18n)

import validate from './validate'
import ele from './ele'
import erp from './erp'
//let zhx={zh,...validate.zh,...ele.zh};
//let enx={en,...validate.en,...ele.en};
let zhx=Object.assign(erp.zh,erp.zh_auto,validate.zh,ele.zh);
let enx=Object.assign(erp.en,erp.en_auto,validate.en,ele.en);
const messages={
    zh:zhx,
    en:enx,
};
console.log('messages',messages);
const i18n =new VueI18n({
    locale: 'zh', // set locale
    messages, // set locale messages
})
ElementLocale.i18n(key => i18n.t(key))
export default i18n;