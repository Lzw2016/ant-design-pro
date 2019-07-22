
import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
import MonacoEditor from '@/components/MonacoEditor';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

class Demo1 extends PureComponent {

  state = {
    count: 0,
    value: `
public class JavaTester {
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}

`,
  }

  render() {
    const { count, value } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button
            onClick={() => {
              this.setState({ count: count + 1 });
              if (!this.monaco) return;
              // eslint-disable-next-line no-console
              console.log("getValue", this.monaco.getValue());
            }}
          >
            {count}
          </Button>
          <br />
          <br />
          <br />
          <MonacoEditor
            ref={monaco => { this.monaco = monaco; }}
            width="calc(100% - 50px)"
            height={600}
            // height="100%"
            monacoProps={{
              theme: 'vs-dark',
              value,
              language: 'java',
              lineNumbers: true,
              readOnly: false,
              contextmenu: true,
            }}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
