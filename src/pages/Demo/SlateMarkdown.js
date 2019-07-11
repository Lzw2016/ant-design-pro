import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
// import { Editor } from 'slate-react';
// import { Value } from 'slate';
// import { InputEnum } from '@/components/FormEngine';
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
            {/* <Editor
              placeholder="输入内容..."
            /> */}
            Editor
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
