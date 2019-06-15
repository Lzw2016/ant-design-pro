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

  // // 构造器
  // constructor(props) {
  //   super(props);
  //   this.pagingQueryTable = React.createRef();
  // }

  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button
            type="primary"
            onClick={() => {
              if (this.pagingQueryTable) this.pagingQueryTable.reloadDataSource();
            }}
          >
            刷新
          </Button>
          <span style={{ display: "inline-block", width: 24 }} />
          <Button
            type="primary"
            onClick={() => {
              if (this.pagingQueryTable) this.pagingQueryTable.reloadDataSource(true);
            }}
          >
            重新查询
          </Button>
          <br />
          <br />
          <PagingQueryTable
            ref={pagingQueryTable => { this.pagingQueryTable = pagingQueryTable; }}
            columns={[
              { title: '主键id', dataIndex: 'id', sorter: true },
              { title: '系统(或服务)名称', dataIndex: 'sysName', sorter: true },
              { title: '权限标题', dataIndex: 'title', sorter: true },
              { title: '唯一权限标识', dataIndex: 'permissionStr', sorter: true },
              { title: '权限类型', dataIndex: 'resourcesType', sorter: true },
              { title: '权限说明', dataIndex: 'description', sorter: true },
              { title: '创建时间', dataIndex: 'createAt', sorter: true },
              { title: '更新时间', dataIndex: 'updateAt', sorter: true },
            ]}
            rowKey="id"
            dataUrl="/api/query_page/find2"
            // defaultLoadData={true}
            dataSourceJsonPath="$.records"
            totalJsonPath="$.total"
            pageSizeJsonPath="$.size"
            currentJsonPath="$.current"
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
