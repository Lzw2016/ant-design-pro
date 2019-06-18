import React, { PureComponent, Fragment } from 'react';
import { Modal } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
// import classNames from 'classnames';
import DetailForm from '@/components/DetailForm';
// import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
// import { MapperObject } from "../_utils/mapper";
// import styles from './index.less';

class DetailModal extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // // 加载完成
  // componentDidMount() {
  //   // this.tick();
  //   varTypeOfTest();
  // }

  // // 组件更新
  // componentDidUpdate(prevProps) {
  //   // const { target } = this.props;
  // }

  // // 组件卸载之前
  // componentWillUnmount() {
  //   // clearTimeout(this.timer);
  // }

  // 组件状态
  state = {
    // 内部显示状态
    internalVisible: false,
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getModal = () => {
    const { internalVisible } = this.state;
    return (
      <Modal
        // title="详情"
        width={800}
        footer={null}
        cancelButtonProps={{ style: { display: "none" } }}
        visible={internalVisible}
        onOk={() => this.setState({ internalVisible: false })}
        onCancel={() => this.setState({ internalVisible: false })}
      >
        <DetailForm
          columnCount={2}
          labelWidthPercent={0.35}
          labelSuffix=":"
          data={{}}
          label={{
            // id: "主键id",
            // sysName: "系统(或服务)名称",
            // title: "权限标题",
            // permissionStr: "唯一权限标识",
            // resourcesType: "权限类型",
            // description: "权限说明",
            // createAt: "创建时间",
            // updateAt: "更新时间",
          }}
          dataTransform={{
            // title: { columnCount: 2 },
            // description: { columnCount: 2 },
            // resourcesType: ResourcesTypeAyyay,
          }}
        />
      </Modal>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  render() {
    const {
      children,               // 子组件
    } = this.props;
    if (children) {
      React.Children.only(children);
    }
    return (
      <Fragment>
        {
          this.getModal({

          })
        }
        {React.Children.count(children) > 0 ? <span onClick={() => this.setState({ internalVisible: true })}>{children}</span> : ""}
      </Fragment>
    );
  }
}

export default DetailModal;
