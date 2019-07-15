import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import IFramePage from '@/components/IFramePage';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

class Demo1 extends PureComponent {

  state = {
    count: 0,
  }

  render() {
    const { count } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button
            onClick={() => {
              this.setState({ count: count + 1 });
              if (this.frame) {
                const frameW = this.frame.getIFrameWindow();
                frameW.test01();
                frameW.test02({
                  f1: "111",
                  f2: "222",
                  f3: "333",
                  count,
                  callBack: (param) => {
                    // eslint-disable-next-line no-console
                    console.log("callBack | ", param);
                  },
                });
              }
            }}
          >
            {count}
          </Button>
          <Button
            onClick={() => {
              if (this.frame) {
                this.frame.setSrc("https://www.baidu.com");
              }
            }}
          >
            百度
          </Button>
          <Button
            onClick={() => {
              if (this.frame) {
                this.frame.postMessage({ f1: "111", f2: "222", f3: "333" }, "*");
              }
            }}
          >
            postMessage
          </Button>
          <br />
          <br />
          <br />
          <IFramePage
            ref={frame => { this.frame = frame; }}
            // src="https://www.baidu.com"
            // src="/iframe-page/editor.md/examples/simple.html"
            src="/iframe-page/demo-page.html"
            style={{ height: 600 }}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
