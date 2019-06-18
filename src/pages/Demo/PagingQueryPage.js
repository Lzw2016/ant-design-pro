import React, { PureComponent } from 'react';
import { Card, Modal, Button } from 'antd';
import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import DetailForm from '@/components/DetailForm';
import { InputEnum } from '@/components/FormEngine';
import PagingQueryPage from '@/components/PagingQueryPage';
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
    const values = {
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <PagingQueryPage
            formStyle={{ width: 1300 }}
            defaultLabelCol={{ span: 6 }}
            defaultRowProps={{ gutter: 12 }}
            columnCount={3}
            resetValues={values}
            defaultValues={lodash.merge({}, values)}
            // showFormReset={true}
            // showFormDownUp={true}
            // initFormIsDown={true}
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
              // title: {
              //   label: "权限标题",
              //   InputComponent: InputEnum.DatePicker,
              //   inputProp: {
              //     placeholder: "日期选择",
              //     format: "YYYY年MM月DD日",
              //   },
              // },
              f01: {
                label: "f01",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "f01",
                  allowClear: true,
                },
              },
              f02: {
                label: "f02",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "f02",
                  allowClear: true,
                },
              },
              f03: {
                label: "f03",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "f03",
                  allowClear: true,
                },
              },
              f04: {
                label: "f04",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "f04",
                  allowClear: true,
                },
              },
              f05: {
                label: "f05",
                InputComponent: InputEnum.Input,
                inputProp: {
                  placeholder: "f05",
                  allowClear: true,
                },
              },
            }}
            actionsInLastformField={true}
            actionsContent={loadingParam => {
              return (
                <Button.Group>
                  <Button disabled={loadingParam} icon="plus-circle">功能1</Button>
                  <Button disabled={loadingParam} icon="plus-circle">功能2</Button>
                  <Button disabled={loadingParam} icon="plus-circle">功能3</Button>
                  <Button disabled={loadingParam} icon="plus-circle">功能4</Button>
                  <Button disabled={loadingParam} icon="plus-circle">功能5</Button>
                </Button.Group>
              )
            }}
            columns={[
              { title: '主键id', dataIndex: 'id', sorter: true, defaultSortOrder: "ascend", orderFieldParam: "id" },
              { title: '系统(或服务)名称', dataIndex: 'sysName', sorter: true },
              { title: '权限标题', dataIndex: 'title', sorter: true, contentMaxLength: 30 },
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
    )
  }
}

export default Demo1;
