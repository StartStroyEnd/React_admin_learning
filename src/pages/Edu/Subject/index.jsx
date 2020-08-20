import React, { Component } from "react";
import { Button, Table, Tooltip, Input, message, Modal } from "antd";
import { PlusOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";

import {
  getSubjectList,
  getSecSubjectList,
  updateSubjectList,
  delSubjectList,
} from "./redux";
import { connect } from "react-redux";
// import { reqUpdateSubject, reqDelSubject } from "@api/edu/subject";

import "./index.less";

@connect((state) => ({ subjectList: state.subjectList }), {
  getSubjectList,
  getSecSubjectList,
  updateSubjectList,
  delSubjectList,
})
class Subject extends Component {
  state = {
    subjectId: "",
    title: "",
  };
  componentDidMount() {
    this.props.getSubjectList(1, 10);
  }
  handleChnage = (page, limit) => {
    // 将当前页码保存到当前实例
    this.page = page;

    this.props.getSubjectList(page, limit);
  };
  // handlePageSizeChange = (page, limit) => {
  //   this.props.getSubjectList(page, limit);
  // };
  // getSecSubjectList
  handleSubject = (expanded, record) => {
    if (expanded) {
      this.props.getSecSubjectList(record._id);
    }
  };
  handleToAdd = () => {
    this.props.history.push("/edu/subject/add");
  };

  // 删除课程分类！
  deleteHandle = (record) => () => {
    Modal.confirm({
      title: (
        <div>
          您确定要删除
          <span style={{ color: "skyblue", margin: "0 10px" }}>
            {record.title}
          </span>
          这个课程分类吗？
        </div>
      ),
      onOk: async () => {
        await this.props.delSubjectList(record._id);
        message.success("删除成功！！！！！！！！！");

        // this.props.getSubjectList(1, 10);
        if (record.parentId === "0") {
          if (
            this.page > 1 &&
            this.props.subjectList.items.length <= 0 &&
            record.parentId === "0"
          ) {
            this.props.getSubjectList(--this.page, 10);
            return;
          }
        }
      },
    });
  };

  // 更新按钮的回调
  handleUpdate = ({ _id, title }) => () => {
    this.setState({
      subjectId: _id,
      title,
    });
    this.title = title;
  };
  // 当修改时，表单内容赋值
  handleUpdateChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  // 修改数据时点击取消按钮
  cancleHandle = () => {
    this.setState({
      subjectId: "",
      title: "",
    });
  };

  // 修改数据时点击确认按钮
  // reqUpdateSubject
  enterUpdataHandle = async () => {
    if (!this.state.title.trim()) {
      message.error("请输入正确的标题名称！");
      return;
    }

    if (this.title === this.state.title) {
      message.error("新的课程名称不能与原课程名称一样！");
      return;
    }

    let id = this.state.subjectId;
    let title = this.state.title;

    await this.props.updateSubjectList(id, title);

    message.success("数据已成功更新~~~~~~~~~~");
    this.setState({
      subjectId: "",
      title: "",
    });
    // this.props.getSubjectList(1, 10);
  };

  render() {
    // coluns里面的数据要动态变化，所以要放到rander函数中
    const columns = [
      // { title: "分类名称", dataIndex: "title", key: "name" ,
      {
        title: "分类名称",
        key: "name",

        render: (record) => {
          if (this.state.subjectId === record._id) {
            return (
              <Input
                style={{ width: 260 }}
                value={this.state.title}
                onChange={this.handleUpdateChange}
              ></Input>
            );
          } else {
            return record.title;
          }
        },
      },
      {
        title: "操作",
        key: "x",
        render: (record) => {
          if (this.state.subjectId === record._id) {
            return (
              <>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={this.enterUpdataHandle}
                >
                  确认
                </Button>
                <Button type="danger" onClick={this.cancleHandle}>
                  取消
                </Button>
              </>
            );
          }

          // tabel中暗含遍历的操作，其实是render对应每一项数据都会重新调用一次render
          // 该写为花括号return这个形参record可以获取到当前项的id
          return (
            <>
              <Tooltip title="更新课程">
                <Button
                  type="primary"
                  icon={<FormOutlined />}
                  style={{ marginRight: 20, width: 40 }}
                  onClick={this.handleUpdate(record)}
                ></Button>
              </Tooltip>
              <Tooltip title="删除课程">
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  style={{ width: 40 }}
                  onClick={this.deleteHandle(record)}
                ></Button>
              </Tooltip>
            </>
          );
        },
        width: 200,
      },
    ];
    return (
      <div className="subject">
        <Button
          onClick={this.handleToAdd}
          className="subject-btn"
          type="primary"
          icon={<PlusOutlined />}
        >
          新建
        </Button>
        <Table
          columns={columns}
          expandable={{
            // expandedRowRender: (record) => (
            //   <p style={{ margin: 0 }}>{record.description}</p>
            // ),
            // rowExpandable: (record) => record.name !== "Not Expandable",
            onExpand: this.handleSubject,
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
            current: this.page,
            defaultPageSize: 10,
          }}
        />
      </div>
    );
  }
}

export default Subject;
