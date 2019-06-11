import React, { PureComponent, Fragment } from 'react';
import { Card } from 'antd';
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
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Card bordered={true} style={{ width: 1200 }}>
            <FormEngine
              saveForm={from => { this.from1 = from }}
              actionsConfig={{
                resetText: false,
                submitUrl: "/api/remote/form/submit",
                submitMethod: "post",
                onSubmit: (formValues, form) => {
                  console.log("onSubmit --> ", formValues, form);
                },
                requestInterceptor: ({ url, options }) => {
                  console.log("requestInterceptor --> ", url, options);
                  return { url, options };
                },
                submitSuccessful: (resData, response) => {
                  console.log("submitSuccessful --> ", resData, response);
                },
                submitFailure: (resData, response, error) => {
                  console.log("submitFailure --> ", resData, response, error);
                },
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
              }}
            />
          </Card>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
