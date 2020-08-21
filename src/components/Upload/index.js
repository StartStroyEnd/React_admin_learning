import React, { Component } from "react";
import { Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { reqGetUploadToken } from "@api/edu/upload";

import * as qiniu from "qiniu-js";
import { nanoid } from "nanoid";

export default class MyUpload extends Component {
  // 组件构造器，从本地缓存中，获取uploadToken
  constructor() {
    super();
    // 从本地缓存中获取uploadToken
    // 如果第一次上传，本地localStorage中没有token
    // 直接给this.tokenObj = {}
    // 如果之前存储过， 赋值给存储的那个token

    // 从本地缓存中查找token凭证，无则请求，有则上传(token超时判断)
    const jsonStr = localStorage.getItem("uploadToken") || "";
    // 判断当前是否存在
    if (jsonStr) {
      this.tokenObj = JSON.parse(jsonStr);
    }
    this.tokenObj = {};
  }

  // 上传之前的钩子函数,主要获取的是从当前本地服务器从七牛云中获取到的tonken
  // 通过token来判断是否能够上传，有这个token，会返回一个成功的promise
  handleBeforUpload = (file, fileList) => {
    console.log(file);

    // 判断当前上传的视频大小是否合理
    const MAX_SIZE = 20 * 1024 * 1024;

    return new Promise(async (resolve, reject) => {
      // 文件的大小：file.size
      if (file.size > MAX_SIZE) {
        message.warn("对不起！视频过大，请不要上传大于20M的视频！");
        reject();
      }

      // 判断this.tokenObj里面的expires值（保存时间）是否过期
      // 过期则发送请求，没有则不发
      // 判断当前expires超时时间是否过期
      // 1、不直接存储7200，计算截止时间
      // 存储时，当前时间 + 7200 * 1000
      // 2、将截止时间保存在本地缓存中，当

      // 如果截止时间，比当前发送请求之前的时间大，则token还有效范围
      if (this.tokenObj.expires && this.tokenObj.expires > Date.now()) {
        return resolve();
      }
      // 给本地服务器发送请求，获取七牛云token
      const res = await reqGetUploadToken();

      // 注意：res.expores是一个有限时间
      // 为保证绝对有限期，这个token有效期决定者为七牛云，我们发送请求和接收信息
      // 是有延迟的，我们则需要 - 2 * 60 = 120秒
      res.expires = Date.now() + res.expires * 1000 - 2 * 60;

      // 拿到上传的token和过期时间都要存储
      // 一个存储在组件中，一个存储在缓存中
      this.tokenObj = res;
      // localStorage中存储
      const jsonStr = JSON.stringify(res);
      localStorage.setItem("uploadToken", jsonStr);

      resolve();
    });
  };
  // 当上传之前的钩子函数返回成功的promise或者true以后
  // 会执行这个自定义上传的回调

  // const observable = qiniu.upload(file, key, token, putExtra, config);
  // const subscription = observable.subscribe(observer); // 上传开始
  // // or
  // const subscription = observable.subscribe(next, error, complete); // 这样传参形式也可以
  // subscription.unsubscribe(); // 上传取消
  // 上传执行的回调：
  handleCustomRequest = ({ file, onProgress, onError, onSuccess }) => {
    const observer = {
      // 正在上传
      // 该next方法会持续触发，更新上传进度
      next(res) {
        // ...
        // 注意：
        // antd中upload组件如果想要展示进度条必须调用onProgresss(传入res.total中的percent值)
        onProgress({ percent: res.total.percent });
      },
      // 上传失败
      error(err) {
        // ...
        // 当上传失败的时候，将其错误信息给到这个方法中去自己展示
        onError(err);
        if (err.code === 400) {
          message.warn("上传失败,您的视频格式出错！");
        }
      },
      // 上传完成
      // 上传成功时，将上传成功以后的提示信息样式反馈
      complete: (res) => {
        // ...
        onSuccess(res);

        // 当提交按钮触发时，会对当前上传进行校验，但是这并非为antd上传
        // 手动实现：
        // res中的key属性则是当前修改后的文件名，而这个文件名又是通过nanoid进行转换的
        this.props.onChange(`http://qfeho9xkb.hn-bkt.clouddn.com/${res.key}`);
      },
    };
    // 要上传的文件对象
    // const file = file;
    // const file = options.file;
    // 返回一个长度为10 的唯一值
    const key = nanoid(10);
    // 上传凭证
    const token = this.tokenObj.uploadToken;
    // 配置项：z2上传为华南区（cdn加速）
    const config = {
      region: qiniu.region.z2,
    };
    const putExtra = {
      // 设置上传文件的格式，当前设置为所有类型的视频
      mimeType: "video/*",
    };

    const observable = qiniu.upload(file, key, token, putExtra, config);
    //
    this.subscription = observable.subscribe(observer); // 上传开始
  };

  // 当注销挂载以后，取消上传
  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  // 撤销视频添加提交表单：
  handleRemove = () => {
    this.props.onChange("")
  }

  render() {
    return (
      <Upload
        beforeUpload={this.handleBeforUpload}
        customRequest={this.handleCustomRequest}
        // 当删除上传视频的时候触发
        onRemove={this.handleRemove}
      >
        <Button>
          <UploadOutlined /> 点击上传视频
        </Button>
      </Upload>
    );
  }
}
