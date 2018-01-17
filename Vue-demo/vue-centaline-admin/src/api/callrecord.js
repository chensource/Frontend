import request from '@/utils/request';

export function fetchList(query) {
  return request({
    url: '/callrecord/list',
    method: 'get',
    params: query
  });
}
