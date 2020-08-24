import React, { Component } from "react";
// 使用antd的栅格布局
import { Row, Col, Statistic, Progress } from "antd";

// 使用自定义的Card组件
import Card from "@comps/Card";

// 导入bizcharts
import { AreaChart, ColumnChart } from "bizcharts";

import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import "./index.less";

// 如果数据值不变，放到组件外面
// 然后数据需要动态渲染，一定要写入render中
// 定义响应式布局需求数据：(数字，对象，数组)
const firstRowCol = {
  xs: { span: 24 },
  md: { span: 12 },
  lg: { span: 6 },
};

// 数据源
const data = [
  { year: "1991", value: 3 },
  { year: "1992", value: 4 },
  { year: "1993", value: 3.5 },
  { year: "1994", value: 5 },
  { year: "1995", value: 4.9 },
  { year: "1996", value: 10 },
  { year: "1997", value: 7 },
  { year: "1998", value: 9 },
  { year: "1999", value: 25 },
];

// 图三数据源
const columnsdata = [
  {
    type: "家具家电",
    sales: 48,
  },
  {
    type: "粮油副食",
    sales: 52,
  },
  {
    type: "生鲜水果",
    sales: 61,
  },
  {
    type: "美容洗护",
    sales: 145,
  },
  {
    type: "母婴用品",
    sales: 48,
  },
  {
    type: "进口食品",
    sales: 58,
  },
  {
    type: "食品饮料",
    sales: 98,
  },
  {
    type: "家庭清洁",
    sales: 138,
  },
];

export default class index extends Component {
  render() {
    return (
      <div>
        {/* gutter值为数组时：
          第一个是水平方向间隔，第二个是崔志方向间隔 
          单位为像素
          */}
        <Row gutter={[16, 16]}>
          <Col {...firstRowCol}>
            <Card
              title={
                <Statistic
                  title="总销售额"
                  prefix="￥"
                  value={5656298}
                ></Statistic>
              }
              footer={"日销售额：￥15,418"}
            >
              <span>
                周同比 12%
                <CaretUpOutlined style={{ color: "red", marginRight: 10 }} />
              </span>
              <span>
                日同比 10%
                <CaretDownOutlined style={{ color: "green" }} />
              </span>
            </Card>
          </Col>
          <Col {...firstRowCol}>
            <Card
              title={
                <Statistic
                  title="总销售额"
                  prefix="￥"
                  value={5656298}
                ></Statistic>
              }
              footer={"日销售额：￥15,418"}
            >
              <AreaChart
                // 图标的数据源
                data={data}
                // x轴的数据源
                xField="year"
                // y轴的数据源
                yField="value"
                // 置0内边距
                padding="0"
                // 水平坐标参数
                xAxis={{
                  visible: false,
                }}
                // 垂直坐标参数
                yAxis={{
                  visible: false,
                }}
                // 是否曲线展示图表
                smooth={true}
                // 图表颜色
                color={["skyblue"]}
              />
            </Card>
          </Col>
          {/* 第三个图表 */}
          <Col {...firstRowCol}>
            <Card
              title={
                <Statistic
                  title="总销售额"
                  prefix="￥"
                  value={5656298}
                ></Statistic>
              }
              footer={"日销售额：￥15,418"}
            >
              <ColumnChart
                data={columnsdata}
                forceFit
                padding="0"
                xField="type"
                yField="sales"
                xAxis={{ visible: false }}
                yAxis={{ visible: false }}
                meta={{
                  type: {
                    alias: "类别",
                  },
                  sales: {
                    alias: "销售额(万)",
                  },
                }}
              />
            </Card>
          </Col>
          {/* 第四个图表 */}
          <Col {...firstRowCol}>
            <Card
              title={
                <Statistic
                  title="总销售额"
                  prefix="￥"
                  value={5656298}
                ></Statistic>
              }
              footer={"日销售额：￥15,418"}
            >
              <Progress
                strokeColor={{
                  from: "#108ee9",
                  to: "#87d068",
                }}
                percent={69.9}
                status="active"
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
