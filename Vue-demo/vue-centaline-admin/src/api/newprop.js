import request from "@/utils/request";

export function fetchNewpropList(query) {
  return request({
    url: "/newprop/list",
    method: "get",
    params: query
  });
}

export function fetchInfoList(query) {
  return request({
    url: "/newprop/info",
    method: "get",
    query
  });
}

export function fetchNewpropOptions() {
  return request({
    url: "/newprop/newprop-options",
    method: "get"
  });
}

export function fetchPriceList(query) {
  return request({
    url: "/newprop/price",
    method: "get",
    query
  });
}

export function fetchNewpropOne(newCode) {
  return request({
    url: "/newprop/detail",
    method: "get",
    params: { newCode }
  });
}

export function createRelation(data) {
  return request({
    url: "/newprop/newprop-relation",
    method: "post",
    data
  });
}

export function createNewPropSync(newcode) {
  return request({
    url: "/newprop/newprop-sync",
    method: "get",
    params: { newcode }
  });
}
