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
            <Col span={6}>
              <ImageUpload />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default DemoTest;
