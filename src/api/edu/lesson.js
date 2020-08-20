import request from "@utils/request";

const BASE_URL = "/admin/edu/lesson";

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
