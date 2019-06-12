import React, { PureComponent, Fragment } from 'react';
import { Modal, message } from 'antd';
// import lodash from 'lodash';
// import classNames from 'classnames';
import { FormEngine } from '@/components/FormEngine';
import { TypeEnum, varTypeOf } from '../_utils/varTypeOf';
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
    okText,
    okType,
    cancelText,
    modalBodyStyle,
    modalProps,
    defaultLabelCol,
    columnCount,
    resetValues,
    defaultValues,
    defaultRules,
    formFields,
    defaultRowProps,
    formEngineProps,
    onSubmit,
    submitUrl,
    submitMethod,
    requestInterceptor,
    submitSuccessful,
    submitFailure,
    submitSuccessfulResetForm,
  }) => {
    const { internalVisible, submitLoading } = this.state;
    const props = {};
    if (visible === undefined || visible === null) {
      props.onCancel = () => this.setState({ internalVisible: false });
    }
    // 提交中窗口不可关闭
    if (submitLoading === true) {
      props.closable = false;
      props.cancelButtonProps = { ...(modalProps.cancelButtonProps || {}), disabled: true };
    }
    return (
      <Modal
        title={title}
        width={width}
        okText={okText}
        okType={okType}
        cancelText={cancelText}
        visible={(visible === undefined || visible === null) ? internalVisible : visible}
        mask={true}
        maskClosable={false}
        bodyStyle={{ padding: "24px 24px 8px 24px", ...modalBodyStyle }}
        confirmLoading={submitLoading}
        {...modalProps}
        {...props}
        onOk={() => this.handleSubmit(submitUrl, submitMethod, requestInterceptor, submitSuccessful, submitFailure, onSubmit, submitSuccessfulResetForm)}
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

  handleSubmit = (submitUrl, submitMethod, requestInterceptor, submitSuccessful, submitFailure, onSubmit, submitSuccessfulResetForm) => {
    const { form } = this;
    if (!form) return;
    form.validateFields((err, formValues) => {
      // console.log("handleSubmit --> ", formValues);
      if (err) return;
      // 事件处理
      if (onSubmit instanceof Function) onSubmit(formValues, form);
      // 发送提交请求
      if (!submitUrl) return;
      const fetchOptions = {
        url: submitUrl,
        options: { method: submitMethod, body: formValues, headers: { "Content-Type": "application/json" } },
      };
      // 请求之前的拦截
      if (requestInterceptor instanceof Function) {
        const tmp = requestInterceptor(fetchOptions);
        if (tmp === false) return;
        if (tmp && tmp.url) fetchOptions.url = tmp.url;
        if (tmp && tmp.options) fetchOptions.options = tmp.options;
      }
      this.setState({ submitLoading: true });
      // 请求数据序列化
      if (fetchOptions.options && fetchOptions.options.body && varTypeOf(fetchOptions.options.body) === TypeEnum.object) {
        fetchOptions.options.body = JSON.stringify(fetchOptions.options.body)
      }
      fetch(fetchOptions.url, fetchOptions.options)
        .then(async response => {
          this.setState({ submitLoading: false });
          const resData = await response.json();
          if (response.status < 200 || response.status >= 400) {
            if (submitFailure instanceof Function && submitFailure(resData, response) === false) return;
            if (resData && (resData.message || resData.error)) {
              message.warning(resData.message || resData.error);
            }
            return;
          }
          // 提交成功
          this.setState({ internalVisible: false });
          // 重置表单
          if (submitSuccessfulResetForm === true && form) setTimeout(() => form.resetFields(), 200);
          // 自定义事件
          if (submitSuccessful instanceof Function) submitSuccessful(resData, response);
        })
        .catch(error => {
          this.setState({ submitLoading: false });
          if (submitFailure instanceof Function) submitFailure(undefined, undefined, error);
        });
    });
  }

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  render() {
    const {
      saveForm,                         // 保存表单Form对象 (form) => ()
      title = undefined,                // 对话框表单标题
      visible = undefined,              // 是否显示对话框表单
      width = 520,                      // 对话框表单宽度
      okText = "确定",                   // 确定按钮 string | ReactNode
      okType = "primary",               // 确定按钮样式类型
      cancelText = "取消",               // 取消按钮 string | ReactNode
      modalBodyStyle = {},              // Modal body 样式
      modalProps = {},                  // 对话框表单属性
      defaultLabelCol,                  // 默认全局的Form.Item labelCol属性(wrapperCol属性是通过labelCol值计算得出)
      columnCount = 1,                  // 表单布局列数(支持1、2、3、4、6)
      resetValues = {},                 // 表单重置值配置
      defaultValues = {},               // 表单字段默认值
      defaultRules = [],                // 默认全局校验
      formFields = {},                  // 表单字段配置
      defaultRowProps = {},             // Row组件默认属性配置
      formEngineProps = {},             // 表单引擎属性
      onSubmit,                         // 表单提交事件 (formValues, form) => ()
      submitUrl = undefined,            // 数据提交给服务端地址
      submitMethod = "post",            // 数据提交 Method
      requestInterceptor = undefined,   // 请求之前的拦截 ({ url, options }) => (boolean | {url, options })
      submitSuccessful = undefined,     // 提交成功回调 (resData, response) => ()
      submitFailure = undefined,        // 提交失败回调 (resData, response, error) => (boolean)
      submitSuccessfulResetForm = true, // 提交成功后是否需要重置表单
      children,                         // 子组件
    } = this.props;
    if (this.form && this.saveFormFlag !== true && saveForm instanceof Function) {
      saveForm(this.form);
      this.saveFormFlag = true;
    }
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
            okText,
            okType,
            cancelText,
            modalBodyStyle,
            modalProps,
            defaultLabelCol,
            columnCount,
            resetValues,
            defaultValues,
            defaultRules,
            formFields,
            defaultRowProps,
            formEngineProps,
            onSubmit,
            submitUrl,
            submitMethod,
            requestInterceptor,
            submitSuccessful,
            submitFailure,
            submitSuccessfulResetForm,
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
