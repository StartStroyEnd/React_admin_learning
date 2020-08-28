import React, { Component, Suspense } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  GlobalOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

import SiderMenu from "../SiderMenu";

import "./index.less";

import logo from "@assets/images/logo.png";
import { connect } from "react-redux";
import { withRouter, Route } from "react-router-dom";
import components from "@conf/asyncComps";

import { defaultRoutes } from "@conf/routes";

// 解决报错

const { Header, Content, Footer, Sider } = Layout;
@withRouter
@connect((state) => ({
  user: state.user,

}))
class PrimaryLayout extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  // 将permissionList数据，转换成Route组件的函数
  // 将defaultRoutes转成Route
  renderRoute = (routes, path) => {
    // 遍历routes,遍历过程中，判断component数学是否幼稚，如果有值，就渲染安route
    // 如果没有就不渲染
    return routes.map((item) => {
      // 这个if判断的是 一级  有就渲染
      // 比如首页，component有值就渲染一个route
      // permissonList
      if (item.component) {
        // 获取对应组件
        const myComponent = components[item.component]();

        console.log("组件获取：", myComponent);

        // 这里的item.component获取到的不是一个组件，而是一个函数
        // 当我们在调用这个函数的时候，才会创建这个组装件
        // 返回route，如果还有子组，还要遍历子组
        return (
          // 如果这里执行的时候，渲染的是children里面的数据，那么path的路径应该是一级path + 二级三级path
          // 因为children数组中，只存在二三级path
          <Route
            // 当前路径
            path={path ? path + item.path : item.path}
            // 当前要显示的组件
            component={myComponent}
            // 精确匹配
            exact
            //
            key={item.path}
          ></Route>
        );
      }

      // 判断item 身上是哪个又没有children属性，也就是二级菜单
      // 有择渲染一这个对象下的这个组件
      if (item.children && item.children.length) {
        return this.renderRoute(item.children, item.path);
      }
    });
  };

  render() {
    // 从redux中提取数据
    const { name, avatar, permissionList } = this.props.user;

    // 1、获取地址栏路径
    const pathname = this.props.location.pathname;
    console.log(pathname);
    // /edu/subject/lisr
    // /
    // /account/settings

    // 创建正则匹配规则
    // 最后的g则为全局匹配，整个字符串中有多少个能匹配成功的就存入数组中
    const reg = /[/][\w]*/g;
    // 匹配当前路径
    const matchArr = pathname.match(reg);
    // 2、拼接路径，然后根据路径找到对应名称
    const firPath = matchArr[0];
    const secPath = matchArr[1];
    const thirPath = matchArr[2] || "";

    // 根据路径找name
    let FirstName;
    let SecName;
    // 若判断不通过,则不是首页,要判断当前一级或者二级name
    // 如果二级菜单存在，则提取那个对象数据中的name键值对获取当前的文本
    secPath &&
      // 遍历redux中的每一项数据，通过当前地址栏中的path地址匹配redux中的path路径
      permissionList.forEach((route) => {
        // 当两个路径相同时
        if (route.path === firPath) {
          // 将该项数据中的name属性赋值给当前临时变量中
          FirstName = route.name;

          //当一级的name获取到以后,它的children属性中,则为当前一级下的二级对象数据
          route.children.forEach((secRoute) => {
            // 同上
            if (secRoute.path === secPath + thirPath) {
              // 遍历每一项，匹配当前路径，成功则提取当前项的name属性值
              SecName = secRoute.name;
            }
          });
        }
        console.log(FirstName, SecName);
      });
    return (
      <Layout className="layout">
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo">
            <img src={logo} alt="" />
            {!this.state.collapsed && <h1>硅谷教育管理系统</h1>}
          </div>
          <SiderMenu></SiderMenu>
        </Sider>

        <Layout className="site-layout">
          <Header className="layout-header">
            <img src={avatar} alt="" />
            <span>{name}</span>
            <GlobalOutlined />
          </Header>
          <Content>
            <div className="layout-nav">
              {/* 判断当前又没有获取到一级数据中的name值,无则是首页,有的话就是一级二级列表 */}
              {!FirstName ? (
                <div>首页</div>
              ) : (
                <Breadcrumb>
                  {/* 展示name属性值 */}
                  <Breadcrumb.Item>{FirstName}</Breadcrumb.Item>
                  <Breadcrumb.Item>{SecName}</Breadcrumb.Item>
                </Breadcrumb>
              )}

              <h3>{SecName}</h3>
            </div>
            {/*  点击左侧导航栏，跳转 */}
            {/* <div className="layout-content">Bill is a cat.</div> */}
            <Suspense
              fallback={
                <h1 style={{ textAlign: "center", color: "skyblue" }}>
                  正在加载中.....
                </h1>
              }
            >
              {this.renderRoute(defaultRoutes)}
              {this.renderRoute(this.props.user.permissionList)}
            </Suspense>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default PrimaryLayout;
