import { GET_ALL_COURSE, GET_CHAPTER_LIST, GET_LESSON_LIST } from "./constants";

const initChapter = {
  // 存储所有课程列表
  allCourseList: [],
  chapterList: [],
};

export default function chapterList(prevState = initChapter, action) {
  switch (action.type) {
    case GET_ALL_COURSE:
      return {
        ...prevState,
        allCourseList: action.data,
      };
    case GET_CHAPTER_LIST:
      action.data.items.forEach((item) => {
        // 在每一个chapterList中添加一个children的数组，用于存储章节详情
        item.children = [];
      });

      return {
        ...prevState,
        chapterList: action.data.items,
      };

    case GET_LESSON_LIST:
      const newChapterList = [...prevState.chapterList];
      newChapterList.forEach((item) => {
        if (item._id === action.data.chapterId) {
          item.children = action.data.res;
        }
      });

      return {
        ...prevState,
        chapterList: newChapterList,
      };
    default:
      return prevState;
  }
}
