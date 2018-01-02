import request from '@/utils/request';

export function getPermission(account) {
  return request({
    url: '/account/permission',
    method: 'get',
    params: { account }
  });
}
