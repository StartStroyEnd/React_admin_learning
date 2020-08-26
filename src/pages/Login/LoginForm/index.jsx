import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Tabs, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { login, mobilelogin } from "@redux/actions/login";

// 获取验证码
// 手机登录
import { reqGetVerifyCode } from "@api/acl/oauth";

import "./index.less";

const { TabPane } = Tabs;

// 密码校验：
const validator = (rule, value) => {
  // rule : 为当前表单（密码框）内的校验规则对象，一般不用
  // value :为当前表单项的输入的值，需要返回一个Promise对象，成功则校验通过，反之亦然
  return new Promise((resolve, reject) => {
    // 自己实现表单校验规则
    // 密码也是必填项
    value = value && value.trim();

    if (!value) {
      // 表示没有输入正确的密码
      return reject("请输入密码！");
    }
    // 长度要大于等于4才能接着校验
    if (value.length < 4) {
      return reject("密码不能小于4位哦~");
    }

    // 长度不能超过16为
    if (value.length > 16) {
      return reject("密码不能超过16位哦~");
    }

    // 密码的值也只能是数字字母下划线

    // 正则.test(字符串)  如果正则匹配成功，返回true否则返回false
    if (!/^[0-9A-Za-z_]+$/.test(value)) {
      return reject("您的密码格式有误(不能使用特殊符号)，请重新输入！");
    }
    return resolve();
  });
};

// 记录tab选中的是谁
// 若写在函数组件内，组件重新渲染时，tabFlag将会更改
let tabFlag = "user";

function LoginForm(props) {
  // form从数组中解构出来的
  const [form] = Form.useForm();
  // 类组件中不能调用调用useForm
  // 且在构造器中也不能使用，useForm必须在函数组件中使用
  // constructor() {
  //   super();
  //   const form = Form.useForm();
  // }

  // 监听tab切换的时间处理函数
  const handleTabChange = (key) => {
    tabFlag = key;
  };

  // 验证码发送成功以后倒计时
  let [downCount, setDownCount] = useState(5);
  let [isShowBtn, setIsShowBtn] = useState(true);

  const onFinish = () => {
    // 判断当前是用户密码登录还是手机登录
    // 根据判断的结果来验证对应的表单项
    // 校验通过，根据判断去调用对应的借口发送请求，实现登录
    if (tabFlag === "user") {
      form.validateFields(["username", "password"]).then((res) => {
        const { username, password } = res;
        props.login(username, password).then((token) => {
          // 登录成功！
          // 存储token
          localStorage.setItem("user_token", token);
          props.history.replace("/");
        });
      });
    } else {
      form.validateFields(["phone", "verify"]).then((res) => {
        const { phone, verify } = res;
        props.mobilelogin(phone, verify).then((token) => {
          // 登录成功
          localStorage.setItem("user_token", token);
          props.history.replace("/");
        });
      });
    }
  };

  // 获取验证码的时间处理函数！
  const handleGetCode = () => {
    // 在发送请求获取验证码之前，必须要先对手机号码进行校验
    // 而验证码的校验是交给后台服务器处理的
    // 1、在这个回调中，开发者需要拿到手机表单项的值，通过正则校验，通过发请求，反之亦然
    // 2、通过antd中提供的方式，触发antd中的Form组件提供的表单校验的功能，得到校验结果，通过发请求，反之亦然
    // 使用第二种方式：
    // 1、使用Form.useForm()得到一个表单实例对象(解构数格式为一个数组)
    // 2、将Form实例对象和我们下面的Form属性绑定起来，form={form}。
    // 3、调用form.valivalidateFields方法，写入实参，不写的话则是校验所有form表单数据。
    // validateFields(["这里写入的就是对应表单项目中name属性的属性值也就是需要校验的表单"])
    form
      .validateFields(["phone"])
      .then(async (res) => {
        // console.log(res);
        await reqGetVerifyCode(res.phone);
        message.success("验证码发送成功！");

        const timeId = setInterval(() => {
          setDownCount(--downCount);
          setIsShowBtn(false);
          if (downCount <= 0) {
            clearInterval(timeId);
            setDownCount(5);
            setIsShowBtn(true);
          }
        }, 1000);
      })
  };

  // git第三方登录
  const oauthLogin = () => {
    // 浏览器给服务器发送请求，获取code
    // 我的client_id  : 39493e47b39a73705233
    // 给location.href赋值为一个url时，会根据url发送请求
    // 并且只要是地址栏发的请求
    window.location.href =
      "https://github.com/login/oauth/authorize?client_id=39493e47b39a73705233";
  };

  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        // onFinish={onFinish}
        form={form}
      >
        <Tabs
          defaultActiveKey="user"
          tabBarStyle={{ display: "flex", justifyContent: "center" }}
          // 监听
          onChange={handleTabChange}
        >
          <TabPane tab="账户密码登录" key="user">
            <Form.Item
              name="username"
              // antd表单校验，只有通过以后才能触发onFinish
              rules={[
                {
                  // 必填项:true
                  required: true,
                  message: "请输入账户名",
                },
                // 设置
                {
                  max: 16,
                  message: "用户名长度不能超过16个字符！",
                },
                {
                  min: 4,
                  message: "用户名长度不能小于6个字符！",
                },
                {
                  pattern: /^[0-9A-Za-z_]+$/,
                  message: "密码格式为：数字字母下划线，不可使用特殊符号！",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined className="form-icon" />}
                placeholder="用户名: admin"
              />
            </Form.Item>
            {/* validator:validator回调” */}
            <Form.Item name="password" rules={[{ validator }]}>
              <Input
                prefix={<LockOutlined className="form-icon" />}
                type="password"
                placeholder="密码: 111111"
              />
            </Form.Item>
          </TabPane>
          <TabPane tab="手机号登录" key="phone">
            <Form.Item
              // 匹配的是这里的name属性，来找到当前需要校验的表单项
              name="phone"
              rules={[
                {
                  required: true,
                  message: "请输入手机号",
                },
                {
                  // ^以1开头\d:数字且后面为10位
                  pattern: /^1[\d]{10}$/,
                  message: "请确认手机号是否正确！",
                },
              ]}
            >
              <Input
                prefix={<MobileOutlined className="form-icon" />}
                placeholder="手机号"
              />
            </Form.Item>

            <Row justify="space-between">
              <Col span={16}>
                <Form.Item
                  name="verify"
                  rules={[
                    {
                      required: true,
                      message: "请输入验证码",
                    },
                    {
                      pattern: /^[\d]{6}$/,
                      message: "验证码为6位数字",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="form-icon" />}
                    placeholder="验证码"
                  />
                </Form.Item>
              </Col>
              <Col span={7}>
                {/* 这是一个普通的button  无论是否通过这里的回调都会执行 */}
                <Button
                  className="verify-btn"
                  onClick={handleGetCode}
                  disabled={isShowBtn ? false : true}
                >
                  {isShowBtn ? "获取验证码" : `${downCount}秒后重发`}
                </Button>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <Row justify="space-between">
          <Col span={7}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>自动登录</Checkbox>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Button type="link">忘记密码</Button>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            // 用户登录和手机登录用的都是同一个登录按钮.
            // 但是登录时,需要分开处理是用户登录还是手机登录
            // 所以要把登录按钮的htmlType='submit'去掉
            // htmlType="submit"
            className="login-form-button"
            onClick={onFinish}
          >
            登录
          </Button>
        </Form.Item>
        <Form.Item>
          <Row justify="space-between">
            <Col span={16}>
              <span>
                其他登录方式
                <GithubOutlined className="login-icon" onClick={oauthLogin} />
                <WechatOutlined className="login-icon" />
                <QqOutlined className="login-icon" />
              </span>
            </Col>
            <Col span={3}>
              <Button type="link">注册</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
}

export default withRouter(
  connect(null, {
    login,
    mobilelogin,
  })(LoginForm)
);
