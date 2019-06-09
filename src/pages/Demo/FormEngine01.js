import React, { PureComponent, Fragment } from 'react';
import { Card, Mentions, Button, Icon, Select } from 'antd';
import lodash from 'lodash';
import moment from 'moment';
// import { connect } from 'dva';
import { FormEngine, InputEnum } from '@/components/FormEngine';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

// @connect(({ DemoTestModel, loading }) => ({
//   DemoTestModel,
//   loading: loading.effects['DemoTestModel/findByPage'],
// }))
class Demo1 extends PureComponent {

  state = {
    fieldName01DataSource: [],
  }

  fieldName01OnSearch = value => {
    let result;
    if (!value || value.indexOf('@') >= 0) {
      result = [];
    } else {
      result = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    }
    this.setState({ fieldName01DataSource: result });
  }

  render() {
    const { fieldName01DataSource } = this.state;
    const values = {
      fieldName01: "",
      fieldName02: true,
      fieldName03: ['2'],
      fieldName04: ['zhejiang', 'hangzhou', 'xihu'],
      fieldName05: moment("1993-06-11"),
      fieldName06: moment("1993-06-11"),
      fieldName07: [moment("1993-06-11"), undefined],
      fieldName08: moment("1993-06-11"),
      fieldName09: 123,
      fieldName10: "lizw",
      fieldName11: "第一行\n第二行",
      fieldName12: "搜索关键字",
      fieldName13: ["111", "222-333-666"],
      fieldName14: "mima",
      fieldName15: "@[lzw] 输入...",
      fieldName16: 3,
      fieldName17: true,
      fieldName18: "3",
      fieldName19: true,
      fieldName20: 39,
      fieldName21: "lucy",
      fieldName22: undefined,
      fieldName23: ["1", "5", "6"],
      fieldName24: moment(),
      fieldName25: [
        {
          uid: '1',
          name: '图片01.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '2',
          name: '图片02.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
      fieldName26: { key: "00001", label: "远程数据1" },
      fieldName27: "字数限制提示文本输入框",
      fieldName28: "第一行\n第二行",
      fieldName29: [
        {
          uid: '1',
          name: '图片01.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '2',
          name: '图片02.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Card bordered={true} style={{ width: 1200 }}>
            <FormEngine
              saveForm={from => { this.from1 = from }}
              actionsConfig={{
                onSubmit: (formValues, form) => {
                  console.log("提交表单", formValues, form);
                }
              }}
              columnCount={3}
              // defaultRules={[
              //   { required: true, message: "必须填项" },
              // ]}
              resetValues={values}
              defaultValues={lodash.merge({}, values)}
              formFields={{
                fieldName01: {
                  label: "自动完成",
                  InputComponent: InputEnum.AutoComplete,
                  inputProp: {
                    placeholder: "自动完成输入框",
                    dataSource: fieldName01DataSource,
                    onSearch: this.fieldName01OnSearch
                  },
                },
                fieldName02: {
                  label: "单选框",
                  InputComponent: InputEnum.Checkbox,
                  inputProp: {
                    children: <Fragment>同意<span style={{ color: "red" }}>xxx</span>条款</Fragment>
                  },
                },
                fieldName03: {
                  label: "多选框",
                  InputComponent: InputEnum.CheckboxGroup,
                  inputProp: {
                    options: [
                      { label: 'Apple', value: '1' },
                      { label: 'Pear', value: '2' },
                      { label: 'Orange', value: '3' },
                    ],
                  },
                },
                fieldName04: {
                  label: "级联选择",
                  InputComponent: InputEnum.Cascader,
                  inputProp: {
                    placeholder: "级联选择",
                    options: [
                      {
                        value: 'zhejiang',
                        label: '浙江',
                        children: [{ value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖' }] }],
                      },
                      {
                        value: 'jiangsu',
                        label: '江苏',
                        children: [{ value: 'nanjing', label: '南京', children: [{ value: 'zhonghuamen', label: '中华门' }] }],
                      },
                    ],
                  },
                },
                fieldName05: {
                  label: "日期选择",
                  InputComponent: InputEnum.DatePicker,
                  inputProp: {
                    placeholder: "日期选择",
                    format: "YYYY年MM月DD日",
                  },
                },
                fieldName06: {
                  label: "月份选择",
                  InputComponent: InputEnum.MonthPicker,
                  inputProp: {
                    placeholder: "月份选择",
                    format: "YYYY-MM",
                  },
                },
                fieldName07: {
                  label: "时间范围选择",
                  InputComponent: InputEnum.RangePicker,
                  inputProp: {
                    placeholder: ["开始时间", "结束时间"],
                    format: "YYYY-MM-DD",
                  },
                },
                fieldName08: {
                  label: "周选择",
                  InputComponent: InputEnum.WeekPicker,
                  inputProp: {
                    placeholder: "周选择",
                  },
                },
                fieldName09: {
                  label: "数字输入",
                  InputComponent: InputEnum.InputNumber,
                  inputProp: {
                    placeholder: "数字输入",
                    step: 5,
                  },
                },
                fieldName10: {
                  label: "文本输入",
                  InputComponent: InputEnum.Input,
                  inputProp: {
                    placeholder: "文本输入",
                  },
                },
                fieldName11: {
                  fieldColSpan: 2,
                  label: "多行文本",
                  InputComponent: InputEnum.InputTextArea,
                  inputProp: {
                    placeholder: "多行文本输入",
                    autosize: { minRows: 3, maxRows: 3 },
                  },
                },
                fieldName12: {
                  label: "搜索框",
                  InputComponent: InputEnum.InputSearch,
                  inputProp: {
                    placeholder: "搜索框",
                  },
                },
                fieldName13: {
                  label: "输入组",
                  InputComponent: InputEnum.InputGroup,
                },
                fieldName14: {
                  label: "密码输入",
                  InputComponent: InputEnum.InputPassword,
                  inputProp: {
                    placeholder: "密码输入",
                  },
                },
                fieldName15: {
                  label: "提及输入",
                  // inputRender: "暂不支持(敬请期待...)",
                  // decorator: false,
                  InputComponent: InputEnum.Mentions,
                  inputProp: {
                    placeholder: "提及输入",
                    children: [
                      <Mentions.Option key="1" value="[lzw]">李志伟</Mentions.Option>,
                      <Mentions.Option key="2" value="[zs]">张三</Mentions.Option>,
                      <Mentions.Option key="3" value="[ls]">李四</Mentions.Option>,
                      <Mentions.Option key="4" value="[ww]">王五</Mentions.Option>,
                      <Mentions.Option key="5" value="[zl]">赵六</Mentions.Option>,
                    ],
                  },
                },
                fieldName16: {
                  label: "评分输入",
                  InputComponent: InputEnum.Rate,
                  inputProp: {
                    count: 5,
                    tooltips: ['很糟糕', '糟糕', '正常', '好', '很好'],
                  },
                },
                fieldName17: {
                  label: "单选输入",
                  InputComponent: InputEnum.Radio,
                  inputProp: {
                    children: "单选输入",
                  },
                },
                fieldName18: {
                  label: "单选组输入",
                  InputComponent: InputEnum.RadioGroup,
                  inputProp: {
                    options: [
                      { label: 'Apple', value: '1' },
                      { label: 'Pear', value: '2' },
                      { label: 'Orange', value: '3' },
                    ],
                  },
                },
                fieldName19: {
                  label: "单选组输入",
                  InputComponent: InputEnum.Switch,
                  inputProp: {
                    checkedChildren: "开",
                    unCheckedChildren: "关",
                    style: { width: undefined },
                  },
                },
                fieldName20: {
                  label: "滑动输入条",
                  InputComponent: InputEnum.Slider,
                  inputProp: {
                    min: 10,
                    max: 50,
                    marks: {
                      10: "10°C",
                      37.5: "37.5°C",
                      50: {
                        style: { color: '#f50' },
                        label: <strong>50°C</strong>,
                      },
                    },
                  },
                },
                fieldName21: {
                  label: "选择输入",
                  InputComponent: InputEnum.Select,
                  inputProp: {
                    placeholder: "选择输入",
                    children: [
                      <Select.Option value="jack">Jack</Select.Option>,
                      <Select.Option value="lucy">Lucy</Select.Option>,
                      <Select.Option value="disabled" disabled>Disabled</Select.Option>,
                    ]
                  },
                },
                fieldName22: {
                  label: "树选择输入",
                  InputComponent: InputEnum.TreeSelect,
                  inputProp: {
                    placeholder: "树选择输入",
                    treeData: [
                      { title: "水果", value: "01", key: "01", children: [{ title: "香蕉", value: "0101", key: "0101" }, { title: "苹果", value: "0102", key: "0102" }] },
                      { title: "动物", value: "02", key: "02", children: [{ title: "猫仔", value: "0201", key: "0201" }, { title: "小狗", value: "0202", key: "0202" }] },
                    ],
                  },
                },
                fieldName23: {
                  fieldColSpan: 2,
                  label: "穿梭输入框",
                  InputComponent: InputEnum.Transfer,
                  inputProp: {
                    titles: ["全部", "选中"],
                    render: item => item.title,
                    // targetKeys: ["1", "5", "6"],
                    dataSource: [
                      { key: "1", title: "选项1", description: '描述1', disabled: false },
                      { key: "2", title: "选项2", description: '描述2', disabled: false },
                      { key: "3", title: "选项3", description: '描述3', disabled: false },
                      { key: "4", title: "选项4", description: '描述4', disabled: true },
                      { key: "5", title: "选项5", description: '描述5', disabled: false },
                      { key: "6", title: "选项6", description: '描述6', disabled: false },
                    ],
                  },
                },
                fieldName24: {
                  label: "时间选择",
                  InputComponent: InputEnum.TimePicker,
                  inputProp: {
                    placeholder: "时间选择",
                    format: "HH:mm:ss",
                  },
                },
                fieldName25: {
                  label: "文件上传",
                  InputComponent: InputEnum.Upload,
                  inputProp: {
                    action: "/api/file/upload",
                    accept: ".bmp,.jpg,.jpeg,.png,.gif,.svg,.ico",
                    listType: "picture",
                    data: { fileSource: "test" },
                    children: <Button><Icon type="upload" />上传</Button>
                  },
                },
                fieldName26: {
                  label: "远程数据下拉",
                  InputComponent: InputEnum.RemoteSelect,
                  inputProp: {
                    defaultLoadData: true,
                    url: "/api/remote/input/string",
                    searchParamName: "key",
                    searchQueryString: { num: 6 },
                    selectProps: {
                      placeholder: "通用远程数据下拉输入框",
                    },
                  },
                },
                fieldName27: {
                  label: "限制输入",
                  InputComponent: InputEnum.InputLimit,
                  inputProp: {
                    maxLength: 10,
                    preventInput: true,
                    inputProps: {
                      placeholder: "字数限制提示文本输入框(单行输入)",
                    },
                  },
                },
                fieldName28: {
                  label: "限制输入",
                  InputComponent: InputEnum.TextAreaLimit,
                  inputProp: {
                    maxLength: 25,
                    preventInput: true,
                    autosize: { minRows: 2, maxRows: 2 },
                    inputProps: {
                      placeholder: "字数限制提示文本输入框(多行输入)",
                    },
                  },
                },
                fieldName29: {
                  fieldColSpan: 2,
                  label: "图片上传",
                  InputComponent: InputEnum.ImageUpload,
                  inputProp: {
                    uploadUrl: "/api/file/upload",
                    extFormData: { fileSource: "test" },
                    fileUrlJsonPath: "$.successList[0].readUrl",
                    previewUrlPrefix: "/api/file",
                    fileMaxCount: 3,
                    fileMaxSizeByMB: 2,
                    // showAlert: false,
                  },
                },
              }}
            />
          </Card>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
