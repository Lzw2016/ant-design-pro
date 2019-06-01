// import React from 'react';
import { AutoComplete, Checkbox, Cascader, DatePicker, InputNumber, Input, Mentions, Rate, Radio, Switch, Slider, Select, TreeSelect, Transfer, TimePicker, Upload } from 'antd';
import RemoteSelect from '../RemoteSelect';
import ImageUpload from '../ImageUpload';
import { InputLimit, TextAreaLimit } from '../InputLimit';


const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const InputEnum = {
  AutoComplete,                         // 自定完成
  Checkbox,                             // 多选框
  CheckboxGroup: Checkbox.Group,        // 多选组
  Cascader,                             // 级联选择
  DatePicker,                           // 时间选择
  MonthPicker,                          // 月份选择
  RangePicker,                          // 时间范围选择
  WeekPicker,                           // 周选择
  InputNumber,                          // 数字输入
  Input,                                // 文本输入
  InputTextArea: Input.TextArea,        // 多行文本输入
  InputSearch: Input.Search,            // 搜索框
  InputGroup: Input.Group,              // 输入组
  InputPassword: Input.Password,        // 密码输入
  Mentions,                             // 提及输入
  Rate,                                 // 评分输入
  Radio,                                // 单选输入
  RadioGroup: Radio.Group,              // 单选分组输入
  Switch,                               // 选择开关
  Slider,                               // 滑动输入条
  Select,                               // 选择输入
  TreeSelect,                           // 树选择输入
  Transfer,                             // 穿梭输入框 ?
  TimePicker,                           // 时间选择
  Upload,                               // 文件上传 ?
  // ----------------------------------------------------------------------
  RemoteSelect,                         // 通用远程数据下拉输入框
  ImageUpload,                          // 通用图片上传
  InputLimit,                           // 字数限制提示文本输入框(单行输入)
  TextAreaLimit,                        // 字数限制提示文本输入框(多行输入)

};

export default InputEnum;
