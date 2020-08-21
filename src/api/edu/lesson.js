import request from "@utils/request";

const BASE_URL = "/admin/edu/lesson";

// 获取所有章节列表（章节+课时）
// http://localhost:5000/admin/edu/lesson/get/:chapterId
export function reqChapterLessonList(chapterId) {
  return request({
    url: `${BASE_URL}/get/${chapterId}`,
    method: "GET",
    params: {
      chapterId,
    },
  });
}

// 发送请求获取七牛云token视频上传凭证
// http://localhost:5000/uploadtoken
// export function reqGetUploadToken() {
//   return request({ url: "/uploadtoken", method: "GET" });
// }

// 获取课时新增
// http://localhost:5000/admin/edu/lesson/save
export function addLesson({ chapterId, title, free, video }) {
  return request({
    url: `${BASE_URL}/save`,
    method: "POST",
    data: {
      chapterId,
      title,
      free,
      video,
    },
  });
}
