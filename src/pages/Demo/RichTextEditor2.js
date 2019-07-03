import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './RichTextEditor.less';

// @connect(({ DemoTestModel, loading }) => ({
//   DemoTestModel,
//   loading: loading.effects['DemoTestModel/findByPage'],
// }))
class Demo1 extends PureComponent {

  state = {
    count: 0,
    editorState: BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'),
  }

  render() {
    const { count, editorState } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button onClick={() => this.setState({ count: count + 1 })}>{count}</Button>
          <br />
          <br />
          <br />
          <div style={{ border: "1px solid #d1d1d1", borderRadius: 5, width: "calc(100% - 50px)", height: 450 }}>
            <BraftEditor
              controls={[
                'undo', 'redo', 'separator',
                'font-size', 'line-height', 'letter-spacing', 'separator',
                'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
                'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
                'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
                'link', 'separator', 'hr', 'separator',
                // 'media', 'separator',
                'clear', 'fullscreen'
              ]}
              value={editorState}
              onChange={editorStateParam => this.setState({ editorState: editorStateParam })}
            />
          </div>

        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
