import React, { PureComponent } from 'react';
import { Card } from 'antd';
import lodash from 'lodash';
// import moment from 'moment';
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
              }}
            />
          </Card>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
