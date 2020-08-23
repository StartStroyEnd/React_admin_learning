import React, { Component } from "react";
import { Button, message, Tooltip, Modal, Alert, Table } from "antd";
import {
  FullscreenOutlined,
  RedoOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

import { connect } from "react-redux";
import SearchForm from "./SearchForm";

import "./index.less";
import { getLessonList, delChapterList, delLessonList } from "./redux";

// 导入知乎的弹出框视频
import Player from "griffith";

// 导入全屏插件
import screenfull from "screenfull";

dayjs.extend(relativeTime);

@connect(
  (state) => ({
    // courseList: state.courseList
    // permissionValueList: filterPermissions(
    //   state.course.permissionValueList,
    //   "Course"
    // )

    chapterList: state.chapterList.chapterList,
  }),
  { getLessonList, delChapterList, delLessonList }
  // { getcourseList }
)
class Chapter extends Component {
  state = {
    searchLoading: false,
    previewVisible: false,
    previewImage: "",
    selectedRowKeys: [],
    play_url: "",
  };

  showImgModal = (img) => {
    return () => {
      this.setState({
        previewVisible: true,
        previewImage: img,
      });
    };
  };

  handleImgModal = () => {
    this.setState({
      previewVisible: false,
    });
  };

  componentDidMount() {
    // const { page, limit } = this.state;
    // this.handleTableChange(page, limit);
  }

  handleTableChange = (page, limit) => {
    this.setState({
      tableLoading: true,
    });

    this.getcourseList({ page, limit }).finally(() => {
      this.setState({
        tableLoading: false,
        page,
        limit,
      });
    });
  };

  getcourseList = ({ page, limit, Coursename, nickName }) => {
    return this.props
      .getcourseList({ page, limit, Coursename, nickName })
      .then((total) => {
        if (total === 0) {
          message.warning("暂无用户列表数据");
          return;
        }
        message.success("获取用户列表数据成功");
      });
  };

  onSelectChange = (selectedRowKeys) => {
    this.setState({
      // 存储的是当前选中项的唯一标识，按点击顺序存储
      selectedRowKeys,
    });
  };

  // 获取课时数据的事件处理函数
  handleGetLesson = (expand, record) => {
    if (expand) {
      this.props.getLessonList(record._id);
    }
  };

  // 点击跳转到新增课时页面
  addLessonHandle = (data) => () => {
    this.props.history.push("/edu/chapter/addLesson", data);
  };

  // 点击预览按钮，展图片
  handlePreviewVideo = (record) => () => {
    this.setState({
      previewVisible: true,
      // 保存当前项的视频地址到state对象中
      play_url: record.video,
    });
  };

  // 批量删除的回调
  handleBatchRemove = async () => {
    // 1、从selectedRowKeys中去找到哪些是章节，哪些是课时的标识
    // 2、遍历所有项（章节标识），从selectedRowKeys去查找当前是否有标识存在于所有章节中，那个这标识就是章节ID
    // 拿到所有章节数据后，遍历章节，

    // 创建一个数组用来存储要删除的章节或者课时id
    const chapterIdList = [];

    // 遍历redux中的所有章节标识_id
    this.props.chapterList.forEach((item) => {
      // 判断当前存储到selectedRowKeys里的所有标识，是否是章节ID
      // 是的话则过滤掉，返回一个新数组
      if (this.state.selectedRowKeys.indexOf(item._id) > -1) {
        // 往临时数组中添加选中的章节项标识
        chapterIdList.push(item._id);
      }
    });

    // 课时判断
    // 将要删除的课时，存放到一个新的数组
    // 再次遍历当前选中的所有的标识中是否存在于章节标识下，若存在则过滤掉
    const lessonIdList = this.state.selectedRowKeys.filter((item) => {
      if (chapterIdList.indexOf(item) > -1) {
        return false;
      }
      return true;
    });

    await this.props.delChapterList(chapterIdList);
    await this.props.delLessonList(lessonIdList);
    message.success("批量删除成功！");
  };

  render() {
    const { previewVisible, previewImage, selectedRowKeys } = this.state;

    const columns = [
      {
        title: "章节名称",
        dataIndex: "title",
      },
      {
        title: "是否免费",
        dataIndex: "free",
        render: (isFree) => {
          return isFree === true ? "是" : isFree === false ? "否" : "";
        },
      },
      {
        title: "视频",
        // dataIndex: "",
        render: (record) => {
          if (record.free) {
            return (
              <Button onClick={this.handlePreviewVideo(record)}>
                预览视频
              </Button>
            );
          }
          return null;
        },
      },
      {
        title: "操作",
        width: 200,
        fixed: "right",
        render: (data) => {
          // // 判断data 中是否有free属性
          // if ("free" in data) {
          return (
            <div>
              <Tooltip title="新增课时">
                {/* 这里的data就包含了当前项的id */}
                <Button type="primary" onClick={this.addLessonHandle(data)}>
                  <PlusOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="更新章节">
                <Button type="primary" style={{ margin: "0 10px" }}>
                  <FormOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="删除章节">
                <Button type="danger">
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </div>
          );
        },
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const sources = {
      hd: {
        play_url: this.state.play_url,
        bitrate: 1,
        duration: 1000,
        format: "",
        height: 500,
        size: 160000,
        width: 500,
      },
    };

    return (
      <div>
        <div className="course-search">
          <SearchForm />
        </div>
        <div className="course-table">
          <div className="course-table-header">
            <h3>课程章节列表</h3>
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                <PlusOutlined />
                <span>新增</span>
              </Button>
              <Button
                type="danger"
                style={{ marginRight: 10 }}
                onClick={this.handleBatchRemove}
              >
                <span>批量删除</span>
              </Button>
              <Tooltip title="全屏" className="course-table-btn">
                <FullscreenOutlined
                  onClick={() => {
                    // 点击全屏按钮触发全屏，再次点击无效，必须移动到屏幕上方点x
                    // screenfull.request();
                    // 再次点击全屏按钮关闭全屏
                    screenfull.toggle();
                  }}
                />
              </Tooltip>
              <Tooltip title="刷新" className="course-table-btn">
                <RedoOutlined />
              </Tooltip>
              <Tooltip title="设置" className="course-table-btn">
                <SettingOutlined />
              </Tooltip>
            </div>
          </div>
          {/* 这个组件是显示当前已经选择了多少项的组件 */}
          <Alert
            message={
              <span>
                <InfoCircleOutlined
                  style={{ marginRight: 10, color: "#1890ff" }}
                />
                {`已选择 ${selectedRowKeys.length} 项`}
              </span>
            }
            type="info"
            style={{ marginBottom: 20 }}
          />
          <Table
            // rowSelection为当前点击以后的单选框
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.props.chapterList}
            rowKey="_id"
            expandable={{
              // 获取章节内部数据<children>
              onExpand: this.handleGetLesson,
            }}
          />
        </div>

        <Modal
          // 直接使用这个modal去预览视频
          visible={previewVisible}
          footer={null}
          onCancel={this.handleImgModal}
          // 关闭弹出框以后，视频将不再后台运行
          // Modal关闭时，销毁子节点！
          destroyOnClose={true}
          // 添加title属性解决模态框弹出的关闭按钮被遮掩问题
          title="预览"
        >
          <Player
            sources={sources}
            id={"1"}
            cover={"http://localhost:3000/logo512.png"}
            duration={1000}
          ></Player>

          {/* <img alt="example" style={{ width: "100%" }} src={previewImage} /> */}
        </Modal>
      </div>
    );
  }
}

export default Chapter;
