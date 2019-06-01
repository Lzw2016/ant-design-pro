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
              userName: { label: "用户名", value: "lizhiwei", inputType: InputEnum.Input }
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
