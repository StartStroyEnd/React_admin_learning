import request from "@utils/request";


// 发送请求获取七牛云token视频上传凭证
// http://localhost:5000/uploadtoken
export function reqGetUploadToken() {
  return request({
    url: "/uploadtoken",
    method: "GET",
  });
}
