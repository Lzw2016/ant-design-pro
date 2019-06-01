import React, { PureComponent } from 'react';
import { Card, Row, Col, Icon, Tooltip } from 'antd';
// import debounce from 'lodash/debounce';
import { InputLimit, TextAreaLimit } from '@/components/InputLimit'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './ImageUpload.less'

class DemoTest extends PureComponent {

  state = {

  };

  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row gutter={16}>
            <Col span={8}>
              <InputLimit
                maxLength={8}
                inputStyle={{ width: 230 }}
              />
            </Col>
            <Col span={8}>
              <InputLimit
                maxLength={120}
                inputStyle={{ width: 230 }}
              />
            </Col>
            <Col span={8}>
              <InputLimit
                maxLength={90}
              />
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={8}>
              <InputLimit
                maxLength={100}
                inputStyle={{ width: 230 }}
                allowClear={true}
              />
            </Col>
            <Col span={8}>
              <InputLimit
                maxLength={8}
                inputStyle={{ width: 230 }}
                allowClear={true}
                inputProps={{
                  prefix: <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />

                }}
              />
            </Col>
            <Col span={8}>
              <InputLimit
                maxLength={56}
                inputStyle={{ width: 350 }}
                allowClear={true}
                suffix={
                  <Tooltip title="自定义提示">
                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
                inputProps={{
                  placeholder: "字符输入限制、后缀",
                  prefix: <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />,
                }}
              />
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={8}>
              <InputLimit
                maxLength={56}
                inputStyle={{ width: 350 }}
                allowClear={true}
                inputProps={{
                  placeholder: "清除输入、字符输入限制",
                }}
              />
            </Col>
            <Col span={8}>
              <InputLimit
                maxLength={56}
                inputStyle={{ width: 350 }}
                suffix={
                  <Tooltip title="自定义提示">
                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
                inputProps={{
                  placeholder: "字符输入限制、后缀",
                }}
              />
            </Col>
            <Col span={8}>
              <InputLimit
                maxLength={56}
                inputStyle={{ width: 350 }}
                allowClear={true}
                preventInput={true}
                suffix={
                  <Tooltip title="自定义提示">
                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
                inputProps={{
                  placeholder: "清除输入、字符输入限制、后缀",
                }}
              />
            </Col>
          </Row>

          <br />
          <Row gutter={16}>
            <Col span={8}>
              <InputLimit
                maxLength={100}
                inputStyle={{ width: 230 }}
                allowClear={true}
              />
            </Col>
            <Col span={8}>
              <InputLimit
                maxLength={8}
                inputStyle={{ width: 230 }}
                allowClear={true}
                inputProps={{
                  prefix: <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />

                }}
              />
            </Col>
            <Col span={8}>
              <InputLimit
                maxLength={56}
                inputStyle={{ width: 350 }}
                allowClear={true}
                suffix={
                  <Tooltip title="自定义提示">
                    <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
                inputProps={{
                  placeholder: "字符输入限制、后缀",
                  prefix: <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />,
                }}
              />
            </Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={8}>
              <TextAreaLimit
                maxLength={10}
                textAreaStyle={{ width: 350 }}
                preventInput={true}
                autosize={false}
                textAreaProps={{
                  placeholder: "autosize={false}",
                }}
              />
            </Col>
            <Col span={8}>
              <TextAreaLimit
                maxLength={56}
                autosize={true}
                textAreaProps={{
                  placeholder: "autosize={true}",
                }}
              />
            </Col>
            <Col span={8}>
              <TextAreaLimit
                maxLength={56}
                textAreaStyle={{ width: 350 }}
                autosize={{ minRows: 2, maxRows: 6 }}
                textAreaProps={{
                  placeholder: "autosize={{ minRows: 2, maxRows: 6 }}",
                }}
              />
            </Col>
          </Row>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default DemoTest;
