import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
import { NEditor } from '@/components/RichTextEditor';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

class Demo1 extends PureComponent {

  state = {
    count: 0,
    value: `
<p>
  <strong>111</strong> <span style="text-decoration: underline;">222 </span><em>333&nbsp;</em>
</p>
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
              console.log("getValue", this.neditor.getValue());
              // eslint-disable-next-line no-console
              console.log("getHTML", this.neditor.getHTML());
              // eslint-disable-next-line no-console
              console.log("getMarkdown", this.neditor.getMarkdown());
            }}
          >
            {count}
          </Button>
          <br />
          <br />
          <br />
          <NEditor
            ref={neditor => { this.neditor = neditor; }}
            width="calc(100% - 50px)"
            height={600}
            // height="100%"
            neditorProps={{
              initialContent: value,
              placeholder: "输入富文本"
            }}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
