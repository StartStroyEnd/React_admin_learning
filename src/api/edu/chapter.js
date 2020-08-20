import request from "@utils/request";

const BASE_URL = "/admin/edu/chapter";



// 
// http://localhost:5000/admin/edu/chapter/:page/:limit
export function reqChapterList(courseId) {
  return request({
    url: `${BASE_URL}/1/10`,
    method: "GET",
    params:{
      courseId
    }
  });
}
