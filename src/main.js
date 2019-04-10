
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs';
import store from './store/index'
// import iView from 'iview'
import "@babel/polyfill"
import './assets/style/common.less'


//按需加载iview的组件
import { Row, Col, Icon, Card ,Button,Radio,Layout,MenuItem,Sider,Submenu,Menu,Select,Option,Input,Table,Page,Message,DatePicker,
  Modal,Form,FormItem,Tabs,TabPane,Tree,Breadcrumb,BreadcrumbItem,Checkbox   }  from 'iview'

const components = { Row, Col, Icon, Card ,Button,Radio,Layout,MenuItem,Sider,Submenu,Menu,Select,Option,Input,Table,Page,Message,DatePicker,
  Modal,Form,FormItem,Tabs,TabPane,Tree,Breadcrumb,BreadcrumbItem,Checkbox  }

//循环注册全局组件
Object.keys(components).forEach(key => {
	Vue.component(key, components[key]);
});

Vue.prototype.$Message=Message
Vue.prototype.$Modal=Modal

// vue全局变量
Vue.prototype.GLOBAL = {
  // HEADER: 'http://119.23.158.197/printer/', //  服务器IP
  // HEADER: 'http://172.16.31.217:8071/printer/', //吕梁峰IP
  HEADER: 'http://172.16.31.229:8071/printer/', //詹幸喜IP
  axios: axios,
  backTohome: () => {
    vm.$router.push("/")
  },
  $http: (url, method, callback, data,syncType) => {
    if (method === "PUT" || method === "DELETE" || method === "POST") {
      data["_method"] = method
      axios.post(url, qs.stringify(data), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        })
        .then((response) => {
          if (response) {
            if(callback){
              callback(response)
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    } else {
      axios.get(url, {
          params: data
        })
        .then((response) => {
          if (response) {
            if(callback){
              callback(response)
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    }
  },
  showResult(state,msg) {
      const title = '提示信息';
      const content = '<p>Content of dialog</p><p>Content of dialog</p>';
      switch (state) {
          case 1:
              Modal.success({
                  title: title,
                  content: msg
              });
              break;
          default:
              Modal.error({
                  title: title,
                  content: msg
              });
      }
  },
   //禁止对话框’确定‘后关闭
   banSureBut(that){
    setTimeout(() => {
      that.loading = false;
      that.$nextTick(() => {
        that.loading = true;
        });
    }, 500);
}
}


const isDebug_mode = process.env.NODE_ENV !== 'production'
Vue.config.debug = isDebug_mode
Vue.config.devtools = isDebug_mode
Vue.config.productionTip = isDebug_mode

// Vue.use(iView)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})