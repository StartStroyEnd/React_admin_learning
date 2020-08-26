import { reqLogin, reqLogout } from "@api/acl/login";
import { LOGIN_SUCCESS, REMOVE_TOKEN } from "../constants/login";

import { mobileLogin } from "@api/acl/oauth";

/**
 * 登陆
 */
export const loginSuccessSync = (user) => ({
  type: LOGIN_SUCCESS,
  data: user,
});

// 账户密码触发
export const login = (username, password) => {
  return (dispatch) => {
    return reqLogin(username, password).then((response) => {
      dispatch(loginSuccessSync(response));
      // 返回token，外面才能接受
      return response.token;
    });
  };
};
// 手机号码登录触发
export const mobilelogin = (mobile, code) => {
  return (dispatch) => {
    return mobileLogin(mobile, code).then((response) => {
      dispatch(loginSuccessSync(response));
      // 返回token，外面才能接受
      return response.token;
    });
  };
};

/**
 * 删除token
 */
export const removeToken = () => ({
  type: REMOVE_TOKEN,
});

/**
 * 登出
 */
export const logout = () => {
  return (dispatch) => {
    return reqLogout().then(() => {
      dispatch(removeToken());
    });
  };
};
