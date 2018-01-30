import request from "@/utils/request";

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  };
  return request({
    url: "/account/login_account",
    method: "post",
    data
  });
}

export function logout() {
  return request({
    url: "/account/logout",
    method: "post"
  });
}

export function getUserInfo(token) {
  return request({
    url: "/account/user",
    method: "get",
    params: { token }
  });
}
