import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

class Demo1 extends PureComponent {

  state = {
    count: 0,
  }

  // 加载完成
  componentDidMount() {
    // eslint-disable-next-line no-console
    console.log("开始加载...");
    const iframe = document.getElementById("iframe-demo");
    iframe.onload = () => {
      // eslint-disable-next-line no-console
      console.log("加载完成");
    };
  }

  render() {
    const { count } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button onClick={() => this.setState({ count: count + 1 })}>{count}</Button>
          <br />
          <br />
          <br />
          <div style={{ width: "calc(100% - 50px)", height: 600 }}>
            <iframe
              id="iframe-demo"
              title="内嵌页面2"
              src={count > 1 ? "https://www.baidu.com" : "/iframe-page/editor.md/examples/simple.html"}
              style={{ border: 0, width: "100%", height: "100%" }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
