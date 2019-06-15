import React, { PureComponent } from 'react';
import { Card, Modal } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import DetailForm from '@/components/DetailForm';
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
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <PagingQueryPage />
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
