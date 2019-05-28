import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
// import debounce from 'lodash/debounce';
import ImageUpload from '@/components/ImageUpload'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

class DemoTest extends PureComponent {

  state = {

  };

  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={12}>
              <ImageUpload
                uploadUrl="/api/file/upload"
                extFormData={{ fileSource: "test" }}
                fileMaxSizeByMB={0.2}
                fileMaxCount={3}
                // uploadProps={{
                // }}
              />
            </Col>
            <Col span={12}>
              <ImageUpload
                uploadUrl="/api/file/upload"
                extFormData={{ fileSource: "test" }}
                fileMaxSizeByMB={2}
                fileMaxCount={3}
                // uploadProps={{
                // }}
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default DemoTest;
