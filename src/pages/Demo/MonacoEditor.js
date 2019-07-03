import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
// import ZH_cn from "monaco-editor/min/vs/editor/editor.main.nls.zh-cn";
import MonacoEditor from 'react-monaco-editor';
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
    code: `// type your code...
import pxToViewPort from 'postcss-px-to-viewport';

const config = {
  ...otherConfig,
  extraPostCSSPlugins: [
    pxToViewPort({
      viewportWidth: 375,
      viewportHeight: 667,
      unitPrecision: 5,
      viewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
    }),
  ],
};
    `,
  }

  render() {
    const { count, code } = this.state;
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: 'line',
      automaticLayout: false,
      contextmenu: false,
      minimap: {
        enabled: false,
      }
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button onClick={() => this.setState({ count: count + 1 })}>{count}</Button>
          <br />
          <br />
          <br />
          <div style={{ border: "1px solid #d1d1d1", borderRadius: 1, width: "calc(100% - 50px)", height: 450 }}>
            <MonacoEditor
              height="100%"
              width="100%"
              language="javascript"
              theme="vs-dark"
              value={code}
              options={options}
              // requireConfig={{
              //   'vs/nls': { availableLanguages: { '*': 'zh-cn' } }
              // }}
              editorDidMount={(editor) => editor.focus()}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
