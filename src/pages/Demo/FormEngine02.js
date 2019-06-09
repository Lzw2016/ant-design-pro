import React, { PureComponent } from 'react';
import { Card } from 'antd';
import lodash from 'lodash';
import moment from 'moment';
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
      fieldName01: "",
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
                fieldName02: {
                  label: "数字",
                  InputComponent: InputEnum.InputNumber,
                  inputProp: {
                    placeholder: "数字",
                  },
                  rules: [
                    RulesEnum.number({ message: "数字5-10", min: 5, max: 10 }),
                    RulesEnum.number({ message: "数字8", len: 8 }),
                  ],
                },
                fieldName03: {
                  label: "Boolean值",
                  InputComponent: InputEnum.Checkbox,
                  inputProp: {
                    placeholder: "Boolean值",
                  },
                  rules: [
                    RulesEnum.boolean({}),
                  ],
                },
                fieldName04: {
                  label: "整数",
                  InputComponent: InputEnum.InputNumber,
                  inputProp: {
                    placeholder: "整数",
                  },
                  rules: [
                    RulesEnum.integer({ message: "整数5-10", min: 5, max: 10 }),
                    RulesEnum.integer({ message: "整数8", len: 8 }),
                  ],
                },
                fieldName05: {
                  label: "小数",
                  InputComponent: InputEnum.InputNumber,
                  inputProp: {
                    placeholder: "小数",
                  },
                  rules: [
                    RulesEnum.float({ message: "小数5-10", min: 5, max: 10 }),
                    RulesEnum.float({ message: "小数8.1", len: 8.1 }),
                  ],
                },
                fieldName06: {
                  label: "数组",
                  InputComponent: InputEnum.CheckboxGroup,
                  inputProp: {
                    options: [
                      { label: 'Apple', value: '1' },
                      { label: 'Pear', value: '2' },
                      { label: 'Orange', value: '3' },
                    ],
                  },
                  rules: [
                    RulesEnum.array({ message: "必选1-2", min: 1, max: 2 }),
                    RulesEnum.array({ message: "必选3", len: 3 }),
                  ],
                },
                fieldName07: {
                  label: "枚举",
                  InputComponent: InputEnum.Input,
                  inputProp: {
                    placeholder: "枚举",
                  },
                  rules: [
                    RulesEnum.enum({ message: "只能输入[111, 222, 3333]", enumArray: ["111", "222", "333"] }),
                  ],
                },
                fieldName08: {
                  label: "时间类型",
                  InputComponent: InputEnum.DatePicker,
                  inputProp: {
                    placeholder: "时间类型",
                    format: "YYYY年MM月DD日",
                  },
                  rules: [
                    RulesEnum.date({ message: "时间", min: moment().add(-2, 'days').toDate(), max: moment().add(2, 'days').toDate(), transform: value => value ? value.toDate() : null }),
                  ],
                },
                fieldName09: {
                  fieldColSpan: 1,
                  label: "URL",
                  InputComponent: InputEnum.Input,
                  inputProp: {
                    placeholder: "URL",
                  },
                  rules: [
                    RulesEnum.url({ message: "只能输入URL" }),
                  ],
                },
                fieldName10: {
                  label: "Email",
                  InputComponent: InputEnum.Input,
                  inputProp: {
                    placeholder: "Email",
                  },
                  rules: [
                    RulesEnum.string({ message: "必须填写", required: true }),
                    RulesEnum.email({ message: "只能输入Email" }),
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
