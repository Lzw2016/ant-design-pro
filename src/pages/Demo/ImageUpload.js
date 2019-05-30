import React, { PureComponent } from 'react';
import { Card, Row, Col, Button } from 'antd';
// import debounce from 'lodash/debounce';
import ImageUpload from '@/components/ImageUpload'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
import styles from './ImageUpload.less'

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
                fileUrlJsonPath="$.successList[0].readUrl"
                previewUrlPrefix="/api/file"
                showAlert={false}
              />
            </Col>
            <Col span={12}>
              <ImageUpload
                uploadUrl="/api/file/upload"
                extFormData={{ fileSource: "test" }}
                fileMaxSizeByMB={2}
                fileMaxCount={3}
                fileUrlJsonPath="$.successList[0].readUrl"
                previewUrlPrefix="/api/file"
                widthMinPixel={1920}
                highMinPixel={1080}
                widthMaxPixel={1920}
                highMaxPixel={1080}
                aspectRatioArray={[{ w: 5, h: 3 }, { w: 16, h: 9 }]}
                alertStyle={{ width: 310 }}
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <ImageUpload
                uploadUrl="/api/file/upload"
                extFormData={{ fileSource: "test" }}
                fileMaxSizeByMB={2}
                fileMaxCount={3}
                fileUrlJsonPath="$.successList[0].readUrl"
                previewUrlPrefix="/api/file"
                widthMaxPixel={1920}
                highMaxPixel={1080}
                aspectRatioArray={[{ w: 5, h: 3 }, { w: 16, h: 9 }]}
                alertStyle={{ width: 310 }}
              />
            </Col>
            <Col span={12}>
              <ImageUpload
                uploadUrl="/api/file/upload"
                extFormData={{ fileSource: "test" }}
                fileMaxSizeByMB={2}
                fileMaxCount={3}
                fileUrlJsonPath="$.successList[0].readUrl"
                previewUrlPrefix="/api/file"
                showAlert={false}
                accept=".*"
                uploadProps={{
                  listType: "text",
                }}
                wrapStyle={{ width: 500 }}
                uploadWrapClassName={styles['upload-file']}
              >
                <Button icon="upload">上传</Button>
              </ImageUpload>
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default DemoTest;
