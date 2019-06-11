import React, { PureComponent, Fragment } from 'react';
import { Modal } from 'antd';
// import lodash from 'lodash';
// import classNames from 'classnames';
import { FormEngine } from '@/components/FormEngine';
// import DisplayEnum from './DisplayEnum';
// import RulesEnum from './RulesEnum';
// import styles from './index.less';

class FormModal extends PureComponent {
  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // // 加载完成
  // componentDidMount() {
  //   // this.tick();
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
    // 内部是否显示
    internalVisible: false,
    // 表单提交状态
    submitLoading: false,
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getFormModal = ({
    title,
    visible,
    width,
    modalProps,
    defaultLabelCol,
    columnCount,
    resetValues,
    defaultValues,
    defaultRules,
    formFields,
    defaultRowProps,
    formEngineProps,
  }) => {
    const { internalVisible, submitLoading } = this.state;
    const props = {};
    if (visible === undefined || visible === null) {
      props.onCancel = () => this.setState({ internalVisible: false });
    }
    return (
      <Modal
        title={title}
        width={width}
        visible={(visible === undefined || visible === null) ? internalVisible : visible}
        mask={true}
        maskClosable={false}
        bodyStyle={{ padding: "24px 24px 8px 24px" }}
        {...modalProps}
        {...props}
        onOk={this.handleSubmit}
        confirmLoading={submitLoading}
      >
        <FormEngine
          saveForm={form => { this.form = form }}
          defaultLabelCol={defaultLabelCol}
          columnCount={columnCount}
          resetValues={resetValues}
          defaultValues={defaultValues}
          defaultRules={defaultRules}
          formFields={formFields}
          defaultRowProps={defaultRowProps}
          {...formEngineProps}
          actionsConfig={{
            render: <span />,
          }}
        />
      </Modal>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleSubmit = () => {
    const { form } = this;
    if (!form) return;
    form.validateFields((err, formValues) => {
      if (err) return;
      console.log("handleSubmit --> ", formValues);
    });
  }

  render() {
    const {
      title = undefined,              // 对话框表单标题
      visible = undefined,            // 是否显示对话框表单
      width = 520,                    // 对话框表单宽度
      modalProps = {},                // 对话框表单属性
      defaultLabelCol,                // 默认全局的Form.Item labelCol属性(wrapperCol属性是通过labelCol值计算得出)
      columnCount = 1,                // 表单布局列数(支持1、2、3、4、6)
      resetValues = {},               // 表单重置值配置
      defaultValues = {},             // 表单字段默认值
      defaultRules = [],              // 默认全局校验
      formFields = {},                // 表单字段配置
      defaultRowProps = {},           // Row组件默认属性配置
      formEngineProps = {},           // 表单引擎属性
      children,                       // 子组件
    } = this.props;
    if (children) {
      React.Children.only(children);
    }
    return (
      <Fragment>
        {
          this.getFormModal({
            title,
            visible,
            width,
            modalProps,
            defaultLabelCol,
            columnCount,
            resetValues,
            defaultValues,
            defaultRules,
            formFields,
            defaultRowProps,
            formEngineProps,
          })
        }
        {
          React.Children.count(children) > 0 ?
            (visible === undefined || visible === null) ?
              <span onClick={() => this.setState({ internalVisible: true })}>{children}</span>
              : children
            : ""
        }
      </Fragment>
    )
  }
}

export default FormModal;
