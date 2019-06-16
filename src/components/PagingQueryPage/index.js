import React, { PureComponent } from 'react';
// import { Table } from 'antd';
// import { formatMessage } from 'umi/locale';
// import jsonpath from "jsonpath";
// import lodash from 'lodash';
// import moment from 'moment';
// import { stringify } from 'qs';
import { FormEngine } from '@/components/FormEngine';
import PagingQueryTable from '@/components/PagingQueryTable';
// import { formatMessage } from 'umi/locale';
// import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
// import { MapperObject } from "../_utils/mapper";
// import classNames from 'classnames';
import styles from './index.less';

class PagingQueryPage extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // // 加载完成
  // componentDidMount() {
  //   const { defaultLoadData = true } = this.props;
  //   // console.log("componentDidMount --> ", defaultLoadData);
  //   if (defaultLoadData !== true) return;
  //   this.reloadDataSource(false);
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
    // 内部加载状态
    internalLoading: false,
    // 选中数据
    // selectedRowKeys: [],
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  // 查询表单
  getForm = ({
    defaultLabelCol,
    columnCount,
    resetValues,
    defaultValues,
    formFields,
    defaultRowProps,
    formEngineProps,
    formClassName,
    formStyle,
  }) => {
    return (
      <FormEngine
        ref={formEngine => { this.formEngine = formEngine; }}
        saveForm={form => { this.form = form; }}
        defaultLabelCol={defaultLabelCol}
        columnCount={columnCount}
        resetValues={resetValues}
        defaultValues={defaultValues}
        formFields={formFields}
        defaultRowProps={defaultRowProps}
        wrapClassName={formClassName || styles.queryForm}
        wrapStyle={formStyle}
        actionsConfig={false}
        {...formEngineProps}
      />
    )
  }

  // 操作按钮
  getAction = ({
    actionsContent,
    actionsClassName,
    actionsStyle,
  }) => {
    if (actionsContent === null || actionsContent === undefined) return <div style={{ marginBottom: 4 }} />;
    const { internalLoading } = this.state;
    return (
      <div className={actionsClassName || undefined} style={{ ...actionsStyle, marginBottom: 12 }}>
        {(actionsContent instanceof Function) ? actionsContent(internalLoading) : actionsContent}
      </div>
    )
  }

  // 数据表格
  getTable = ({
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
    onDataSourceChange,
    pagingQueryTableProps,
    tableClassName,
    tableStyle,
  }) => {
    return (
      <PagingQueryTable
        ref={pagingQueryTable => { this.pagingQueryTable = pagingQueryTable; }}
        rowKey={rowKey}
        columns={columns}
        defaultPagination={defaultPagination}
        defaultData={defaultData}
        defaultLoadData={defaultLoadData}
        dataUrl={dataUrl}
        requestMethod={requestMethod}
        requestOptions={requestOptions}
        requestInterceptor={requestInterceptor}
        responseFilter={responseFilter}
        requestError={requestError}
        requestSuccessful={requestSuccessful}
        getDataSource={getDataSource}
        dataSourceJsonPath={dataSourceJsonPath}
        getPaginationInfo={getPaginationInfo}
        totalJsonPath={totalJsonPath}
        pageSizeJsonPath={pageSizeJsonPath}
        currentJsonPath={currentJsonPath}
        onDataSourceChange={onDataSourceChange}
        wrapClassName={tableClassName}
        wrapStyle={tableStyle}
        onLoadingChange={loadingParam => this.setState({ internalLoading: loadingParam })}
        {...pagingQueryTableProps}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  render() {
    const {
      defaultLabelCol,                // 默认全局的Form.Item labelCol属性(wrapperCol属性是通过labelCol值计算得出)
      columnCount = 1,                // 表单布局列数(支持1、2、3、4、6)
      resetValues = {},               // 表单重置值配置
      defaultValues = {},             // 表单字段默认值
      formFields = {},                // 表单字段配置
      defaultRowProps = {},           // Row组件默认属性配置
      formEngineProps = {},           // 表单引擎属性
      formClassName,                  // 表单最外层包装元素的className
      formStyle = {},                 // 表单最外层包装元素的样式

      actionsContent,                 // 操作块内容 ReactNode | (?) => (ReactNode)
      actionsClassName,               // 操作块className
      actionsStyle = {},              // 操作块样式

      rowKey = "key",                 // 表格行 key 的取值，可以是字符串或一个函数
      columns = [],                   // 表格列配置
      defaultPagination = {},         // 默认分页数据
      defaultData,                    // 默认表格数据 array
      defaultLoadData = true,         // 是否初始化就加载数据
      dataUrl,                        // 表格数据请求地址
      requestMethod = "get",          // 请求提交 Method
      requestOptions = {},            // 请求 fetch options(选项)
      requestInterceptor,             // 请求之前的拦截 ({ url, options }) => (boolean | {url, options })
      responseFilter,                 // 响应数据拦截 (Object<resData>, response) => (Object<resData> | undefined | null)
      requestError,                   // 请求失败处理   (resData, response, error) => (Object<resData> | undefined | null)
      requestSuccessful,              // 请求成功回调 (resData, response) => ()
      getDataSource,                  // 请求响应josn中取表格数据 (resData, response) => (Array<dataSource>)
      dataSourceJsonPath,             // 请求响应josn中取表格数据的JsonPath
      getPaginationInfo,              // 请求响应josn中取分页数据 (resData, response) => (object<{pageSize, current, total}>)
      totalJsonPath,                  // 请求响应josn中数据总量的JsonPath
      pageSizeJsonPath,               // 请求响应josn中页面数据量的JsonPath
      currentJsonPath,                // 请求响应josn中页面当前页码数的JsonPath
      onDataSourceChange,             // 表格数据发生变化事件 (queryParam, pagination, dataSource) => ()
      pagingQueryTableProps = {},     // 分页表格属性
      tableClassName,                 // 数据表格块className
      tableStyle = {},                // 数据表格块样式

      wrapClassName,                  // 最外层包装元素的className
      wrapStyle = {},                 // 最外层包装元素的样式
    } = this.props;

    return (
      <div className={wrapClassName || undefined} style={wrapStyle}>
        {/* 查询表单 */}
        {
          this.getForm({
            defaultLabelCol,
            columnCount,
            resetValues,
            defaultValues,
            formFields,
            defaultRowProps,
            formEngineProps,
            formClassName,
            formStyle,
          })
        }
        {/* 操作按钮 */}
        {
          this.getAction({
            actionsContent,
            actionsClassName,
            actionsStyle,
          })
        }
        {/* 数据表格 */}
        {
          this.getTable({
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
            onDataSourceChange,
            pagingQueryTableProps,
            tableClassName,
            tableStyle,
          })
        }
      </div>
    )
  }
}

export default PagingQueryPage;
