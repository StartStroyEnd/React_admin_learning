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

export function reqSecGetSubject(parentId) {
  return request({
    url: `${BASE_URL}/get/${parentId}`,
    method: "GET",
  });
}