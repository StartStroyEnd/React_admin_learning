import request from "@utils/request";

const BASE_URL = "/admin/edu/subject";
const MOCK_URL = "http://localhost:8888/admin/edu/subject";

export function reqGetSubject(page, limit) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
  });
}

// http://localhost:5000/admin/edu/subject/get/:parentId
// 获取一级分类ID所对应的二级ID列表请求
// 导出至外层redux中的请求包中，在utils下的request中去发送请求。
export function reqSecGetSubject(parentId) {
  return request({
    url: `${BASE_URL}/get/${parentId}`,
    method: "GET",
  });
}

// http://localhost:5000/admin/edu/subject/save

// 发送添加课程分类请求
export function reqAddSubject(title, parentId) {
  return request({
    url: `${BASE_URL}/save`,
    method: "POST",
    data: {
      title,
      parentId,
    },
  });
}

// http://localhost:5000/admin/edu/subject/remove/:id
// 发送删除课程分类

export function reqDelSubject(id) {
  return request({
    url: `${BASE_URL}/remove/${id}`,
    method: "DELETE",
  });
}
// http://localhost:5000/admin/edu/subject/update
export function reqUpdateSubject(id, title) {
  return request({
    url: `${BASE_URL}/update`,
    method: "PUT",
    data: {
      id,
      title,
    },
  });
}
