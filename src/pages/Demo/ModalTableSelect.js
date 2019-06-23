import React, { PureComponent } from 'react';
import { Card, Button, Table } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import { InputEnum } from '@/components/FormEngine';
import ModalTableSelect from '@/components/ModalTableSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

const ResourcesTypeAyyay = [
  { value: 1, label: "web资源权限", color: "#faad14" },
  { value: 2, label: "菜单权限", color: "#52c41a" },
  { value: 3, label: "ui权限", color: "#f5222d" },
]

const columns = [
  { title: '主键id', dataIndex: 'id', sorter: true, defaultSortOrder: "ascend", orderFieldParam: "id" },
  { title: '系统(或服务)名称', dataIndex: 'sysName', sorter: true },
  { title: '权限标题', dataIndex: 'title', sorter: true, contentMaxLength: 30 },
  { title: '唯一权限标识', dataIndex: 'permissionStr', sorter: true },
  { title: '权限类型', dataIndex: 'resourcesType', sorter: true, transform: ResourcesTypeAyyay },
  { title: '权限说明', dataIndex: 'description', sorter: true },
  { title: '创建时间', dataIndex: 'createAt', sorter: true },
  { title: '更新时间', dataIndex: 'updateAt', sorter: true },
];

// @connect(({ DemoTestModel, loading }) => ({
//   DemoTestModel,
//   loading: loading.effects['DemoTestModel/findByPage'],
// }))
class Demo1 extends PureComponent {

  state = {
    selectedRowKeys: [],
    selectedRows: [],
  }

  render() {
    const { selectedRowKeys, selectedRows } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <ModalTableSelect
            defaultSelectedRowKeys={selectedRowKeys}
            defaultSelectedRows={selectedRows}
            modalWidth="60%"
            modalTitle="对话框表格选择-数据多选"
            onOk={(rowKeys, rows) => {
              this.setState({ selectedRowKeys: rowKeys, selectedRows: rows });
            }}
            columnCount={3}
            formActionsWidth={240}
            actionsInLastformField={false}
            selectType="multiple"
            formFields={{
              sysName: {
                label: "系统名称",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "请输入系统名称",
                  allowClear: true,
                },
              },
              title: {
                label: "权限标题",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "请输入权限标题",
                  allowClear: true,
                },
              },
              permissionStr: {
                label: "权限标识",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "请输入唯一权限标识",
                  allowClear: true,
                },
              },
            }}
            columns={columns}
            rowKey="id"
            dataUrl="/api/query_page/find2"
            defaultLoadData={true}
            dataSourceJsonPath="$.records"
            totalJsonPath="$.total"
            pageSizeJsonPath="$.size"
            currentJsonPath="$.current"
          >
            <Button type="primary">多选</Button>
          </ModalTableSelect>
          <span style={{ display: "inline-block", width: 32 }} />
          <ModalTableSelect
            defaultSelectedRowKeys={selectedRowKeys}
            defaultSelectedRows={selectedRows}
            modalWidth="60%"
            modalTitle="对话框表格选择-数据多选"
            onOk={(rowKeys, rows) => {
              this.setState({ selectedRowKeys: rowKeys, selectedRows: rows });
            }}
            columnCount={3}
            formActionsWidth={240}
            actionsInLastformField={false}
            selectType="single"
            formFields={{
              sysName: {
                label: "系统名称",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "请输入系统名称",
                  allowClear: true,
                },
              },
              title: {
                label: "权限标题",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "请输入权限标题",
                  allowClear: true,
                },
              },
              permissionStr: {
                label: "权限标识",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "请输入唯一权限标识",
                  allowClear: true,
                },
              },
            }}
            columns={columns}
            rowKey="id"
            dataUrl="/api/query_page/find2"
            defaultLoadData={true}
            dataSourceJsonPath="$.records"
            totalJsonPath="$.total"
            pageSizeJsonPath="$.size"
            currentJsonPath="$.current"
          >
            <Button type="primary">单选</Button>
          </ModalTableSelect>
          <br />
          <br />
          <span>{selectedRowKeys.length} --- {selectedRows.length}</span>
          <br />
          <Table
            size="middle"
            bordered={true}
            rowKey="id"
            columns={columns}
            dataSource={selectedRows}
            pagination={false}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
