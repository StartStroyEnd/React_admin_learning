import { GET_ALL_COURSE } from "./constants";
// 纯函数

// 后台数据为一个数组存储的
const initCouseList = [];
export default function courseList(prevState = initCouseList, action) {
  switch (action.type) {
    case GET_ALL_COURSE:
      return action.data;
    default:
      return prevState;
  }
}
