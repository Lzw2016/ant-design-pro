import React, { PureComponent } from 'react';
import { Card } from 'antd';
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
      fieldName99: "",
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
                    children: "Checkbox",
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
