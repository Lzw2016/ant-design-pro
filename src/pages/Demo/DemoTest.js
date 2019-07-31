import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

@connect(state => ({
  DemoTestModel: state["Demo.TestModel"],
  loading: state.loading.effects['Demo.TestModel/findByPage'],
}))
class DemoTest extends PureComponent {
  state = {
    text: '啦啦啦啦测试',
  };

  render() {
    const { dispatch, DemoTestModel: { test } } = this.props
    const { text } = this.state;
    return (
      <PageHeaderWrapper title="测试">
        <Card bordered={false}>
          <p>{text}</p>
          <Button type="primary" onClick={() => dispatch({ type: 'Demo.TestModel/save', payload: { test: (test + 1) } })}>测试按钮</Button>
          <div>{test}</div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DemoTest;
