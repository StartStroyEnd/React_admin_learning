import React, { Component } from "react";
import { connect } from "react-redux";
import { getUserInfo, getUserMenu } from "./redux";

@connect((state) => ({ user: state.user }), { getUserInfo, getUserMenu })
class Authorized extends Component {
  async componentDidMount() {
    // 挂载后发送请求
    await Promise.all([this.props.getUserInfo(), this.props.getUserMenu()]);
  }

  render() {
    // 通过redux传递到组件以后从中获取到（在index的render函数中，Authorized的render参数传递给PrimaryLayout组件的，都可通过props获取）
    return this.props.render(this.props.user);
  }
}

export default Authorized;
