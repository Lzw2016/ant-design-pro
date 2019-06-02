import React, { PureComponent } from 'react';
import { Card, Icon } from 'antd';
import { connect } from 'dva';
import DetailForm from '@/components/DetailForm'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

@connect(({ DemoTestModel, loading }) => ({
  DemoTestModel,
  loading: loading.effects['DemoTestModel/findByPage'],
}))
class DemoTest extends PureComponent {

  state = {
    data: {
      name: "freemenL",
      deptName: "技术研发部 xxx部门 xxx部门 xxx部门xxx部门 xxx部门xxx部门 xxx部门xxx部门 xxx部门xxx部门 xxx部门xxx部门 xxx部门",
      dutyType: "早班",
      startTime: "9:00",
      endTime: "6:00",
      onRange: "9:00-9:30",
      offRange: "6:00-11:59",
      duration: "1小时",
      stats: 1,
    },
    label: {
      name: <span style={{ color: "#4A90E2" }}>班次名称</span>,
      deptName: "所属部门",
      dutyType: "班次类型",
      startTime: { label: "上班时间", style: { color: "red" } },
      endTime: "下班时间",
      onRange: "上班打卡时间",
      offRange: "下班打卡时间",
      duration: <span><Icon type="info-circle" /> 午休时间</span>,
      stats: "状态",
    },
    dataTransform: {
      endTime: { style: { color: "red" } },
      duration: (value, key, data) => {
        // eslint-disable-next-line no-console
        console.log("duration | ", data);
        return `${value} [${key}]`;
      },
      dutyType: { columnCount: 2 },
      // deptName: { columnCount: 2 ,transform : (value, key, data)=> <span title={value}>{value}</span>},
      // startTime: { columnCount: 3 },
      stats: [{ value: 1, label: "成功" }, { value: 0, label: "失败" }]
    },
  }

  render() {
    const { data, label, dataTransform } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <DetailForm
            style={{ width: "65%" }}
            // style={{ width: 800 }}
            // title="表格标题"
            // footer="表格尾部"
            tableStyle={{}}
            tbodyStyle={{}}
            columnCount={4}
            labelWidthPercent={0.36}
            labelSuffix=":"
            data={data}
            label={label}
            dataTransform={dataTransform}
          />
          <br />
          <br />
          <br />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: 100, display: "inline-block" }}>
            很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长:
          </span>

          <DetailForm
            style={{ width: "65%" }}
            // style={{ width: 800 }}
            title="表格标题"
            footer="表格尾部"
            borderColor="rgb(216, 236, 252)"
            backgroundColor="#e7f1fa"
            tableStyle={{}}
            tbodyStyle={{}}
            columnCount={3}
            labelWidthPercent={0.36}
            labelSuffix=":"
            data={data}
            label={label}
            dataTransform={dataTransform}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DemoTest;
