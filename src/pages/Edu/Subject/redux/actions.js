import { reqGetSubject, reqSecGetSubject } from "@api/edu/subject";

import { GET_SUBJECT_LIST, GET_SEC_SUBJECT_LIST } from "./constants";
/**
 * 获取一级课程分类数据
 */
const getSubjectListSync = (list) => ({
  type: GET_SUBJECT_LIST,
  data: list,
});

export const getSubjectList = (page, limit) => {
  return (dispatch) => {
    return reqGetSubject(page, limit).then((response) => {
      dispatch(getSubjectListSync(response));
      return response.total;
    });
  };
};

// reqSecGetSubject
// 获取二级课程分类数据
// 定义异步数据请求存入data中。
const getSecSubjectListSync = (list) => ({
  type: GET_SEC_SUBJECT_LIST,
  data: list,
});
export const getSecSubjectList = (parentId) => {
  return (dispatch) => {
    // 当导出的这个同步方法被触发时，将其一级课程所对应的ID传入，去引导二级课程数据。
    return reqSecGetSubject(parentId).then((response) => {
      // dispatch触发异步请求，等待reducers匹配成功后触发
      dispatch(getSecSubjectListSync(response));
      // 触发以后，返回当前请求成功的结果。response => data : list
      return response;
    });
  };
};
