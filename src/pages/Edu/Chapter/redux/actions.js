import { reqGetAllCourse } from "@api/edu/course";
import { reqChapterList, reqBatchRemoveChapterList } from "@api/edu/chapter";
import {
  reqChapterLessonList,
  reqBatchRemoveLessonList,
} from "@api/edu/lesson";
import {
  GET_ALL_COURSE,
  GET_CHAPTER_LIST,
  GET_LESSON_LIST,
  REMOVE_CHAPTERS,
  REMOVE_LESSON,
} from "./constants";
// import chapterList from "./reducers";

// 获取所有课程列表
// 同步action
function getCourseListSync(data) {
  return {
    type: GET_ALL_COURSE,
    data,
  };
}

// 异步action
export function getCourseList() {
  return (dispatch) => {
    // 发送异步请求
    reqGetAllCourse().then((res) => {
      dispatch(getCourseListSync(res));
    });
  };
}

// GET_CHAPTER_LIST
// 同步action
function getChapterListSync(data) {
  return {
    type: GET_CHAPTER_LIST,
    data,
  };
}

// 异步action
export function getChapterList(couserId) {
  return (dispatch) => {
    // 发送异步请求
    return reqChapterList(couserId).then((res) => {
      dispatch(getChapterListSync(res));
    });
  };
}

// 获取所有课程列表
function getLessonListSync(data) {
  return { type: GET_LESSON_LIST, data };
}

export function getLessonList(chapterId) {
  return (dispatch) => {
    reqChapterLessonList(chapterId).then((res) => {
      // 需要传入两个数据去放入reducers中因为要用到每个章节的id
      dispatch(getLessonListSync({ res, chapterId }));
    });
  };
}

// 批量删除章节
function delChapterListSync(data) {
  return { type: REMOVE_CHAPTERS, data };
}

export function delChapterList(chapterIds) {
  return (dispatch) => {
    reqBatchRemoveChapterList(chapterIds).then((res) => {
      dispatch(delChapterListSync(chapterIds));
    });
  };
}

// reqBatchRemoveLessonList
// 批量删除课时
function delLessonListSync(data) {
  return { type: REMOVE_LESSON, data };
}

export function delLessonList(lessonIds) {
  return (dispatch) => {
    return reqBatchRemoveLessonList(lessonIds).then((res) => {
      dispatch(delLessonListSync(lessonIds));
    });
  };
}
