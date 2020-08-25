import request from "@utils/request";

const BASE_URL = "/oauth";
// 获取手机验证码的方法
// http://localhost:5000/oauth/sign_in/digits
// 需求参数：手机号
export function reqGetVerifyCode(mobile) {
  return request({
    url: `${BASE_URL}/sign_in/digits`,
    method: "POST",
    data: {
      mobile,
    },
  });
}

// 手机号登录
// http://localhost:5000/oauth/mobile
//
