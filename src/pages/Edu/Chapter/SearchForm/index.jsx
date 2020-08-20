import React, { useEffect } from "react";
import { Form, Select, Button } from "antd";
import { connect } from "react-redux";

import { getCourseList, getChapterList } from "../redux";

import "./index.less";

const { Option } = Select;

function SearchForm(props) {
  const [form] = Form.useForm();

  const resetForm = () => {
    form.resetFields();
  };

  const searchAllCourseList = () => {};
  const onFinish = (value) => {
    props.getChapterList(value.courseId);
  };

  useEffect(() => {
    props.getCourseList();
  }, []);

  // 课程ID courseId
  return (
    <Form layout="inline" form={form} onFinish={onFinish}>
      <Form.Item name="courseId" label="课程">
        <Select
          allowClear
          placeholder="课程"
          style={{ width: 250, marginRight: 20 }}
        >
          {props.courseList.map((item) => (
            <Option value={item._id} key={item._id}>
              {item.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
          onClick={searchAllCourseList}
        >
          查询课程章节
        </Button>
        <Button onClick={resetForm}>重置</Button>
      </Form.Item>
    </Form>
  );
}

export default connect(
  (state) => ({ courseList: state.chapterList.allCourseList }),
  { getCourseList, getChapterList }
)(SearchForm);
