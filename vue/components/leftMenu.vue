<style lang="stylus" rel="stylesheet/scss">
    .leftMenu{
        a{
            text-decoration: none;
            color:#121212;
        }
    }
</style>
<template>
    <div class="leftMenu">
        <el-row class="tac">
            <el-menu class="el-menu-vertical-demo"
                     @open="handleOpen" @close="handleClose"
                     @select="handleSelect"
                     :collapse="MenuStyle"
                     :default-active="$route.path"
                     :default-openeds="OPENMENUS"
                     >
                <template v-for="(item,path) in nav">
                    <el-submenu :index="path" v-if="item.children">
                        <template slot="title">
                            <i :class="item.icon">{{labelOne(item.label)}}</i>
                            <span slot="title">{{item.label}}</span>
                        </template>
                        <el-menu-item-group v-if="item.children">
                                <template v-for="(_item,_path) in item.children">
                                    <el-menu-item :index="_path" >
                                        <i :class="_item.icon"></i>
                                        <a :href="pa(_path)">{{_item.label}}</a>
                                    </el-menu-item>
                                </template>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item :index="path" v-else="" >
                        <i :class="item.icon"></i>
                        <a :href="pa(_path)">{{item.label}}</a>
                    </el-menu-item>
                </template>
            </el-menu>
        </el-row>
    </div>
</template>



<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import vk from '../vk.js'
import uri from '../uri.js'

import i18n from '../local'
import menux from '../config/menu'
var App= {

  data () {
    return {
        nav:{} ,
        isCollapse: false,
        OPENMENUS:[],
        menu:{},
    };
  },
    computed: mapState({
        lang:state => state.data.lang||"zh",
        MenuStyle:state => state.data.MenuStyle||false,
    }),
  mounted(){
      i18n.locale=this.lang;
      this.menu=menux(i18n);
      vk.http(uri.getConf,{},this.then);
  },
  methods: {
      then(json,code){
          //console.log('uri.getConf',json);
          this.setMenuNav(json.data.power);
          this.setOpenMenus();
          this.autoPower();
      },
      setOpenMenus(){
          let OPENMENUS=vk.ls(uri.CACHEKEY.OPENMENUS);
          if(!OPENMENUS){
              OPENMENUS=[];
          }
          this.OPENMENUS=OPENMENUS;
      },
      handleOpen(key, keyPath) {
          console.log(key, keyPath);
          let OPENMENUS=vk.ls(uri.CACHEKEY.OPENMENUS);
          if(!OPENMENUS){
              OPENMENUS=[];
          }
          OPENMENUS.push(key);
          vk.ls(uri.CACHEKEY.OPENMENUS,OPENMENUS);
      },
      handleClose(key, keyPath) {
          console.log(key, keyPath);
          let OPENMENUS=vk.ls(uri.CACHEKEY.OPENMENUS);
          if(OPENMENUS){
              let _OPENMENUS=[];
              OPENMENUS.map((p)=>{
                  if(p!=key){
                      _OPENMENUS.push(p);
                  }
              });
              vk.ls(uri.CACHEKEY.OPENMENUS,_OPENMENUS);
          }
      },
      handleSelect(key, keyPath){
          console.log(key, keyPath);
//          new Vue({
//              el: '#app_right_content',
//              components: {
//                  app_right_content:app_right_content
//              },
//              render: h => h(app_right_content)
//          })
      },
      setMenuNav(power){
          let navFlag=false;
          power.map((_p)=>{
              if('/*'==_p.name){
                  navFlag=true;
                  this.nav=this.menu;
                  return;
              }
          });
          if(navFlag) return;
          let nav={};
          //console.log('setMenuNav',menu);
          for(let path in this.menu){
              let item=this.menu[path];
              for(let _p in item.children){
                  if(!this.inPower(power,_p)) continue;
                  let r=item.children[_p];
                  if(!nav[path]){
                      nav[path]={
                          label:item.label,
                          icon:item.icon,
                          children:{}
                      };
                  }
                  nav[path].children[_p]=r;
              }
          }
          this.nav=nav;
          //console.log('setMenuNav-end',nav);
      },
      inPower(power,_p){
          let flag=false;
          power.map((item)=>{
              //console.log('setMenuNav-inPower',item.name,_p);
              if(item.name==_p){
                  flag=true;
                  return true;
              }
          });
          return flag;
      },
      autoPower(){
          vk.http(uri.autoPower,this.menu);
      },
      pa(path){
        return '#'+path;
      },
      labelOne(label){
          if(this.MenuStyle){
              if(label.charCodeAt(0)>255) return label.substring(0,1);
              return label.substring(0,2);
          }
          return "";

      },
  }
}
export default {i18n,...App}
</script>
