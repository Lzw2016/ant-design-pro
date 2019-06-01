import React, { PureComponent } from 'react';
import { Card } from 'antd';
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

  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <FormEngine
            columnCount={6}
            formFields={{
              userName1: {
                label: "用户名",
                InputComponent: InputEnum.Input,
                inputProp: { placeholder: "请输入用户名" },
              },
              userName2: {
                label: "用户名",
                InputComponent: InputEnum.Input,
                inputProp: { placeholder: "请输入用户名" },
              },
              userName3: {
                label: "用户名",
                InputComponent: InputEnum.DatePicker,
                inputProp: { placeholder: "请输入用户名" },
              },
              userName4: {
                label: "用户名",
                InputComponent: InputEnum.Input,
                inputProp: { placeholder: "请输入用户名" },
              },
              userName5: {
                label: "用户名",
                InputComponent: InputEnum.Input,
                inputProp: { placeholder: "请输入用户名" },
              },
              userName6: {
                label: "用户名",
                InputComponent: InputEnum.Input,
                inputProp: { placeholder: "请输入用户名" },
              },
              userName7: {
                label: "用户名",
                InputComponent: InputEnum.Input,
                inputProp: { placeholder: "请输入用户名" },
              },
              userName8: {
                label: "用户名",
                InputComponent: InputEnum.Input,
                inputProp: { placeholder: "请输入用户名" },
              },
            }}
            defaultValues={{
              userName1: "lizhiwei1",
              // userName2: "lizhiwei2",
              // userName3: "lizhiwei3",
              // userName4: "lizhiwei4",
              userName5: "lizhiwei5",
              userName6: "lizhiwei6",
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
