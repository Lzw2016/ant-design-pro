import React, { PureComponent } from 'react';
import { Card, Row, Col, Select } from 'antd';
// import debounce from 'lodash/debounce';
// import RemoteSelectInput from '@/components/RemoteSelectInput'
import RemoteSelect from '@/components/RemoteSelect'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

class DemoTest extends PureComponent {

  state = {

  };

  render() {
    // console.log("data", data);
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={6}>
              <RemoteSelect
                defaultLoadData={true}
                url="/api/remote/input/object"
                searchParamName="key"
                requestInterceptor={({ url, options }) => {
                  console.log("---->", url, options);
                }}
                requestError={err => {
                  console.log("---->", err)
                }}
                responseFilter={(resData, response) => {
                  console.log("---->", resData, response);
                }}
                dataValueKey="column1"
                dataLabelKey="column2"
                selectProps={{
                  placeholder: "输入关键字搜索",
                }}
              />
            </Col>
            <Col span={6}>
              <RemoteSelect
                defaultLoadData={false}
                url="/api/remote/input/string"
                searchParamName="key"
                searchQueryString={{ num: 6 }}
                requestOptions={{ method: "get" }}
              />
            </Col>
            <Col span={6}>
              <RemoteSelect
                defaultLoadData={["111", "222", "333", "444", "555", "666"]}
                selectProps={{
                  filterOption: true,
                }}
              />
            </Col>
            <Col span={6}>
              <RemoteSelect
                defaultLoadData={["AAA", "bbb", "CCC", "DDD", "EEE", "fff"]}
                defaultValue={{ key: "CCC" }}
                selectProps={{
                  showSearch: false,
                  filterOption: false,
                }}
              />
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={6}>
              <RemoteSelect
                defaultLoadData={["AAA", "bbb", "CCC", "DDD", "EEE", "fff"]}
                defaultValue="bbb"
                selectProps={{
                  labelInValue: false,
                }}
              />
            </Col>
            <Col span={6}>
              <RemoteSelect
                defaultLoadData={["#1890ff", "#52c41a", "#faad14", "#f5222d", "RED", "#000"]}
                render={(key, value, label, item) => <span style={{ color: item }}>{item}</span>}
                onChange={value => console.log("---->", value)}
              />
            </Col>
          </Row>
          <br />
          <Row span={6}>
            <Col span={6}>
              <Select allowClear={true} placeholder="请输入关键字搜索" defaultValue="CCC" style={{ width: 260 }}>
                {["AAA", "bbb", "CCC", "DDD", "EEE", "fff"].map(item => <Select.Option key={item} value={item}>{item}</Select.Option>)}
              </Select>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DemoTest;
