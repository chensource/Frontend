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
