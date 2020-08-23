import request from "@utils/request";

const BASE_URL = "/admin/edu/chapter";

// 获取所有课程列表数据
// http://localhost:5000/admin/edu/chapter/:page/:limit
export function reqChapterList(courseId) {
  return request({
    url: `${BASE_URL}/1/10`,
    method: "GET",
    params: {
      courseId,
    },
  });
}

// 批量删除章节
// http://localhost:5000/admin/edu/chapter/batchRemove
export function reqBatchRemoveChapterList(chapterIdList) {
  return request({
    url: `${BASE_URL}/batchRemove`,
    method: "DELETE",
    data: {
      idList: chapterIdList,
    },
  });
}
