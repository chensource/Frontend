import fetch from 'utils/fetch';

// 用户登录
export function loginByAccount(loginaccount, password) {
  const data = { loginaccount, password };
  return fetch({
    url: '/account/login_account',
    method: 'post',
    data
  });
}

// 用户注销
export function logout() {
  return fetch({
    url: '/account/logout',
    method: 'post'
  });
}

// 获取用户信息
export function getInfo() {
  return fetch({
    url: '/account/get_user',
    method: 'get'
  });
}

