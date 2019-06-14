import React, { PureComponent, Fragment } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import PagingQueryTable from '@/components/PagingQueryTable';
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
          <PagingQueryTable />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
