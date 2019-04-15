import React, { PureComponent } from 'react';
import { Row, Col, Form, Button } from 'antd';
// import classNames from 'classnames';
// import styles from './index.less';

@Form.create()
class FormEngine extends PureComponent {
  // static defaultProps = {
  //   backText: 'back to home',
  //   redirect: '/',
  // };

  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  render() {
    return (
      <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
        <div>
          <Row>
            <Col>
              123
            </Col>
          </Row>
        </div>
      </Form>
    );
  }
}

export default FormEngine;
