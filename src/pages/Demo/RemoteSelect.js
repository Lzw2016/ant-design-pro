import React, { PureComponent } from 'react';
import { Card, Select, Spin, Empty, Icon, Row, Col } from 'antd';
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
                defaultLoadData={true}
                url="/api/remote/input/string"
                searchParamName="key"
                searchQueryString={{ num: 3 }}
                requestOptions={{ method: "get" }}
                requestInterceptor={({ url, options }) => {
                  console.log("---->", url, options);
                }}
                requestError={err => {
                  console.log("---->", err)
                }}
                responseFilter={(resData, response) => {
                  console.log("---->", resData, response);
                }}
              />
            </Col>
            <Col span={6}>
              <RemoteSelect
                defaultLoadData={["111", "222", "333", "444", "555", "666"]}
                selectProps={{

                }}
              />
            </Col>
            <Col span={6}>4</Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DemoTest;
