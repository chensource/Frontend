import { loginByAccount, logout, getInfo } from 'api/login';
import { getToken, setToken, removeToken } from 'utils/auth';

const user = {
  state: {
    employeeno: '',
    employeename: '',
    domainaccount: '',
    lastlogintime: '',
    logincount: '',
    rolecode: '',
    groupcode: '',
    token: getToken()
  },

  mutations: {
    SET_CODE: (state, domainaccount) => {
      state.domainaccount = domainaccount;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_EMPLOYEENO(state, employeeno) {
      state.employeeno = employeeno
    },
    SET_NAME: (state, employeename) => {
      state.employeename = employeename;
    },
    SET_ROLES: (state, rolecode) => {
      state.rolecode = rolecode;
    },
    SET_LASTLOGINTIME: (state, lastlogintime) => {
      state.lastlogintime = lastlogintime;
    },

    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    LOGOUT_USER: state => {
      state.user = '';
    }
  },

  actions: {
    LoginByAccount({ commit }, userInfo) {
      const account = userInfo.account.trim();
      return new Promise((resolve, reject) => {
        loginByAccount(account, userInfo.password).then(response => {
          const data = response.data;
          if (data.errcode === 0) {
            setToken(data.result.Token);
            commit('SET_TOKEN', data.result.Token);
          }
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data.result;
          commit('SET_ROLES', data.RoleCode);
          commit('SET_NAME', data.EmployeeName);
          commit('SET_CODE', data.DomainAccount);
          commit('SET_EMPLOYEENO', data.EmployeeNo);
          commit('SET_LASTLOGINTIME', data.LastLoginTime);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 第三方验证登录
    LoginByThirdparty({ commit, state }, code) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', code);
        loginByThirdparty(state.status, state.email, state.code).then(response => {
          commit('SET_TOKEN', response.data.token);
          setToken(response.data.result.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
