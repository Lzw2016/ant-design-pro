import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
// import { InputEnum } from '@/components/FormEngine';
import { WangEditor, Neditor } from '@/components/RichTextEditor';
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
          <WangEditor
            defaultValue="默认值123 😁"
            defaultFullscreen={false}
            textContainerStyle={{ height: "450px" }}
            // className={styles["wang-editor"]}
            style={{ width: "calc(100% - 50px)" }}
          />
          <br />
          <br />
          <br />
          <Neditor style={{ width: "calc(100% - 50px)" }} />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
