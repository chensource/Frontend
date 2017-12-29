import request from '@/utils/request';

export function getPermission(domainAccount) {
  return request({
    url: '/account/permission',
    method: 'get',
    params: { domainAccount }
  });
}
