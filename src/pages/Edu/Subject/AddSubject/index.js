import React, { Component } from "react";
import { Card, Input, Select, Form, Button, Divider, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { reqGetSubject, reqAddSubject } from "@api/edu/subject";

const layout = {
  // antd把一个宽度分为24份
  // 表单文字描述部分
  labelCol: {
    span: 3,
  },
  // 表单项部分
  wrapperCol: {
    span: 6,
  },
};

// onFinishFailed = () => {

// }

export default class index extends Component {
  // 请求分页数据，不是所有数据
  // 第二页数据要拼接在第一页数据后面，不是原来redux逻辑中第二页数据覆盖第一页
  // 直接在组件中发送请求

  state = {
    total: 0,
    items: [],
  };

  // 存储当前获取的是第几页
  page = 1;

  // 直接引入api接口函数，直接在组件中发送请求，
  async componentDidMount() {
    const res = await reqGetSubject(this.page++, 10);
    this.setState(res);
  }

  handleGetSubject = async () => {
    const res = await reqGetSubject(this.page++, 10);
    const newItems = [...this.state.items, ...res.items];

    this.setState({
      items: newItems,
    });
  };

  onFinish = async (values) => {
    const title = values.subjectname;
    const parentId = values.parentid;
    await reqAddSubject(title, parentId);
    message.success("添加课程分类成功~~~~~~~~");

    this.props.history.push("/edu/subject/list");
  };

  render() {
    return (
      <Card
        title={
          <>
            <Link to="/edu/subject/list">
              <ArrowLeftOutlined />
            </Link>
            <span style={{ marginLeft: 10 }}>新增课程</span>
          </>
        }
      >
        <Form
          {...layout}
          name="subject"
          // 表单校验通过了就会触发
          onFinish={this.onFinish}
          // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="课程分类名称"
            name="subjectname"
            rules={[
              {
                // 必填
                required: true,
                // 表单校验不成功
                message: "请输入课程分类!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="父级分类id"
            name="parentid"
            rules={[
              {
                required: true,
                message: "请选择分类id",
              },
            ]}
          >
            <Select
              dropdownRender={(menu) => {
                return (
                  <div>
                    {menu}
                    <Divider style={{ margin: "4px 0" }}></Divider>
                    {this.state.total <= this.state.items.length ? (
                      <span style={{ color: "skyblue" }}>
                        "没有更多的数据了！"
                      </span>
                    ) : (
                      <Button type="link" onClick={this.handleGetSubject}>
                        点击加载更多数据
                      </Button>
                    )}
                  </div>
                );
              }}
            >
              {/* 注意：Option是Select的子标签 */}
              <Select.Option value={0} key={0}>
                {"一级菜单"}
              </Select.Option>

              {this.state.items.map((item) => (
                <Select.Option value={item._id} key={item._id}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}
