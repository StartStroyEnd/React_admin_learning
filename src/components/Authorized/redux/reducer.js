import { GET_USER_INFO, GET_USER_MENU } from "./constants";

const initState = {
  name: "", //当前用户名
  avatar: "", //当前用户头像

  permissionList: [], //用户按钮权限
  permissionValueList: [], //用户路由权限
};

export default function user(preveState = initState, action) {
  switch (action.type) {
    case GET_USER_INFO:
      return {
        ...preveState,
        ...action.data,
      };
    case GET_USER_MENU:
      return {
        ...preveState,
        ...action.data,
      };
    default:
      return preveState;
  }
}
