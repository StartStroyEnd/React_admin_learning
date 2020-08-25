import React, { Component } from "react";

import { Card, Button, DatePicker } from "antd";
// 导入时间moment包
import moment from "moment";

const { RangePicker } = DatePicker;

// 带页签的card的数据源
const tabListNoTitle = [
  {
    key: "Scales",
    tab: "销售量",
  },
  {
    key: "Visit",
    tab: "访问量",
  },
];

const contentListNoTitle = {
  Scales: <p>article content</p>,
  Visit: <p>app content</p>,
};

export default class Scales extends Component {
  state = {
    noTitleKey: "Scales",
    dateFlag: "day",
    rangTime: [moment(), moment()],
  };

  // 按钮的点击事件
  handleBtnClick = (flag) => () => {
    let rangTime = null;

    switch (flag) {
      case "day":
        rangTime = [moment(), moment()];
        break;
      case "week":
        rangTime = [moment(), moment().add(7, "d")];
        break;
      case "month":
        rangTime = [moment(), moment().add(1, "M")];
        break;
      case "year":
        rangTime = [moment(), moment().add(1, "y")];
        break;
    }

    this.setState({
      dateFlag: flag,
      rangTime,
    });
  };

  // 时间改变时的回调
  changeRangTime = (date, dateStr) => {
    this.setState({
      rangTime: date,
    });
  };

  // 页签切换的回调函数
  onTabChange = (key) => {
    // 这个key是我们点击的时候所在的那个页签的key的键值
    this.setState({
      noTitleKey: key,
      dataFlag: "day",
    });
  };

  render() {
    const Extra = (
      <>
        <Button
          type={this.state.dataFlag === "day" ? "link" : "text"}
          onClick={this.handleBtnClick("day")}
        >
          今日
        </Button>
        <Button
          type={this.state.dataFlag === "week" ? "link" : "text"}
          onClick={this.handleBtnClick("week")}
        >
          本周
        </Button>
        <Button
          type={this.state.dataFlag === "month" ? "link" : "text"}
          onClick={this.handleBtnClick("month")}
        >
          本月
        </Button>
        <Button
          type={this.state.dataFlag === "year" ? "link" : "text"}
          onClick={this.handleBtnClick("year")}
        >
          本年
        </Button>
        <RangePicker
          value={this.state.rangTime}
          onChange={this.changeRangTime}
        ></RangePicker>
      </>
    );

    return (
      <div>
        <Card
          style={{ width: "100%" }}
          // 定义页标签
          tabList={tabListNoTitle}
          // 当先页签的高亮显示
          activeTabKey={this.state.noTitleKey}
          // 决定右侧额外部分的页签点击功能
          tabBarExtraContent={Extra}
          // 切换页签的回调函数
          onTabChange={this.onTabChange}
        >
          {contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    );
  }
}
