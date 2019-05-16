import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'dva';
import ExcelImport from '@/components/ExcelImport'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

@connect(({ DemoTestModel, loading }) => ({
  DemoTestModel,
  loading: loading.effects['DemoTestModel/findByPage'],
}))
class DemoTest extends PureComponent {

  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button type="primary">Excel导入</Button>
          <ExcelImport />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DemoTest;
