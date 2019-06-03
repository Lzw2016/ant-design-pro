// import React from 'react';
import { AutoComplete, Checkbox, Cascader, DatePicker, InputNumber, Input, Mentions, Rate, Radio, Switch, Slider, Select, TreeSelect, Transfer, TimePicker, Upload } from 'antd';
import RemoteSelect from '../RemoteSelect';
import ImageUpload from '../ImageUpload';
import { InputLimit, TextAreaLimit } from '../InputLimit';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

/*
TODO
  - 部分控件需要适配渲染规则，如: CheckboxGroup(Checkbox.Group)
  - 自定义控件需要 遵循Antd-Form的约定: 提供受控属性value、提供onChange事件、支持ref
*/
const InputEnum = {
  // ------------------------------------------------------------------------------------------------------------------------- 官方组件
  // 自动完成完成
  AutoComplete: { Component: AutoComplete },
  // 多选框 TODO 自定义渲染
  Checkbox: { Component: Checkbox },
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
  // 输入组 TODO 自定义渲染
  InputGroup: { Component: Input.Group },
  // 密码输入
  InputPassword: { Component: Input.Password },
  // 提及输入 TODO 自定义渲染
  Mentions: { Component: Mentions },
  // 评分输入
  Rate: { Component: Rate },
  // 单选输入 TODO 自定义渲染
  Radio: { Component: Radio },
  // 单选分组输入
  RadioGroup: { Component: Radio.Group },
  // 选择开关 TODO 自定义渲染
  Switch: { Component: Switch },
  // 滑动输入条
  Slider: { Component: Slider },
  // 选择输入
  Select: { Component: Select },
  // 树选择输入
  TreeSelect: { Component: TreeSelect },
  // 穿梭输入框 TODO 自定义渲染
  Transfer: { Component: Transfer },
  // 时间选择
  TimePicker: { Component: TimePicker },
  // 文件上传 TODO 自定义渲染
  Upload: { Component: Upload },
  // ------------------------------------------------------------------------------------------------------------------------- 自定义组件
  // 通用远程数据下拉输入框 TODO 自定义渲染
  RemoteSelect: { Component: RemoteSelect },
  // 字数限制提示文本输入框(单行输入) TODO 自定义渲染
  InputLimit: { Component: InputLimit },
  // 字数限制提示文本输入框(多行输入) TODO 自定义渲染
  TextAreaLimit: { Component: TextAreaLimit },
  // 通用图片上传 TODO 自定义渲染
  ImageUpload: { Component: ImageUpload },

};

export default InputEnum;
