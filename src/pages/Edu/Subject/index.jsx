import React, { Component } from "react";
import { Button, Table, Tooltip } from "antd";
import { PlusOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";

import { getSubjectList, getSecSubjectList } from "./redux";
import { connect } from "react-redux";

import "./index.less";

const columns = [
  { title: "分类名称", dataIndex: "title", key: "name" },
  {
    title: "操作",
    key: "x",
    render: () => (
      <>
        <Tooltip title="更新课程">
          <Button
            type="primary"
            icon={<FormOutlined />}
            style={{ marginRight: 20, width: 40 }}
          ></Button>
        </Tooltip>
        <Tooltip title="删除课程">
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            style={{ width: 40 }}
          ></Button>
        </Tooltip>
      </>
    ),
    width: 200,
  },
];

const data = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
  },
  {
    key: 3,
    name: "Not Expandable",
    age: 29,
    address: "Jiangsu No. 1 Lake Park",
    description: "This not expandable",
  },
  {
    key: 4,
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.",
  },
];

@connect((state) => ({ subjectList: state.subjectList }), { getSubjectList,getSecSubjectList })
class Subject extends Component {
  componentDidMount() {
    this.props.getSubjectList(1, 10);
  }
  handleChnage = (page, limit) => {
    this.props.getSubjectList(page, limit);
  };
  // handlePageSizeChange = (page, limit) => {
  //   this.props.getSubjectList(page, limit);
  // };
  // getSecSubjectList
  expandHandle = (expanded, record) => {
    if (expanded) {
      this.props.getSecSubjectList(record._id);
    }
  };

  render() {
    return (
      <div className="subject">
        <Button className="subject-btn" type="primary" icon={<PlusOutlined />}>
          新建
        </Button>
        <Table
          columns={columns}
          expandable={{
            // expandedRowRender: (record) => (
            //   <p style={{ margin: 0 }}>{record.description}</p>
            // ),
            // rowExpandable: (record) => record.name !== "Not Expandable",
            onExpand: this.expandHandle,
          }}
          dataSource={this.props.subjectList.items}
          rowKey={"_id"}
          pagination={{
            // 表示总共有多少条数据, pagination,底层默认一页是10条数据,所以数据是30条,就分3页
            total: this.props.subjectList.total,
            // 是否展示一页展示几条数据的修改项
            showSizeChanger: true,
            // 控制一页展示几条的选项
            pageSizeOptions: ["5", "10", "15"],
            // 展示快速跳转到那一页
            showQuickJumper: true,
            // defaultPageSize: 5,
            onChange: this.handleChnage,
            // onChange: this.handlePageSizeChange,
          }}
        />
      </div>
    );
  }
}

export default Subject;
