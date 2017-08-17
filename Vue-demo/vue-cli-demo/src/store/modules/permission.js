import { constantRouterMap } from 'src/router';

import { getPermission } from 'api/permission';
// import { deepClone } from 'utils'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        getPermission().then(response => {
          const results = response.data;
          let accessedRouters;
          if (results.errcode === 0) {
            accessedRouters = results.result;
          } else {
            accessedRouters = '';
          }
          // console.log(accessedRouters);
          resolve()
          commit('SET_ROUTERS', accessedRouters);
        })
      })
    }
  }
};


export default permission;
