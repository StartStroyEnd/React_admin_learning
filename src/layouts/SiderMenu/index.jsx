import React, { Component } from "react";
import { Menu } from "antd";
import { connect } from "react-redux";

// 导入所有字体图标对象
import icons from "@conf/icons";
// 导入defaultRoutes
import { defaultRoutes } from "@conf/routes";
import { Link, withRouter } from "react-router-dom";

const { SubMenu } = Menu;
@connect((state) => ({ permissionList: state.user.permissionList }))
// 用来获取路径
@withRouter
class SiderMenu extends Component {
  // 封装函数直接渲染
  // 数据源： defaultRoutes    REDUX里面的permisssionList
  renderMenu = (routes) => {
    // 判断数据的hidden是否为true，为true不渲染
    // map 方法，执行完毕以后，会根据数据生成的结构，只能在函数外部使用
    // 所以需要返回
    return routes.map((route) => {
      // 1、判断数据的hidden
      if (route.hidden) return;

      // 获取所有数据对应的字体图标：
      const Icon = icons[route.icon];

      // 判断当前数据有无二级菜单
      if (route.children && route.children.length) {
        // 有二级
        return (
          <SubMenu key={route.path} icon={<Icon />} title={route.name}>
            {/* <Menu.Item key="6">Team 1</Menu.Item> */}
            {/* <Menu.Item key="8">Team 2</Menu.Item> */}
            {route.children.map((SecItem) => {
              if (SecItem.hidden) return null;
              // return <Menu.Item key={SecItem.path}>{SecItem.name}</Menu.Item>;
              return (
                <Menu.Item key={SecItem.path}>
                  <Link to={route.path + SecItem.path}>{SecItem.name}</Link>
                </Menu.Item>
              );
            })}
          </SubMenu>
        );
      } else {
        // 只有一级
        return (
          <Menu.Item key={route.path} icon={<Icon />}>
            {/* {route.name} */}
            {/* <Link to="/">{route.name}</Link> */}
            {route.path === "/" ? <Link to="/">{route.name}</Link> : route.name}
          </Menu.Item>
        );
      }
    });
  };

  render() {
    // 获取当前路径来对应显示高亮
    const pathName = this.props.location.pathname;

    // 通过匹配当前地址栏的地址与之路由地址匹配/

    // 正则提取
    // + 一个或者多个
    const matchArr = pathName.match(/[/][a-z]+/);
    const openKey = matchArr && matchArr[0];

    // 正则匹配获取的路径的第一部分
    return (
      // 如果Menu.Item直接被Menu包裹，那么就只有一级
      // {/* 如果被SubMenu所包裹，那么就是二级 */}
      <Menu
        defaultOpenKeys={[openKey]}
        theme="dark"
        defaultSelectedKeys={[pathName]}
        mode="inline"
      >
        {this.renderMenu(defaultRoutes)}
        {this.renderMenu(this.props.permissionList)}
        {/* <Menu.Item key="1" icon={<PieChartOutlined />}>
          Option 1
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Option 2
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined />} /> */}
      </Menu>
    );
  }
}

export default SiderMenu;
