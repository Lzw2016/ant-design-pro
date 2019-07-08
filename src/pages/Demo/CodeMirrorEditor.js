import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
// import ZH_cn from "monaco-editor/min/vs/editor/editor.main.nls.zh-cn";
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
import styles from './CodeMirrorEditor.less';

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
      mode: 'javascript',
      theme: 'material',
      lineNumbers: true,
      // height: "100%",
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button onClick={() => this.setState({ count: count + 1 })}>{count}</Button>
          <br />
          <br />
          <br />
          <div style={{ width: "calc(100% - 50px)", height: 450 }}>
            <CodeMirror
              className={styles['code-mirror']}
              value={code}
              options={options}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
