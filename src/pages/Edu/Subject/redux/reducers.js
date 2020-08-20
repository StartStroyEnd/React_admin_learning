import {
  GET_SUBJECT_LIST,
  GET_SEC_SUBJECT_LIST,
  UPDATE_SUBJECT_LIST,
  DEL_SUBJECT_LIST,
} from "./constants";

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
      const SecItems = action.data.items;

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

    case UPDATE_SUBJECT_LIST:
      prevState.items.forEach((item) => {
        // item为一级课程分类列表数据
        if (item._id === action.data.id) {
          item.title = action.data.title;
          return;
        }
        // item的children方法，是一级课程分类列表下的一个对象型数据。
        // 其数据为二级分类列表数据
        item.children.forEach((secItem) => {
          // 如果二级分类列表中的id属性与
          console.log(action.data);

          if (secItem._id === action.data.id) {
            secItem.title = action.data.title;
            return;
          }
        });
      });
      return {
        ...prevState,
      };

    case DEL_SUBJECT_LIST:
      const newPrevState = [...prevState.items];
      newPrevState.forEach((firItem, index) => {
        if (firItem._id === action.data) {
          newPrevState.splice(index, 1);
          return;
        }
        firItem.children.forEach((secItem, index) => {
          if (secItem._id === action.data) {
            firItem.children.splice(index, 1);
            return;
          }
        });
      });

      return {
        ...prevState,
        items: newPrevState,
      };

    default:
      return prevState;
  }
}
