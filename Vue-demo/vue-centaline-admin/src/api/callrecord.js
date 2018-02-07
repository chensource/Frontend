import request from "@/utils/request";

export function fetchList(query) {
  return request({
    url: "/callrecord/list",
    method: "get",
    params: query
  });
}

export function create(data) {
  return request({
    url: "/callrecord/create",
    method: "post",
    data
  });
}

export function update(data) {
  return request({
    url: "/callrecord/update",
    method: "post",
    data
  });
}

export function fetchOne(callLogKeyId) {
  return request({
    url: "/callrecord/detail",
    method: "get",
    params: { callLogKeyId }
  });
}
