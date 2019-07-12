import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
// import { Editor } from 'slate-react';
import 'jquery/dist/jquery';
import 'editor.md/editormd';
import 'editor.md/css/editormd.css';
// import MarkdownEditor from '@/components/MarkdownEditor';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

// @connect(({ DemoTestModel, loading }) => ({
//   DemoTestModel,
//   loading: loading.effects['DemoTestModel/findByPage'],
// }))
class Demo1 extends PureComponent {

  state = {
    count: 0,
  }

  // 加载完成
  componentDidMount() {

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
          <div style={{ width: "calc(100% - 50px)", height: 450 }}>
            <div id="test-editor">
              <textarea style={{ display: "none" }}>
                ### 关于 Editor.md
                **Editor.md** 是一款开源的、可嵌入的 Markdown 在线编辑器（组件），基于 CodeMirror、jQuery 和 Marked 构建。
              </textarea>
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
