import Vue from 'vue'
import App from './App'
import router from './router'
import './common/js/flexible'
import './common/css/style.css'
import axios from 'axios'

// Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
})

  //微信内获取openid
  function isWeixinBrowser() {
      let agent = navigator.userAgent.toLowerCase();
      if (agent.match(/MicroMessenger/i) == "micromessenger") {
          return true;
      } else {
          return false;
      }
  }
  if(isWeixinBrowser()){
      axios.get('/jiekou/pay/wxgetopenid.php',{
        params:{
          code:localStorage.getItem('pocode')
        }
      }).then(res=>{
        //设置opid
        sessionStorage.setItem('openid',res.data.openid)
      })
  }

