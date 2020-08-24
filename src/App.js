import React from "react";
import { Router } from "react-router-dom";
import history from "@utils/history";

import Layout from "./layouts";
// 引入重置样式（antd已经重置了一部分了）
import "./assets/css/reset.css";

// 国际化导入的组件
import { IntlProvider } from "react-intl";
// 导入语言包
import { zh, en } from "./locales";
// 导入connect
import { connect } from "react-redux";

// 导入antd中提供的语言包，其antd组件可更改国际化语言
import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";
import enCN from "antd/es/locale/zh_CN";

function App(props) {
  // local为当前语言环境
  const local = props.intl;
  // 根据当前用户语言环境，选择的语言包
  const message = local === "en" ? en : zh;

  // 定义当前所应用的ANTD国际化语言包
  const antdLocale = local === "en" ? enUS : enCN;
  return (
    <Router history={history}>
      {/*configProvider 插入antd国际化语言包，其更改是由当前window对象中的language来判定的 */}
      <ConfigProvider locale={antdLocale}>
        {/* 国际化组件，包裹项目最外层组件 */}
        {/* locale:表示当前语言环境
        message：表示当前使用的语言包
      */}
        <IntlProvider locale={local} messages={message}>
          <Layout />
        </IntlProvider>
      </ConfigProvider>
    </Router>
  );
}

export default connect((state) => ({ intl: state.intl }))(App);
