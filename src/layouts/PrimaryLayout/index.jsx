import React, { Component } from "react";
import { Layout, Menu, Dropdown, Breadcrumb } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  GlobalOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import SiderMenu from "../SiderMenu";
import { AuthorizedRouter } from "@comps/Authorized";
import { logout } from "@redux/actions/login";
import { resetUser } from "../../components/Authorized/redux";
import logo from "@assets/images/logo.png";
import { findPathIndex } from "@utils/tools";

// 引入组件公共样式
import "@assets/css/common.less";
import "./index.less";

// 由于当前没有发送异步请求，而当前同步存储的国际化方法中，不能使用dispatch
// 测试当前connect底层是否封装了出力同步方法的reducer触发
import { setIntl } from "@redux/actions/intl";

const { Header, Sider, Content } = Layout;

@connect(
  (state) => ({
    user: state.user,
    // 使用connect传入当前实例中的props
    intl: setIntl.intl,
  }),
  {
    logout,
    resetUser,
    // 使用connect传入当前实例中的props
    setIntl,
  }
)
@withRouter //写法相当于 connect () (withRouter(primaryLayout))最终导出
class PrimaryLayout extends Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logout = ({ key }) => {
    if (key !== "2") return;
    this.props.logout().then(() => {
      localStorage.removeItem("user_token");
      this.props.resetUser();
      this.props.history.replace("/login");
    });
  };

  menu = (
    <Menu style={{ width: 150 }} onClick={this.logout}>
      <Menu.Item key="0">
        <Link to="/account/list">
          <UserOutlined />
          个人中心
        </Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link to="/account/settings">
          <SettingOutlined />
          个人设置
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  selectRoute = (routes = [], pathname) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route.path === pathname) {
        return route;
      }
      const children = route.children;

      if (children && children.length) {
        for (let j = 0; j < children.length; j++) {
          const item = children[j];
          // 跳过4级菜单
          if (!item.path) continue;

          let path = route.path + item.path;
          /*
            path: /acl/role/list
              --> /acl/role
            pathname: /acl/role/auth/xxx  
          */
          const index = findPathIndex(path, "/");
          path = path.slice(0, index);
          if (pathname.indexOf(path) !== -1) {
            return {
              ...route,
              children: item,
            };
          }
        }
      }
    }
  };

  renderBreadcrumb = (route) => {
    if (this.props.location.pathname === "/") {
      return (
        <Breadcrumb>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
        </Breadcrumb>
      );
    }

    if (!route) return;

    return (
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">首页</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{route.name}</Breadcrumb.Item>
        <Breadcrumb.Item>{route.children.name}</Breadcrumb.Item>
      </Breadcrumb>
    );
  };
  // toggleIntl回调
  toggleIntl = (options) => {
    // 获取一个key，options形参中存储的就是点击以后的语言的key（zh或者en）
    // 测试结果为：
    // connect有自带封装actions中的同步方法获取dispatch
    const key = options.key;

    // 在这里准备操作redux，｛需要使用connect｝
    this.props.setIntl(key);
  };

  render() {
    const { collapsed } = this.state;
    const {
      routes,
      user,
      location: { pathname },
    } = this.props;

    const route = this.selectRoute(routes, pathname);

    const intlMenu = (
      // selectedKeys 控制当前旋转偶读语言高亮
      // onClick      点击item时触发
      <Menu selectedKeys={[this.props.intl]} onClick={this.toggleIntl}>
        <Menu.Item key="zh">中文</Menu.Item>
        <Menu.Item key="en">English</Menu.Item>
      </Menu>
    );

    return (
      <Layout className="layout">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="logo">
            <img src={logo} alt="logo" />
            <h1 style={{ display: collapsed ? "none" : "block" }}>
              硅谷教育管理系统
            </h1>
          </div>
          <SiderMenu routes={routes} defaultOpenKey={route && route.path} />
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-header">
            <span className="site-layout-container">
              {React.createElement(
                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: this.toggle,
                }
              )}
              <span className="site-layout-right">
                <Dropdown overlay={this.menu}>
                  <span className="site-layout-user">
                    <img src={user.avatar} alt="avatar" />
                    <span>{user.name}</span>
                  </span>
                </Dropdown>
                <Dropdown overlay={intlMenu}>
                  <span className="site-layout-lang">
                    <GlobalOutlined />
                  </span>
                </Dropdown>
              </span>
            </span>
          </Header>
          <Content className="site-layout-background">
            <div className="site-layout-header-wrap">
              {this.renderBreadcrumb(route)}
              <h3>{route && route.children && route.children.name}</h3>
            </div>
            <div className="site-layout-content-wrap">
              <AuthorizedRouter routes={routes} />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default PrimaryLayout;
