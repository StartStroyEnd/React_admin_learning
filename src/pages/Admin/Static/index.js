import React, { Component } from "react";

import { Radio, Card } from "antd";

import {
  Chart,
  registerShape,
  Geom,
  Axis,
  Tooltip,
  Interval,
  Interaction,
  Coordinate,
} from "bizcharts";

// 饼图数据源
const data = [
  {
    type: "分类一",
    value: 20,
  },
  {
    type: "分类二",
    value: 18,
  },
  {
    type: "分类三",
    value: 32,
  },
  {
    type: "分类四",
    value: 15,
  },
  {
    type: "Other",
    value: 15,
  },
]; // 可以通过调整这个数值控制分割空白处的间距，0-1 之间的数值

const sliceNumber = 0.01; // 自定义 other 的图形，增加两条线

registerShape("interval", "sliceShape", {
  draw(cfg, container) {
    const points = cfg.points;
    let path = [];
    path.push(["M", points[0].x, points[0].y]);
    path.push(["L", points[1].x, points[1].y - sliceNumber]);
    path.push(["L", points[2].x, points[2].y - sliceNumber]);
    path.push(["L", points[3].x, points[3].y]);
    path.push("Z");
    path = this.parsePath(path);
    return container.addShape("path", {
      attrs: {
        fill: cfg.color,
        path: path,
      },
    });
  },
});

export default class index extends Component {
  // onchange 切换单选按钮时会触发
  handleChnage = () => {};

  render() {
    return (
      <div>
        <Card
          title={"销售额类型占比"}
          extra={
            <>
              {/* onchange 切换单选按钮时会触发
              defaultValue :默认值,可控制高亮
            */}
              <Radio.Group
                defaultValue="a"
                size="large"
                onChange={this.handleChnage}
              >
                <Radio.Button value="a">全部渠道</Radio.Button>
                <Radio.Button value="b">111</Radio.Button>
                <Radio.Button value="c">Beijing</Radio.Button>
                <Radio.Button value="d">Chengdu</Radio.Button>
              </Radio.Group>
            </>
          }
        >
          {/* 
            data:饼图数据源
            height:饼图高度，未设置则无饼图
            autoFit:饼图自适应父容器宽高
            Coordinate:坐标系
          */}
          <Chart data={data} height={500} autoFit>
            <Coordinate type="theta" radius={0.8} innerRadius={0.75} />
            <Axis visible={false} />
            <Tooltip showTitle={false} />
            <Interval
              adjust="stack"
              position="value"
              color="type"
              shape="sliceShape"
            />
            <Interaction type="element-single-selected" />
          </Chart>
        </Card>
      </div>
    );
  }
}
