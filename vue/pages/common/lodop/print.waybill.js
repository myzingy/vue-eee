/**
 * Created by vking on 2017/12/23.
 */
let printServer='127.0.0.1';
if(process.env.NODE_ENV === 'production'){
    printServer='127.0.0.1';
}
import lodop from './lodop.base';
//lodop.init(printServer);
export default {
    ...lodop,
    init:function(){
        lodop.init(printServer);
    },
};
