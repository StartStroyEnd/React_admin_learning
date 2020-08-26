import { combineReducers } from "redux";

import loading from "./loading";
import token from "./login";

// 由于webpack缓存导致无法获取到user，则直接在reducer中获取user
import user from "@comps/Authorized/redux/reducer.js";
import { userList } from "@pages/Acl/User/redux";
import { roleList } from "@pages/Acl/Role/redux";
import { menuList } from "@pages/Acl/Permission/redux";
import { subjectList } from "@pages/Edu/Subject/redux";
import { chapterList } from "@pages/Edu/Chapter/redux";
import { courseList } from "@pages/Edu/Course/redux";
// 国际化redux，reducer引入
import intl from "./intl";

// 导出
export default combineReducers({
  loading,
  user,
  token,
  userList,
  roleList,
  menuList,
  subjectList,
  chapterList,
  courseList,
  intl,
});
