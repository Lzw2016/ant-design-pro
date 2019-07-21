
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
              if (!this.neditor) return;
              // eslint-disable-next-line no-console
              console.log("getAllHtml", this.neditor.getAllHtml());
              // eslint-disable-next-line no-console
              console.log("getPlainTxt", this.neditor.getPlainTxt());
              // eslint-disable-next-line no-console
              console.log("getContentTxt", this.neditor.getContentTxt());
            }}
          >
            {count}
          </Button>
          <br />
          <br />
          <br />
          <MonacoEditor
            ref={neditor => { this.neditor = neditor; }}
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
              minimap: {
                enabled: false
              },
            }}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
