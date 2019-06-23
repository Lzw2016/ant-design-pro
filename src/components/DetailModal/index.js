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

  // 构造器
  constructor(props) {
    super(props);
    const { initVisible } = props;
    if (initVisible === true || initVisible === false) this.state.internalVisible = initVisible;
  }

  // // 加载完成
  // componentDidMount() {
  //   // this.tick();
  //   varTypeOfTest();
  // }

  // // 组件更新之前
  // componentWillUpdate(nextProps, nextState) {
  // }

  // // 组件更新
  // componentDidUpdate(prevProps) {
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

  getModal = ({
    modalWidth,
    modalTitle,
    modalFooter,
    cancelButtonProps,
    visible,
    onOk,
    onCancel,
    maskClosable,
    modalProps,
    columnCount,
    labelWidthPercent,
    labelSuffix,
    data,
    label,
    dataTransform,
    detailFormProp,
    dataUrl,
    requestMethod,
    requestOptions,
    requestInterceptor,
    getData,
    dataJsonPath,
    requestError,
    requestSuccessful,
    spinProps,
  }) => {
    const { internalVisible } = this.state;
    return (
      <Modal
        width={modalWidth}
        title={modalTitle}
        footer={modalFooter}
        cancelButtonProps={cancelButtonProps || { style: { display: "none" } }}
        visible={(visible === null || visible === undefined) ? internalVisible : visible}
        onOk={() => this.handleOk(onOk)}
        onCancel={() => this.handleCancel(onCancel)}
        maskClosable={maskClosable}
        {...modalProps}
      >
        <DetailForm
          ref={detailForm => {
            this.detailForm = detailForm;
            if (this.detailForm && this.loadData !== true) {
              this.loadData = true;
              this.detailForm.reLoadData();
            }
          }}
          columnCount={columnCount}
          labelWidthPercent={labelWidthPercent}
          labelSuffix={labelSuffix}
          data={data}
          label={label}
          dataTransform={dataTransform}
          defaultLoadData={false}
          dataUrl={dataUrl}
          requestMethod={requestMethod}
          requestOptions={requestOptions}
          requestInterceptor={requestInterceptor}
          getData={getData}
          dataJsonPath={dataJsonPath}
          requestError={requestError}
          requestSuccessful={requestSuccessful}
          spinProps={spinProps}
          {...detailFormProp}
        />
      </Modal>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleOk = (onOk) => {
    this.setState({ internalVisible: false });
    if (onOk instanceof Function) onOk();
  }

  handleCancel = (onCancel) => {
    this.setState({ internalVisible: false })
    if (onCancel instanceof Function) onCancel();
  }

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  render() {
    const {
      initVisible = false,        // 初始化是否显示
      modalWidth = 800,           // 对话框宽度
      modalTitle = undefined,     // 对话框标题
      modalFooter = null,         // 对话框页脚
      cancelButtonProps,          // 对话框取消按钮属性
      visible,                    // 对话框显示(受控属性)
      onOk,                       // 对话框确定事件
      onCancel,                   // 对话框取消事件
      maskClosable = true,        // 点击蒙层是否允许关闭
      modalProps = {},            // 对话框属性
      columnCount = 1,            // 数据行数
      labelWidthPercent = 0.35,   // label单元格宽度百分比
      labelSuffix = ":",          // label单元格后缀字符串
      label = {},                 // label配置(决定显示字段和排序)
      data = {},                  // 需要显示的数据
      dataTransform = {},         // 数据转换配置
      detailFormProp = {},        // DetailForm 自定义属性
      dataUrl,                    // 数据请求地址
      requestMethod = "GET",      // 请求提交 Method
      requestOptions = {},        // 请求 fetch options(选项)
      requestInterceptor,         // 请求之前的拦截 ({ url, options }) => (boolean | {url, options })
      getData,                    // 请求响应josn中取数据 (resData, response) => (Object<data>)
      dataJsonPath,               // 请求响应josn中取数据的JsonPath
      requestError,               // 请求失败处理 (resData, response, error) => (Object<resData> | undefined | null)
      requestSuccessful,          // 请求成功回调 (resData, response) => ()
      spinProps = {},             // Spin自定义属性
      children,                   // 子组件
    } = this.props;
    if (children) {
      React.Children.only(children);
    }
    return (
      <Fragment>
        {
          this.getModal({
            initVisible,
            modalWidth,
            modalTitle,
            modalFooter,
            cancelButtonProps,
            visible,
            onOk,
            onCancel,
            maskClosable,
            modalProps,
            columnCount,
            labelWidthPercent,
            labelSuffix,
            data,
            label,
            dataTransform,
            detailFormProp,
            dataUrl,
            requestMethod,
            requestOptions,
            requestInterceptor,
            getData,
            dataJsonPath,
            requestError,
            requestSuccessful,
            spinProps,
          })
        }
        {React.Children.count(children) > 0 ? <span onClick={() => this.setState({ internalVisible: true })}>{children}</span> : ""}
      </Fragment>
    );
  }
}

export default DetailModal;
