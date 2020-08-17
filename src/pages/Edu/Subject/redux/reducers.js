import { GET_SUBJECT_LIST, GET_SEC_SUBJECT_LIST } from "./constants";

const initSubjectList = {
  total: 0, // 总数
  items: [], // 详细user数据
};

export default function subjectList(prevState = initSubjectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST:
      action.data.items.forEach((item) => {
        item.children = [];
      });
      return action.data;
    case GET_SEC_SUBJECT_LIST:
      // 修改数据，添加到redux中
      // action.data可以获取到对应的一级课程分类的所有二级课程分类
      // action 返回的是一个对象，total和items，items是我们要使用的二级课程数据
      const SecItems = action.data.items;

      console.log(SecItems);

      const PrevItems = prevState.items;

      SecItems.length &&
        PrevItems.forEach((item) => {
          if (item._id === SecItems[0].parentId) {
            item.children = SecItems;
          }
        });
      return {
        ...prevState,
        items: PrevItems,
      };
    default:
      return prevState;
  }
}
