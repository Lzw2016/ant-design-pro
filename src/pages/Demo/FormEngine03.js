import React, { PureComponent } from 'react';
import { Card, Mentions, Button, Icon } from 'antd';
import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import { FormEngine, InputEnum, RulesEnum } from '@/components/FormEngine';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

// @connect(({ DemoTestModel, loading }) => ({
//   DemoTestModel,
//   loading: loading.effects['DemoTestModel/findByPage'],
// }))
class Demo1 extends PureComponent {

  render() {
    const values = {
      fieldName01: true,
      fieldName02: ["111", "222333666"],
      fieldName03: "@[lzw]找@[ww] _ @试试 -> ",
      fieldName04: true,
      fieldName05: true,
      fieldName06: ["1", "5", "6"],
      fieldName07: [
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
      fieldName08: { key: "00001", label: "远程数据1" },
      fieldName09: "初始值123",
      fieldName10: "第一行\n第二行",
      fieldName11: [
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
      fieldName99: "123",
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
              defaultRules={[
                // { required: true, message: "必须填项" },
              ]}
              resetValues={values}
              defaultValues={lodash.merge({}, values)}
              formFields={{
                fieldName01: {
                  label: "单选框",
                  InputComponent: InputEnum.Checkbox,
                  inputProp: {
                    children: <span style={{ color: "red" }}>Checkbox</span>,
                  },
                },
                fieldName02: {
                  label: "输入组",
                  InputComponent: InputEnum.InputGroup,
                },
                fieldName03: {
                  fieldColSpan: 2,
                  label: "提及输入",
                  InputComponent: InputEnum.Mentions,
                  inputProp: {
                    children: [
                      <Mentions.Option key="1" value="[lzw]">李志伟</Mentions.Option>,
                      <Mentions.Option key="2" value="[zs]">张三</Mentions.Option>,
                      <Mentions.Option key="3" value="[ls]">李四</Mentions.Option>,
                      <Mentions.Option key="4" value="[ww]">王五</Mentions.Option>,
                      <Mentions.Option key="5" value="[zl]">赵六</Mentions.Option>,
                    ],
                  },
                },
                fieldName04: {
                  label: "单选输入",
                  InputComponent: InputEnum.Radio,
                  inputProp: {
                    children: "Radio",
                  },
                },
                fieldName05: {
                  label: "单选组输入",
                  InputComponent: InputEnum.Switch,
                  inputProp: {
                    checkedChildren: "开开开",
                    unCheckedChildren: "关关关",
                  },
                },
                fieldName06: {
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
                fieldName07: {
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
                fieldName08: {
                  label: "远程数据下拉",
                  InputComponent: InputEnum.RemoteSelect,
                  inputProp: {
                    defaultLoadData: true,
                    url: "/api/remote/input/object",
                    searchParamName: "key",
                    searchQueryString: { num: 6 },
                    dataValueKey: "column1",
                    dataLabelKey: "column2",
                    selectProps: {
                      placeholder: "通用远程数据下拉输入框",
                    },
                  },
                },
                fieldName09: {
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
                fieldName10: {
                  label: "限制输入",
                  InputComponent: InputEnum.TextAreaLimit,
                  inputProp: {
                    maxLength: 25,
                    preventInput: true,
                    autosize: { minRows: 3, maxRows: 6 },
                    inputProps: {
                      placeholder: "字数限制提示文本输入框(多行输入)",
                    },
                  },
                },
                fieldName11: {
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
                fieldName99: {
                  label: "字符串",
                  InputComponent: InputEnum.Input,
                  inputProp: {
                    placeholder: "字符串",
                  },
                  rules: [
                    RulesEnum.string({ message: "字符串非空" }),
                    RulesEnum.string({ message: "字符串长度5-10", min: 5, max: 10 }),
                    RulesEnum.string({ message: "字符串长度8", len: 8 }),
                  ],
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
