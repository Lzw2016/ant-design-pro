import React, { PureComponent } from 'react';
import { Card, Spin, Row, Col, Input, message } from 'antd';
import { connect } from 'dva';
import lodash from 'lodash';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

@connect(({ TranslateModel, loading }) => ({
  TranslateModel,
  translateLoading: loading.effects['TranslateModel/translateBaidu'],
}))
class Baidu extends PureComponent {
  state = {
    from: 'auto',
    to: 'en',
    q: undefined,
    trans: undefined,
    taskLoading: false,
    task: { count: 0, total: 0 },
  }

  translate = () => {
    const { dispatch } = this.props;
    const { from, to } = this.state;
    let { q } = this.state;
    q = lodash.trim(q);
    if (q.indexOf("{") !== 0) {
      q = `{ ${q} }`;
    }
    try {
      q = JSON.parse(q);
    } catch (err) {
      message.error('翻译数据不是标准的Json格式');
      // eslint-disable-next-line no-console
      console.log(q);
      // eslint-disable-next-line no-console
      console.log(err);
      return;
    }
    const trans = {};
    let count = 0;
    const total = lodash.keys(q).length;
    this.setState({ task: { count, total }, taskLoading: true });
    lodash.forEach(q, (value, key) => {
      trans[key] = "";
      // 请求数据
      dispatch({
        type: 'TranslateModel/translateBaidu',
        payload: { from, to, q: value },
        callBack: transResult => {
          let tmp = "";
          transResult.forEach(item => { tmp += item.dst })
          trans[key] = tmp;
          count++;
          if (count === total) {
            this.setState({ trans, taskLoading: false, task: { count, total } });
          } else {
            this.setState({ trans: undefined, taskLoading: true, task: { count, total } });
          }
        },
      });
    });
  }

  parseTrans = (trans) => {
    if (!trans) return '';
    let tmp = "";
    lodash.forEach(trans, (value, key) => {
      if (tmp.length > 0) {
        tmp += "\r\n"
      }
      tmp += `  "${key}": "${value}",`;
    });
    return `{\r\n${tmp}\r\n}`;
  }

  render() {
    const { from, to, q, trans, taskLoading, task } = this.state;
    const { translateLoading } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Spin tip={`正在翻译中(${task.count}/${task.total})...`} spinning={taskLoading || !!translateLoading}>
            <Row gutter={16}>
              <Col span={12}>
                <Input
                  addonBefore="当前语言"
                  defaultValue="auto"
                  value={from}
                  onChange={({ target: { value } }) => this.setState({ "from": value })}
                />
                <Input
                  addonBefore="目标语言"
                  defaultValue="en"
                  value={to}
                  onChange={({ target: { value } }) => this.setState({ "to": value })}
                  addonAfter={<span onClick={this.translate} style={{ cursor: 'pointer' }}>开始翻译</span>}
                  style={{ marginTop: 8 }}
                />
                <Input.TextArea
                  value={q}
                  onChange={({ target: { value } }) => this.setState({ "q": value })}
                  placeholder="粘贴“src/locales/***.js”中的内容，完整的JS"
                  autosize={{ minRows: 30, maxRows: 30 }}
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col span={12}>
                <Input.TextArea
                  value={(taskLoading || !!translateLoading) ? '正在翻译...' : this.parseTrans(trans)}
                  placeholder="翻译完成的内容"
                  autosize={{ minRows: 30, maxRows: 30 }}
                  style={{ marginTop: 80 }}
                />
              </Col>
            </Row>
          </Spin>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Baidu;
