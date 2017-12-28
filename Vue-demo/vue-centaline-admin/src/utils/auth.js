import Cookies from 'js-cookie';

const TokenKey = 'auth_token';
const Scheme = 'Bearer ';
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, Scheme + token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
