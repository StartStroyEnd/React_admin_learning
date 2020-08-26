import React, { Component } from "react";
import { connect } from "react-redux";
import { loginSuccessSync } from "@redux/actions/login";

@connect(null, { loginSuccessSync })
class Oauth extends Component {
  componentDidMount() {
    // 获取请求所返回的token，保存在当前实例中
    // 从请求的参数中拿到token字符
    const token = this.props.location.search.split("=")[1];

    // 将token存储到redux中
    this.props.loginSuccessSync({ token });

    // 将token存储到本地缓存中
    localStorage.setItem("user_token", token);

    this.props.history.replace("/");
  }

  render() {
    return <div>正在授权</div>;
  }
}

export default Oauth;
