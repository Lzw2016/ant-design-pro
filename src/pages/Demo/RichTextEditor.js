import React, { PureComponent } from 'react';
import { Card } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
// import { InputEnum } from '@/components/FormEngine';
import InputTableSelect from '@/components/InputTableSelect';
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
          <InputTableSelect />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
