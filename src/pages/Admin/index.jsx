import React, { Component } from "react";

import Scales from "./Scales";

// 分析组件
import Analysis from "./Analysis";
import Static from "./Static";

export default class Admin extends Component {
  render() {
    return (
      <div>
        <Analysis></Analysis>
        <Scales></Scales>
        <Static></Static>
      </div>
    );
  }
}
