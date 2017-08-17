import fetch from 'utils/fetch';

// 获取用户权限包括菜单信息
export function getPermission() {
  return fetch({
    url: '/account/get_permissions',
    method: 'get'
  });
}

