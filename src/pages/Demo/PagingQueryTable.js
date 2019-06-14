import React, { PureComponent } from 'react';
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
          <Button type="primary">刷新</Button>
          <br />
          <br />
          <PagingQueryTable
            columns={[
              { title: '主键id', dataIndex: 'id' },
              { title: '系统(或服务)名称', dataIndex: 'sysName' },
              { title: '权限标题', dataIndex: 'title' },
              { title: '唯一权限标识', dataIndex: 'permissionStr' },
              { title: '权限类型', dataIndex: 'resourcesType' },
              { title: '权限说明', dataIndex: 'description' },
              { title: '创建时间', dataIndex: 'createAt' },
              { title: '更新时间', dataIndex: 'updateAt' },
            ]}
            rowKey="id"
            dataUrl="/api/query_page/find2"
            // defaultLoadData={true}
            dataSourceJsonPath="$.records"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
