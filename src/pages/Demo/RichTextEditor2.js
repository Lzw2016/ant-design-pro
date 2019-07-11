import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import Table from 'braft-extensions/dist/table';
import 'braft-extensions/dist/table.css';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter';
import 'braft-extensions/dist/code-highlighter.css';
// import 'prismjs/components/prism-java';
// import 'prismjs/components/prism-php';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-c';
// import 'prismjs/components/prism-cpp';
// import 'prismjs/components/prism-go';
// import 'prismjs/components/prism-csharp';
// import 'prismjs/components/prism-swift';
// import 'prismjs/components/prism-json';
// import 'prismjs/components/prism-yaml';
// import 'prismjs/components/prism-objectivec';
// import 'prismjs/components/prism-powershell';
// import 'prismjs/components/prism-sql';
// import 'prismjs/components/prism-typescript';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-css';
// import 'prismjs/components/prism-markup';
import ColorPicker from 'braft-extensions/dist/color-picker';
import 'braft-extensions/dist/color-picker.css';
import HeaderId from 'braft-extensions/dist/header-id';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
import styles from './RichTextEditor2.less';

BraftEditor.use(Table({
  // 默认列数
  defaultColumns: 3,
  // 默认列数
  defaultRows: 3,
  // 插入表格前是否弹出下拉菜单
  withDropdown: true,
  // 指定输出HTML时附加到table标签上的属性字符串
  // exportAttrString: 'style="width: 90%; table-layout: automatic;"',
  // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // includeEditors: ['editor-id-1'],
  // 指定该模块对哪些BraftEditor无效
  // excludeEditors: ['editor-id-2'],
}))

BraftEditor.use(CodeHighlighter({
  syntaxs: [
    { name: 'JavaScript', syntax: 'javascript' },
    { name: 'css', syntax: 'css' },
    { name: 'html', syntax: 'html' },
    // { name: 'php', syntax: 'php' },
    // { name: 'c', syntax: 'c' },
    // { name: 'c++', syntax: 'cpp' },
    // { name: 'go', syntax: 'go' },
    // { name: 'java', syntax: 'java' },
    // { name: 'c#', syntax: 'csharp' },
    // { name: 'php', syntax: 'php' },
    // { name: 'swift', syntax: 'swift' },
    // { name: 'json', syntax: 'json' },
    // { name: 'Yaml', syntax: 'yaml' },
    // { name: 'object-c', syntax: 'objectivec' },
    // { name: 'shell', syntax: 'powershell' },
    // { name: 'sql', syntax: 'sql' },
    // { name: 'TypeScript', syntax: 'typescript' },
    // { name: 'JavaScript', syntax: 'javascript' },
    // { name: 'css', syntax: 'css' },
    // { name: 'html', syntax: 'html' },
  ],
  showLineNumber: false,
  showTools: false,
  // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // includeEditors: ['editor-id-1'],
  // 指定该模块对哪些BraftEditor无效
  // excludeEditors: ['editor-id-2'],
}))

BraftEditor.use(ColorPicker({
  // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // includeEditors: ['editor-id-1'],
  // 指定该模块对哪些BraftEditor无效
  // excludeEditors: ['editor-id-2'],
  // 指定取色器样式主题，支持dark和light两种样式
  theme: 'light',
  clearButtonText: '清除',
  closeButtonText: '关闭',
}))

BraftEditor.use(HeaderId({
  // 指定该模块对哪些BraftEditor生效，不传此属性则对所有BraftEditor有效
  // includeEditors: ['editor-id-1'],
  // 指定该模块对哪些BraftEditor无效
  // excludeEditors: ['editor-id-2'],
}))

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
          <div style={{ border: "1px solid #d1d1d1", borderRadius: 5, width: "calc(100% - 50px)" }} className={styles['braft-editor']}>
            <BraftEditor
              controls={[
                'undo', 'redo', 'separator',
                'font-size', 'line-height', 'letter-spacing', 'separator',
                'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
                'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
                'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
                'link', 'separator', 'hr', 'separator',
                // 'media', 'separator',
                'clear', 'fullscreen',
                'table'
              ]}
              value={editorState}
              onChange={editorStateParam => this.setState({ editorState: editorStateParam })}
              contentStyle={{ height: 450 }}
            />
          </div>

        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
