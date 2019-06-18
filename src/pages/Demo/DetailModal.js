import React, { PureComponent } from 'react';
import { Card, Icon } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import DetailModal from '@/components/DetailModal';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

// @connect(({ DemoTestModel, loading }) => ({
//   DemoTestModel,
//   loading: loading.effects['DemoTestModel/findByPage'],
// }))
class Demo1 extends PureComponent {

  state = {
    label: {
      name: <span style={{ color: "#4A90E2" }}>班次名称</span>,
      dutyType: "班次类型",
      deptName: "所属部门",
      startTime: { label: "上班时间", style: { color: "red" } },
      endTime: "下班时间",
      onRange: "上班打卡时间范围",
      offRange: "下班打卡时间范围",
      duration: <span><Icon type="info-circle" /> 午休时间</span>,
      stats: "状态",
    },
    data: {
      name: "freemenL",
      dutyType: "早班",
      deptName: "技术研发部 xxx部门 xxx部门 xxx部门",
      startTime: "9:00",
      endTime: "6:00",
      onRange: "9:00-9:30",
      offRange: "6:00-11:59",
      duration: "1小时",
      stats: 1,
    },
    dataTransform: {
      endTime: { style: { color: "red" } },
      duration: (value, key, data) => {
        // eslint-disable-next-line no-console
        console.log("duration | ", data);
        return `${value} [${key}]`;
      },
      deptName: { columnCount: 2 },
      // startTime: { columnCount: 3 },
      stats: [{ value: 1, label: "成功" }, { value: 0, label: "失败" }]
    }
  }

  render() {
    const { data, label, dataTransform } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <DetailModal
            initVisible={true}
            maskClosable={false}
            modalTitle="数据详情"
            columnCount={2}
            labelWidthPercent={0.36}
            labelSuffix=":"
            data={data}
            label={label}
            dataTransform={dataTransform}
          >
            <a>查看详情</a>
          </DetailModal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
