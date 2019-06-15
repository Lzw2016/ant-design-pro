import React, { PureComponent } from 'react';
import { Card, Button, Modal } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import DetailForm from '@/components/DetailForm';
import PagingQueryTable from '@/components/PagingQueryTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

const ResourcesTypeAyyay = [
  { value: 1, label: "web资源权限", color: "#faad14" },
  { value: 2, label: "菜单权限", color: "#52c41a" },
  { value: 3, label: "ui权限", color: "#f5222d" },
]

// @connect(({ DemoTestModel, loading }) => ({
//   DemoTestModel,
//   loading: loading.effects['DemoTestModel/findByPage'],
// }))
class Demo1 extends PureComponent {

  state = {
    visible: false,
    data: {},
  }

  render() {
    const { visible, data } = this.state;
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
              { title: '主键id', dataIndex: 'id', sorter: true, defaultSortOrder: "ascend", orderFieldParam: "id" },
              { title: '系统(或服务)名称', dataIndex: 'sysName', sorter: true },
              { title: '权限标题', dataIndex: 'title', sorter: true },
              { title: '唯一权限标识', dataIndex: 'permissionStr', sorter: true },
              { title: '权限类型', dataIndex: 'resourcesType', sorter: true, transform: ResourcesTypeAyyay },
              { title: '权限说明', dataIndex: 'description', sorter: true },
              { title: '创建时间', dataIndex: 'createAt', sorter: true },
              { title: '更新时间', dataIndex: 'updateAt', sorter: true },
              {
                title: '操作', dataIndex: 'action', render: (text, record) => {
                  return <a onClick={() => this.setState({ visible: true, data: record })}>查看</a>
                }
              },
            ]}
            rowKey="id"
            dataUrl="/api/query_page/find2"
            defaultLoadData={true}
            dataSourceJsonPath="$.records"
            totalJsonPath="$.total"
            pageSizeJsonPath="$.size"
            currentJsonPath="$.current"
          />
        </Card>
        <Modal
          title="数据详情"
          width={800}
          cancelButtonProps={{ style: { display: "none" } }}
          visible={visible}
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
        >
          <DetailForm
            columnCount={2}
            labelWidthPercent={0.35}
            labelSuffix=":"
            data={data}
            label={{
              id: "主键id",
              sysName: "系统(或服务)名称",
              title: "权限标题",
              permissionStr: "唯一权限标识",
              resourcesType: "权限类型",
              description: "权限说明",
              createAt: "创建时间",
              updateAt: "更新时间",
            }}
            dataTransform={{
              title: { columnCount: 2 },
              description: { columnCount: 2 },
              resourcesType: ResourcesTypeAyyay,
            }}
          />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
