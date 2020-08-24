// 实现国际化的actions

import { SET_INTL } from "../constants/intl";

// 形参接受语言环境
export function setIntl(data) {
  return { type: SET_INTL, data };
}
