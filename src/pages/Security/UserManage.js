import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { SecurityModel } from '@/ModelsNamespace';
// import classNames from 'classnames';
// import styles from './Log.less'

@connect(state => ({
  UserManageModel: state[SecurityModel.UserManageModel],
  loading: state.loading.effects[`${SecurityModel.UserManageModel}/findByPage`],
}))
class UserManage extends PureComponent {

  render() {
    // const { UserManageModel } = this.props
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>111222333</div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default UserManage;
