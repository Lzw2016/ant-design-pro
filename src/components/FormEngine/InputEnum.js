/* eslint-disable react/no-multi-comp */
import React, { useState, forwardRef } from 'react';
import { AutoComplete, Checkbox, Cascader, DatePicker, InputNumber, Input, Mentions, Rate, Radio, Switch, Slider, Select, TreeSelect, Transfer, TimePicker, Upload } from 'antd';
import RemoteSelect from '../RemoteSelect';
import ImageUpload from '../ImageUpload';
import { InputLimit, TextAreaLimit } from '../InputLimit';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

/*
  - 部分控件需要适配渲染规则，如: CheckboxGroup(Checkbox.Group)
  - 自定义控件需要 遵循Antd-Form的约定: 提供受控属性value、提供onChange事件、支持ref
 {
   Component: "Component",       // 默认组件
   skipDecorator: "boolean",     // 是否跳过使用 getFieldDecorator 修饰
   render: "Function"            // 自定义渲染组件 (form, fieldName, defaultValues, rules, defaultRules, decoratorOptions, props) => (ReactNode)
 }
*/
const InputEnum = {
  // ------------------------------------------------------------------------------------------------------------------------- 官方组件
  // 自动完成完成
  AutoComplete: { Component: AutoComplete },
  // 多选框
  Checkbox: {
    Component: Checkbox,
    skipDecorator: true,
    render: (form, fieldName, defaultValues, rules, defaultRules, decoratorOptions, props) => {
      const { getFieldDecorator } = form;
      return getFieldDecorator(
        fieldName,
        {
          initialValue: defaultValues[fieldName] || undefined,
          rules: (rules && rules.length > 0) ? rules : defaultRules,
          ...decoratorOptions,
          valuePropName: "checked",
          trigger: "onChange",
          validateTrigger: "onChange",
        }
      )(<Checkbox {...props} />);
    },
  },
  // 多选组
  CheckboxGroup: { Component: Checkbox.Group },
  // 级联选择
  Cascader: { Component: Cascader },
  // 日期选择
  DatePicker: { Component: DatePicker },
  // 月份选择
  MonthPicker: { Component: MonthPicker },
  // 时间范围选择
  RangePicker: { Component: RangePicker },
  // 周选择
  WeekPicker: { Component: WeekPicker },
  // 数字输入
  InputNumber: { Component: InputNumber },
  // 文本输入
  Input: { Component: Input },
  // 多行文本输入
  InputTextArea: { Component: Input.TextArea },
  // 搜索框
  InputSearch: { Component: Input.Search },
  // 输入组 -- 这里只是举个例子 Input.Group 下面可以是 Input Select DatePicker AutoComplete Cascader 等
  InputGroup: {
    // Component: Input.Group,
    Component: forwardRef(({ onChange, ...props }, ref) => {
      const [value, setValue] = useState(props.value || []);
      function handleChange(e, index) {
        if (e && e.target) {
          const tmpValue = [...(value || [])];
          tmpValue[index] = e.target.value;
          setValue(tmpValue);
          if (onChange instanceof Function) onChange(tmpValue);
        }
      }
      return (
        <span ref={ref}>
          <Input.Group compact>
            <Input
              key="0"
              style={{ width: "35%" }}
              value={value && value.length >= 1 ? value[0] : undefined}
              onChange={e => handleChange(e, 0)}
            />
            <Input
              key="1"
              style={{ width: "65%" }}
              value={value && value.length >= 2 ? value[1] : undefined}
              onChange={e => handleChange(e, 1)}
            />
          </Input.Group>
        </span>
      )
    }),
  },
  // 密码输入
  InputPassword: { Component: Input.Password },
  // 提及输入
  Mentions: { Component: Mentions },
  // 评分输入
  Rate: { Component: Rate },
  // 单选输入
  Radio: {
    Component: Radio,
    skipDecorator: true,
    render: (form, fieldName, defaultValues, rules, defaultRules, decoratorOptions, props) => {
      const { getFieldDecorator } = form;
      return getFieldDecorator(
        fieldName,
        {
          initialValue: defaultValues[fieldName] || undefined,
          rules: (rules && rules.length > 0) ? rules : defaultRules,
          ...decoratorOptions,
          valuePropName: "checked",
          trigger: "onChange",
          validateTrigger: "onChange",
        }
      )(<Radio {...props} />);
    },
  },
  // 单选分组输入
  RadioGroup: { Component: Radio.Group },
  // 选择开关
  Switch: {
    Component: Switch,
    skipDecorator: true,
    render: (form, fieldName, defaultValues, rules, defaultRules, decoratorOptions, props) => {
      const { getFieldDecorator } = form;
      return getFieldDecorator(
        fieldName,
        {
          initialValue: defaultValues[fieldName] || undefined,
          rules: (rules && rules.length > 0) ? rules : defaultRules,
          ...decoratorOptions,
          valuePropName: "checked",
          trigger: "onChange",
          validateTrigger: "onChange",
        }
      )(<Switch {...props} />);
    },
  },
  // 滑动输入条
  Slider: { Component: Slider },
  // 选择输入
  Select: { Component: Select },
  // 树选择输入
  TreeSelect: { Component: TreeSelect },
  // 穿梭输入框
  Transfer: {
    Component: Transfer,
    skipDecorator: true,
    render: (form, fieldName, defaultValues, rules, defaultRules, decoratorOptions, props) => {
      const { getFieldDecorator } = form;
      return getFieldDecorator(
        fieldName,
        {
          initialValue: defaultValues[fieldName] || undefined,
          rules: (rules && rules.length > 0) ? rules : defaultRules,
          ...decoratorOptions,
          valuePropName: "targetKeys",
          trigger: "onChange",
          validateTrigger: "onChange",
        }
      )(<Transfer {...props} />);
    },
  },
  // 时间选择
  TimePicker: { Component: TimePicker },
  // 文件上传
  Upload: {
    // Component: Upload,
    Component: forwardRef(({ onChange, ...props }, ref) => {
      const [value, setValue] = useState(props.value || []);
      return (
        <Upload
          ref={ref}
          fileList={value}
          onChange={({ file, fileList, event }) => {
            // console.log("InputEnum.Upload --> ", fileList);
            setValue(fileList);
            if (onChange instanceof Function) onChange(fileList, file, event);
          }}
          {...props}
        />
      )
    }),
  },
  // ------------------------------------------------------------------------------------------------------------------------- 自定义组件
  // 通用远程数据下拉输入框
  RemoteSelect: { Component: RemoteSelect },
  // 字数限制提示文本输入框(单行输入)
  InputLimit: { Component: InputLimit },
  // 字数限制提示文本输入框(多行输入)
  TextAreaLimit: { Component: TextAreaLimit },
  // 通用图片上传
  ImageUpload: {
    // Component: ImageUpload,
    Component: forwardRef(({ value, onChange, ...props }, ref) => {
      return (
        <ImageUpload
          ref={ref}
          initFileList={value}
          onChange={({ file, fileList, event }) => {
            // console.log("InputEnum.Upload --> ", fileList);
            // setValue(fileList);
            if (onChange instanceof Function) onChange(fileList, file, event);
          }}
          {...props}
        />
      )
    }),
  },
};

export default InputEnum;
