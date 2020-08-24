// 先写死
import { SET_INTL } from "../constants/intl";
// window对象中存储着当前语言环境
const initIntl = window.navigator.language;

export default function intl(prevState = initIntl, action) {
  switch (action.type) {
    case SET_INTL:
      return action.data;

    default:
      return prevState;
  }
}
