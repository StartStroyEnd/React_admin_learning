import { getInfo, getMenu } from "@api/acl/login";
import { GET_USER_INFO, GET_USER_MENU } from "./constants";

function getUserInfoSync(data) {
  return {
    type: GET_USER_INFO,
    data,
  };
}

// 获取用户信息的action
export function getUserInfo() {
  return (dispatch) => {
    return getInfo().then((res) => {
      dispatch(getUserInfoSync(res));
    });
  };
}
function getUserMenuSync(data) {
  return {
    type: GET_USER_MENU,
    data,
  };
}
//
export function getUserMenu() {
  return (dispatch) => {
    return getMenu().then((res) => {
      dispatch(getUserMenuSync(res));
    });
  };
}
