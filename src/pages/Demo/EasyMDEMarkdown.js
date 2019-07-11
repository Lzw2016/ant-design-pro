import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
// import { InputEnum } from '@/components/FormEngine';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
// import "prismjs/prism";
// import "prismjs/themes/prism.css";
// import MarkdownEditor from '@/components/MarkdownEditor';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
import styles from './EasyMDEMarkdown.less';

// @connect(({ DemoTestModel, loading }) => ({
//   DemoTestModel,
//   loading: loading.effects['DemoTestModel/findByPage'],
// }))
class Demo1 extends PureComponent {

  state = {
    count: 0,
  }

  render() {
    const { count } = this.state;
    // id?: string;
    // label?: string;
    // onChange: (value: string) => void | any;
    // value?: string;
    // className?: string;
    // extraKeys?: KeyMap;
    // options?: SimpleMDE.Options;
    // events?: SimpleMdeToCodemirror;
    // getMdeInstance?: (instance: SimpleMDE) => void | any;
    // getLineAndCursor?: (position: CodeMirror.Position) => void | any;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button onClick={() => this.setState({ count: count + 1 })}>{count}</Button>
          <br />
          <br />
          <br />
          <div style={{ width: "calc(100% - 50px)", height: 450 }}>
            <SimpleMDE
              style={{ height: "100%" }}
              className={styles['simple-mde']}
              options={{
                placeholder: "输入内容",
                spellChecker: false,
              }}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
