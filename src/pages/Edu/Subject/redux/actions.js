import {
  reqGetSubject,
  reqUpdateSubject,
  reqSecGetSubject,
  reqDelSubject,
} from "@api/edu/subject";

import {
  GET_SUBJECT_LIST,
  GET_SEC_SUBJECT_LIST,
  UPDATE_SUBJECT_LIST,
  DEL_SUBJECT_LIST,
} from "./constants";
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
    return reqSecGetSubject(parentId).then((response) => {
      dispatch(getSecSubjectListSync(response));
      return response;
    });
  };
};

// 更新课程分类数据同步action
const updateSubjectListSync = (list) => ({
  type: UPDATE_SUBJECT_LIST,
  data: list,
});

// 这是向外暴露的一个接口，用于事件触发此函数，匹配api接口与dispatch常量
export const updateSubjectList = (id, title) => {
  return (dispatch) => {
    // 这个return返回的是一个promise对象
    return reqUpdateSubject(id, title).then((response) => {
      dispatch(
        // 接口函数所要求的一个数据对象用于请求更新后台数据
        updateSubjectListSync({
          id,
          title,
        })
      );
      return response;
    });
  };
};

// 删除一级或二级课程分类列表

const delSubjectListSync = (list) => ({
  type: DEL_SUBJECT_LIST,
  data: list,
});

// 这是向外暴露的一个接口，用于事件触发此函数，匹配api接口与dispatch常量
export const delSubjectList = (id) => {
  return (dispatch) => {
    // 这个return返回的是一个promise对象
    return reqDelSubject(id).then((response) => {
      dispatch(
        // 接口函数所要求的一个数据对象用于请求更新后台数据
        delSubjectListSync(id)
      );
      return response;
    });
  };
};
