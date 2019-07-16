import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
import { EditorMD } from '@/components/MarkdownEditor';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

class Demo1 extends PureComponent {

  state = {
    count: 0,
    value: `
### 关于 Editor.md
**Editor.md** 是一款开源的、可嵌入的 Markdown 在线编辑器（组件），基于 CodeMirror、jQuery 和 Marked 构建。`,
  }

  render() {
    const { count, value } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button
            onClick={() => {
              this.setState({ count: count + 1 });
              if (!this.editorMD) return;
              // eslint-disable-next-line no-console
              console.log("getValue", this.editorMD.getValue());
              // eslint-disable-next-line no-console
              console.log("getHTML", this.editorMD.getHTML());
              // eslint-disable-next-line no-console
              console.log("getMarkdown", this.editorMD.getMarkdown());
            }}
          >
            {count}
          </Button>
          <br />
          <br />
          <br />
          <EditorMD
            ref={editorMD => { this.editorMD = editorMD; }}
            height={600}
            // height="100%"
            editorMDProps={{
              // watch: false,
              markdown: value,
              saveHTMLToTextarea: true,
              placeholder: "请输入Markdown文本...",
              // "full" | "simple" | "mini"
              toolbarIcons: "full",
            }}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
