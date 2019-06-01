import React, { PureComponent } from 'react';
import { Card } from 'antd';
// import { connect } from 'dva';
import FormEngine from '@/components/FormEngine';
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
          <FormEngine />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
