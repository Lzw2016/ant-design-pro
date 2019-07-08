import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
// import SyntaxHighlighter from 'react-syntax-highlighter';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import TomorrowNightEighties from 'react-syntax-highlighter/dist/esm/styles/hljs/tomorrow-night-eighties';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './CodeMirrorEditor.less';

SyntaxHighlighter.registerLanguage('javascript', js);
class Demo1 extends PureComponent {
  state = {
    count: 0,
    code: `
// type your code...
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
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button onClick={() => this.setState({ count: count + 1 })}>{count}</Button>
          <br />
          <br />
          <br />
          <div style={{ width: "calc(100% - 50px)", height: 450 }}>
            {/* <SyntaxHighlighter
              style={TomorrowNightEighties}
              showLineNumbers={true}
              language='javascript'
              customStyle={{ height: 350, marginTop: 20 }}
            >
              {code}
            </SyntaxHighlighter> */}

            <SyntaxHighlighter
              style={TomorrowNightEighties}
              customStyle={{ height: "100%" }}
              language="javascript"
              showLineNumbers={true}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
