import vk from '../../vk.js'
var App = {
    newWindow:null,
    open: function (url='') {
        App.newWindow = App.newWindow?App.newWindow:window.open();
        App.newWindow.document.title='download loding...'
        //this.newWindow.document.write("<p>download loding...</p>");
        this.newWindow.document.body.innerHTML="<p>download loding...</p>";
        //this.newWindow.focus();
        if(url){
            App.href(url);
        }
    },
    href: function (url = '') {
        if(!url){
            App.newWindow.close();
            App.newWindow=null;
        }
        if (url.indexOf('://') < 0) {
            url = vk.cgi(url);
        }
        App.newWindow.document.body.innerHTML="<p>download start...</p>";
        App.newWindow.location.href = url;
        let that=App;
        setTimeout(function(){
            that.newWindow.close();
            that.newWindow=null;
        },500);
    }
}
export default App;