import {
  GET_ALL_COURSE,
  GET_CHAPTER_LIST,
  GET_LESSON_LIST,
  REMOVE_CHAPTERS,
  REMOVE_LESSON,
} from "./constants";

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

    case REMOVE_CHAPTERS:
      // 解构一个新的章节列表数据
      const chapterList = [...prevState.chapterList];
      // 获取要删除的章节ID
      const delChapterIds = action.data;
      // 过滤掉选中的ID
      const newChapters = chapterList.filter((item) => {
        if (delChapterIds.indexOf(item._id) > -1) {
          // 返回为false的不要了
          return false;
        }
        // 返回true的则还要
        return true;
      });
      return {
        ...prevState,
        chapterList: newChapters,
      };
    case REMOVE_LESSON:
      // 思路：遍历章节的同时遍历其章节下的课时
      // 解构一个新的章节列表数据
      const chapterLists = [...prevState.chapterList];
      // 获取要删除的课时的ID
      const delLessonIds = action.data;
      // 遍历章节列表以通过children来找到课时列表（children是我们自己添加上去的一个课时数据）

      chapterLists.forEach((item) => {
        // 找到当前章节下的所有课时，过滤掉事件源存储好的标识数组中已经存在的标识，
        // 返回一个新的 children 子数组
        item.children = item.children.filter((lessonItem) => {
          if (delLessonIds.indexOf(lessonItem._id > -1)) {
            // 存在即过滤掉
            return false;
          }
          // 否则保存
          return true;
        });
      });

      return {
        ...prevState,
        chapterList: chapterLists,
      };

    default:
      return prevState;
  }
}
