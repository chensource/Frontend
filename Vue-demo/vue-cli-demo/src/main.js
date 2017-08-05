// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import 'normalize.css/normalize.css'; // normalize.css 样式格式化
import IconSvg from 'components/Icon-svg'; // svg 组件
import './mock/index.js'; // 该项目所有请求使用mockjs模拟

// register globally
// Vue.component('multiselect', Multiselect);
// Vue.component('Sticky', Sticky);
import { getToken } from 'utils/auth';
Vue.component('icon-svg', IconSvg);
Vue.use(ElementUI);

// Vue.config.productionTip = false

// permissiom judge
// function hasPermission(roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true; // admin权限 直接通过
//   if (!permissionRoles) return true;
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }


const whiteList = ['/login', '/authredirect', '/reset', '/sendpwd']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  // NProgress.start(); // 开启Progress
  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          const roles = res.data.role;
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            router.addRoutes(store.getters.addRouters);
            next({ ...to });
          })
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/login' });
          })
        })
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login'); // 否则全部重定向到登录页
      // NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});

router.afterEach(() => {
  // NProgress.done(); // 结束Progress
});

Vue.config.productionTip = false;

// 生产环境错误日志
if (process.env === 'production') {
  Vue.config.errorHandler = function(err, vm) {
    console.log(err, window.location.href);
    errLog.pushLog({
      err,
      url: window.location.href,
      vm
    })
  };
}

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
