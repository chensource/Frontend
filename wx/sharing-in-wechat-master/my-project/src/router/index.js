import Vue from 'vue'
import Router from 'vue-router'
import my from '../components/my'
import share from '../components/share'
import App from '../App'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      component:App,
      children:[
        {
          path: '/my',
          component:my
        },
        {
          path:'/share',
          component:share
        }
      ]
    }
  ]
})
