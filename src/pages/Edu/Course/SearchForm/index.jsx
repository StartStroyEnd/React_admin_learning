import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Button } from "antd";

// 获取所有课程分类数据,二级数据
import { reqAllSubjectList, reqSecGetSubject } from "@api/edu/subject";
// 导入获取所有讲师列表
import { reqGetAllTeacherList } from "@api/edu/teacher";
import "./index.less";

const { Option } = Select;

function SearchForm() {
  const [form] = Form.useForm();

  //使用useState来存储数据
  // 注意作用域范围，当前写在最外层作用域，则内部函数都可以使用
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [options, setOptions] = useState([]);

  // 该组件为函数组件，若需要使用声明周期，则需要使用effect
  useEffect(() => {
    // 格式要求，需要在内部定义一个函数在创建await以及async
    async function fetchData() {
      // 这是按照执行上下文来执行的异步请求。我们需要同时获取
      // await reqAllSubjectList();
      // await reqGetAllTeacherList();

      // 使用promise.all同时发送请求，同时返回数据
      // 将一下两个返回的数据存储到当前组件中的state中，但是这是一个函数组件
      // 则需要使用useState
      const [subject, teacher] = await Promise.all([
        reqAllSubjectList(),
        reqGetAllTeacherList(),
      ]);
      // set当前state中的数据
      setSubjects(subject);
      setTeachers(teacher);

      // 定义一个options来创建级联选择数据格式要求
      const optionsList = subject.map((item) => {
        return {
          // value 相当于请求回来的数据中的_id
          value: item._id,
          // value 相当于请求回来的数据中的title
          label: item.title,
          // value 相当于请求回来的数据中有无二级数据，true为有，false为无
          isLeaf: false,
        };
      });
      // 当前已经初始化了options的值，当用户点击触发记录二级数据时，再次修改options的值
      // 重新赋值，重新渲染页面
      setOptions(optionsList);
    }
    fetchData();
  }, []);

  // const [options, setOptions] = useState([
  //   {
  //     value: "zhejiang",
  //     label: "Zhejiang",
  //     isLeaf: false,
  //   },
  //   {
  //     value: "jiangsu",
  //     label: "Jiangsu",
  //     isLeaf: false,
  //   },
  // ]);

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  // selectedOptions点击一级时会记录当前级的数组型数据，点击二级是会生成数组下标为1的第二个数据
  // selectedOptions 记录了一级的数据和后面的其他子级数据
  // 当子级数据存在时，才会触发loadData
  const loadData = async (selectedOptions) => {
    // selectedOptions记录了所有你点击的多级数组数据,1-2-3
    // selectedOptions[selectedOptions.length - 1]最终级的数据即为最终级的下一级所需要查找的数据
    const targetOption = selectedOptions[selectedOptions.length - 1];

    // 加载效果！
    targetOption.loading = true;

    // 发松异步请求获取数据(一级所对应的二级数据)
    // 此处传的本质是一级列表中的_id，但是由于antd的数据格式要求我们修改为了value
    const res = await reqSecGetSubject(targetOption.value);

    // 隐藏加载效果
    targetOption.loading = false;

    console.log(res);

    if (res.items.length) {
      // 请求回来的数据中，如果存在子级数据，则添加children属性
      targetOption.children = res.items.map((item) => {
        return {
          value: item._id,
          label: item.title,
          // 因为我们知道二级后面没有数据了，不用写：不写isLeaf就是true
        };
      });
    } else {
      // 否则就没有子级数据，不添加children且isLeaf为true，去掉小箭头标识（有就显示笑箭头）
      // 修改的是options的数据
      targetOption.isLeaf = true;
    }
    setOptions([...options]);

    // // load options lazily
    // setTimeout(() => {
    //   // 隐藏加载效果
    //   targetOption.loading = false;
    //   // 往最终级添加下一级数据
    //   targetOption.children = [
    //     {
    //       label: `${targetOption.label} Dynamic 1`,
    //       value: "dynamic1",
    //       // isLeaf:false
    //     },
    //     {
    //       label: `${targetOption.label} Dynamic 2`,
    //       value: "dynamic2",
    //     },
    //   ];
    //   setOptions([...options]);
    // }, 1000);
  };

  const resetForm = () => {
    form.resetFields();
  };

  return (
    <Form layout="inline" form={form}>
      <Form.Item name="title" label="标题">
        <Input placeholder="课程标题" style={{ width: 250, marginRight: 20 }} />
      </Form.Item>
      <Form.Item name="teacherId" label="讲师">
        <Select
          allowClear
          placeholder="课程讲师"
          style={{ width: 250, marginRight: 20 }}
        >
          {/* 动态渲染当前的数据 */}
          {teachers.map((item) => (
            <Option key={item._id} value="item._id">
              {item.name}
            </Option>
          ))}
          {/* <Option value="lucy1">Lucy1</Option> */}
          {/* <Option value="lucy2">Lucy2</Option> */}
          {/* <Option value="lucy3">Lucy3</Option> */}
        </Select>
      </Form.Item>
      <Form.Item name="subject" label="分类">
        <Cascader
          style={{ width: 250, marginRight: 20 }}
          options={options}
          // loadData当点击菜单，如果有下一级数据，就会触发函数，一般用于获取子级数据
          loadData={loadData}
          // onChange可以获取到当前选中的多级联动的子级数据
          onChange={onChange}
          // 当changeOnSelect的值为true时，只要点击了多级联动，就会触发onChnage
          // 为false时，只有选中以后才能触发
          // changeOnSelect ={true}
          placeholder="课程分类"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          查询
        </Button>
        <Button onClick={resetForm}>重置</Button>
      </Form.Item>
    </Form>
  );
}

export default SearchForm;
