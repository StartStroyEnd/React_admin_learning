import React, { Component } from "react";
import { Card, Input, Form, Button, Switch, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

// 导入外部封装的视频上传
import MyUpload from "@comps/Upload";
import { addLesson } from "../../../../api/edu/lesson";

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

export default class index extends Component {
  // 新增课时的表单校验（视频，课时名，免费？）
  onFinish = async (values) => {
    // console.log(values);
    // 解构表单中的values下的3个属性
    const { title, free, video } = values;

    // 获取当前项的ID，通过this.props来找到当前项的ID（params参数）
    const chapterId = this.props.location.state._id;


    const data = {
      chapterId,
      title,
      free,
      video,
    };

    await addLesson(data);
    // 提示提交成功（表单校验通过）
    message.success("课时添加成功！！！！！");
    // 返回课时列表页面
    this.props.history.push("/edu/chapter/list");
  };
  render() {
    return (
      <Card
        title={
          <>
            <Link to="/edu/chapter/list">
              <ArrowLeftOutlined />
            </Link>
            <span style={{ marginLeft: 10 }}>新增课时</span>
          </>
        }
      >
        <Form
          {...layout}
          name="chapter"
          // 表单校验通过了就会触发
          onFinish={this.onFinish}
          // onFinishFailed={onFinishFailed}

          // 给表单里面中的表单项添加默认值：
          initialValues={{
            // lessonname: "课程名称",
            // 想设置哪一个表单项就配置哪一个表单项
            free: true,
          }}
        >
          {/* 课时名称输入框 */}
          <Form.Item
            label="课时名称"
            name="title"
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

          {/* 是否免费开关按钮 */}
          <Form.Item
            label="是否免费"
            valuePropName="checked"
            name="free"
            rules={[
              {
                required: true,
                message: "请选择是否免费",
              },
            ]}
          >
            {/* switch的值是checked属性控制的，但是FORM.ITEM组件默认控制表单项的value属性
            由于Switch没有value属性，则会报错

            解决方式：告知Form.Item组件当前以checked属性来控制
              valuePropName="checked"
            */}
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              defaultChecked
            />
          </Form.Item>

          {/* 上传视频按钮 */}
          <Form.Item
            label="上传视频"
            name="video"
            rules={[
              {
                required: true,
                message: "请选择视频文件",
              },
            ]}
          >
            {/* ...props是antd自带的上传文件的服务器,我们使用cdn */}
            {/* <Upload {...props}> */}
            {/* 将视频上传抽取到components下的Upload文件夹下 */}
            {/* 当我们抽取出去以后，报错将消失，因为这将不再是一个表单项了 */}

            {/* 注意：当前是我们自定义的组件来上传的视频，并非antd自带的上传实现的，底层自动实现onChange属性。
              则我们需要手动去实现这个功能，否则无法通过提交校验
            */}
            <MyUpload></MyUpload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}
