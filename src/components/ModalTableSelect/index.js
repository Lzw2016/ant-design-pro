import React, { PureComponent, Fragment } from 'react';
import { Modal, Icon } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
import PagingQueryPage from "@/components/PagingQueryPage";
// import classNames from 'classnames';
// import styles from './index.less'

class ModalTableSelect extends PureComponent {

  // 构造器
  constructor(props) {
    super(props);
    const { initVisible, defaultSelectedRowKeys, defaultSelectedRows } = props;
    if (initVisible === true || initVisible === false) this.state.internalVisible = initVisible;
    if (defaultSelectedRowKeys && defaultSelectedRowKeys.length > 0) this.state.internalSelectedRowKeys = defaultSelectedRowKeys;
    if (defaultSelectedRows && defaultSelectedRows.length > 0) this.state.internalSelectedRows = defaultSelectedRows;
  }

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
    // 内部显示状态
    internalVisible: false,
    // 选中行数据Key
    internalSelectedRowKeys: [],
    // 选中行数据
    internalSelectedRows: [],
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getModal = ({
    modalWidth,
    modalTitle,
    modalFooter,
    selectType,
    rowSelectionProps,
    onSelectedChange,
    visible,
    onOk,
    onCancel,
    maskClosable,
    modalProps,
    defaultLabelCol,
    columnCount,
    defaultValues,
    formFields,
    formActionsWidth,
    actionsInLastformField,
    rowKey,
    columns,
    defaultPagination,
    defaultData,
    defaultLoadData,
    dataUrl,
    requestMethod,
    requestOptions,
    requestInterceptor,
    responseFilter,
    requestError,
    requestSuccessful,
    getDataSource,
    dataSourceJsonPath,
    getPaginationInfo,
    totalJsonPath,
    pageSizeJsonPath,
    currentJsonPath,
    pagingQueryTableProps,
    pagingQueryPageProps,
  }) => {
    const { internalVisible, internalSelectedRowKeys } = this.state;
    let columnsTmp = columns;
    let rowSelection = {
      ...rowSelectionProps,
      type: (selectType === "multiple" ? "checkbox" : selectType === "single" ? "radio" : "checkbox"),
      selectedRowKeys: internalSelectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => this.handleSelectedChange(selectedRowKeys, selectedRows, onSelectedChange),
      // fixed: true,
    };
    if (selectType === "single") {
      columnsTmp = [
        {
          title: '操作', key: 'single_select', align: "center", render: (_, record) => {
            const rowKeys = record[rowKey];
            const selected = internalSelectedRowKeys.findIndex(key => key === rowKeys) !== -1;
            return (
              <a
                onClick={() => {
                  this.setState({ internalVisible: false, internalSelectedRowKeys: [], internalSelectedRows: [] });
                  onOk([rowKeys], [record]);
                }}
              >
                {/* <span style={{ display: "inline-block", width: 14 }} /> */}
                {selected === true ? <Icon type="caret-right" /> : undefined}选择
              </a>
            )
          }
        },
        ...columns,
      ];
      rowSelection = null;
    }
    return (
      <Modal
        width={modalWidth}
        title={modalTitle}
        footer={selectType === "single" ? null : modalFooter}
        cancelButtonProps={{ style: { display: "none" } }}
        visible={(visible === null || visible === undefined) ? internalVisible : visible}
        onOk={() => this.handleOk(onOk)}
        onCancel={() => this.handleCancel(onCancel)}
        maskClosable={maskClosable}
        {...modalProps}
      >
        <PagingQueryPage
          ref={pagingQueryPage => { this.pagingQueryPage = pagingQueryPage; }}
          defaultLabelCol={defaultLabelCol}
          columnCount={columnCount}
          defaultValues={defaultValues}
          formFields={formFields}
          formActionsWidth={formActionsWidth}
          actionsInLastformField={actionsInLastformField}
          rowKey={rowKey}
          columns={columnsTmp}
          defaultPagination={defaultPagination}
          defaultData={defaultData}
          defaultLoadData={defaultLoadData}
          dataUrl={dataUrl}
          requestMethod={requestMethod}
          requestOptions={requestOptions}
          requestInterceptor={({ url, options }, reStartQuery, path, queryString, formValues) => this.handleRequestInterceptor({ url, options }, reStartQuery, path, queryString, formValues, requestInterceptor)}
          responseFilter={responseFilter}
          aaarequestError={requestError}
          requestSuccessful={requestSuccessful}
          getDataSource={getDataSource}
          dataSourceJsonPath={dataSourceJsonPath}
          getPaginationInfo={getPaginationInfo}
          totalJsonPath={totalJsonPath}
          pageSizeJsonPath={pageSizeJsonPath}
          currentJsonPath={currentJsonPath}
          pagingQueryTableProps={{
            ...pagingQueryTableProps,
            rowSelection,
          }}
          {...pagingQueryPageProps}
        />
      </Modal>
    );
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleOk = (onOk) => {
    const { internalSelectedRowKeys, internalSelectedRows } = this.state;
    this.setState({ internalVisible: false, internalSelectedRowKeys: [], internalSelectedRows: [] });
    if (onOk instanceof Function) onOk(internalSelectedRowKeys, internalSelectedRows);
  }

  handleCancel = (onCancel) => {
    this.setState({ internalVisible: false })
    if (onCancel instanceof Function) onCancel();
  }

  handleSelectedChange = (selectedRowKeys, selectedRows, onSelectedChange) => {
    if (onSelectedChange instanceof Function) onSelectedChange(selectedRowKeys, selectedRows);
    this.setState({ internalSelectedRowKeys: selectedRowKeys, internalSelectedRows: selectedRows });
  }

  handleRequestInterceptor = ({ url, options }, reStartQuery, path, queryString, formValues, requestInterceptor) => {
    if (reStartQuery === true) {
      // 需要优化
      this.setState({ internalSelectedRowKeys: [], internalSelectedRows: [] });
    }
    if (requestInterceptor instanceof Function) requestInterceptor({ url, options }, path, queryString, formValues);
  }

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  setSelectData = (defaultSelectedRowKeys, defaultSelectedRows) => {
    const state = {};
    let flag = false;
    if (defaultSelectedRowKeys && defaultSelectedRowKeys.length > 0) {
      flag = true;
      state.internalSelectedRowKeys = defaultSelectedRowKeys;
    }
    if (defaultSelectedRows && defaultSelectedRows.length > 0) {
      flag = true;
      state.internalSelectedRows = defaultSelectedRows;
    }
    if (flag === true) {
      this.setState(state);
    }
  }

  render() {
    const {
      initVisible = false,            // 初始化是否显示
      defaultSelectedRowKeys,         // 默认选中的 RowKeys
      defaultSelectedRows,            // 默认选中的 Rows
      modalWidth = 800,               // 对话框宽度
      modalTitle = "数据选择",         // 对话框标题
      modalFooter,                    // 对话框页脚
      selectType = "multiple",        // 选择类型 multiple single
      rowSelectionProps = {},         // 表格选择配置项(多选或者自定义配置才有效)
      onSelectedChange,               // 表格选中项发生变化事件 (selectedRowKeys, selectedRows) => ()
      visible,                        // 对话框显示(受控属性)
      onOk,                           // 数据选中确定事件 (selectedRowKeys, selectedRows) => ()
      onCancel,                       // 对话框取消事件
      maskClosable = true,            // 点击蒙层是否允许关闭
      modalProps = {},                // 对话框属性
      defaultLabelCol,                // 默认全局的Form.Item labelCol属性(wrapperCol属性是通过labelCol值计算得出)
      columnCount = 1,                // 表单布局列数(支持1、2、3、4、6)
      defaultValues = {},             // 表单字段默认值
      formFields = {},                // 表单字段配置
      formActionsWidth = 205,         // 表单操作部分宽度，只能使用绝对宽度 number
      actionsInLastformField = false, // 表单操作部分位置是否在最后一个表单查询字段的suffixLabel位置
      rowKey = "key",                 // 表格行 key 的取值，可以是字符串或一个函数
      columns = [],                   // 表格列配置
      defaultPagination = {},         // 默认分页数据
      defaultData,                    // 默认表格数据 array
      defaultLoadData = true,         // 是否初始化就加载数据
      dataUrl,                        // 表格数据请求地址
      requestMethod = "GET",          // 请求提交 Method
      requestOptions = {},            // 请求 fetch options(选项)
      requestInterceptor,             // 请求之前的拦截 ({ url, options }, path, queryString, formValues) => (boolean | {url, options })
      responseFilter,                 // 响应数据拦截 (Object<resData>, response) => (Object<resData> | undefined | null)
      requestError,                   // 请求失败处理   (resData, response, error) => (Object<resData> | undefined | null)
      requestSuccessful,              // 请求成功回调 (resData, response) => ()
      getDataSource,                  // 请求响应josn中取表格数据 (resData, response) => (Array<dataSource>)
      dataSourceJsonPath,             // 请求响应josn中取表格数据的JsonPath
      getPaginationInfo,              // 请求响应josn中取分页数据 (resData, response) => (object<{pageSize, current, total}>)
      totalJsonPath,                  // 请求响应josn中数据总量的JsonPath
      pageSizeJsonPath,               // 请求响应josn中页面数据量的JsonPath
      currentJsonPath,                // 请求响应josn中页面当前页码数的JsonPath
      pagingQueryTableProps = {},     // 分页表格属性
      pagingQueryPageProps = {},      // 分页查询页面组件属性
      children,                       // 子组件
    } = this.props;
    if (children) {
      React.Children.only(children);
    }
    return (
      <Fragment>
        {
          this.getModal({
            initVisible,
            defaultSelectedRowKeys,
            defaultSelectedRows,
            modalWidth,
            modalTitle,
            modalFooter,
            selectType,
            rowSelectionProps,
            onSelectedChange,
            visible,
            onOk,
            onCancel,
            maskClosable,
            modalProps,
            defaultLabelCol,
            columnCount,
            defaultValues,
            formFields,
            formActionsWidth,
            actionsInLastformField,
            rowKey,
            columns,
            defaultPagination,
            defaultData,
            defaultLoadData,
            dataUrl,
            requestMethod,
            requestOptions,
            requestInterceptor,
            responseFilter,
            requestError,
            requestSuccessful,
            getDataSource,
            dataSourceJsonPath,
            getPaginationInfo,
            totalJsonPath,
            pageSizeJsonPath,
            currentJsonPath,
            pagingQueryTableProps,
            pagingQueryPageProps,
          })
        }
        {
          React.Children.count(children) > 0 ?
            <span
              onClick={() => {
                const { defaultSelectedRowKeys: rowKeys, defaultSelectedRows: rows } = this.props;
                this.setState({ internalVisible: true });
                this.setSelectData(rowKeys, rows);
              }}
            >
              {children}
            </span> : ""
        }
      </Fragment>
    )
  }
}

export default ModalTableSelect;
