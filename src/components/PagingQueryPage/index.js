import React, { PureComponent, Fragment } from 'react';
import { Button, Icon, Tooltip } from 'antd';
// import { formatMessage } from 'umi/locale';
// import jsonpath from "jsonpath";
import lodash from 'lodash';
// import moment from 'moment';
import { parse, stringify } from 'qs';
import { FormEngine } from '@/components/FormEngine';
import PagingQueryTable from '@/components/PagingQueryTable';
// import { formatMessage } from 'umi/locale';
// import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
// import { MapperObject } from "../_utils/mapper";
// import classNames from 'classnames';
import styles from './index.less';

class PagingQueryPage extends PureComponent {

  // 构造器
  constructor(props) {
    super(props);
    const { smartHeight, initFormIsDown } = props;
    if (smartHeight === true) {
      this.handleHeight = lodash.debounce(this.handleHeight, 100, { maxWait: 350 });
    }
    if (initFormIsDown === false || initFormIsDown === true) {
      this.state.formIsDown = initFormIsDown;
    }
  }

  // 加载完成
  componentDidMount() {
    const { smartHeight } = this.props;
    if (smartHeight === true) {
      window.addEventListener('resize', this.handleHeight);
      this.useSmartHeight = true;
    }
  }

  // // 组件更新
  // componentDidUpdate(prevProps) {
  //   // const { target } = this.props;
  // }

  // 组件卸载之前
  componentWillUnmount() {
    if (this.useSmartHeight === true) {
      window.removeEventListener('resize', this.handleHeight);
    }
  }

  // 组件状态
  state = {
    // 浏览器高度
    screenHeight: document.documentElement.clientHeight,
    // 内部加载状态
    internalLoading: false,
    // 选中数据
    // selectedRowKeys: [],
    // 展开/折叠 down up
    formIsDown: false,
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
    formActionsWidth,
    formClassName,
    formStyle,
    showFormReset,
    showFormDownUp,
    actionsInLastformField,
  }) => {
    let widthTmp = formActionsWidth || 205;
    if (showFormDownUp !== true) widthTmp -= 34;
    if (showFormReset !== true) widthTmp -= 71.81;
    let actionsConfig = false;
    const formFieldsTmp = { ...formFields };
    if (actionsInLastformField === true) {
      const formFieldNames = lodash.keys(formFieldsTmp);
      // console.log("getform --> formFieldNames", formFieldNames);
      let lastFormField;
      if (formFieldNames.length > 0 && formFieldNames[formFieldNames.length - 1]) {
        lastFormField = { ...formFieldsTmp[formFieldNames[formFieldNames.length - 1]] };
        formFieldsTmp[formFieldNames[formFieldNames.length - 1]] = lastFormField;
        const lastFormFieldRaw = formFields[formFieldNames[formFieldNames.length - 1]];
        if (lastFormFieldRaw && lastFormFieldRaw.suffixLabel) lastFormField = undefined;
      }
      // console.log("getform --> lastFormField", lastFormField);
      if (lastFormField) {
        lastFormField.suffixLabelColSpan = 1;
        lastFormField.suffixLabel = () => this.getFormActions(showFormReset, showFormDownUp);
      } else {
        formFieldsTmp.actionsConfig = {
          useFormItem: false,
          inputRender: () => this.getFormActions(showFormReset, showFormDownUp),
          decorator: false,
        };
      }
    } else {
      actionsConfig = {
        render: () => {
          // resetValues, defaultValues, form, submitLoading
          return this.getFormActions(showFormReset, showFormDownUp);
        },
        placement: "right",
        width: widthTmp,
        rightStyle: { padding: "0 0 12px 24px", verticalAlign: "bottom" },
      };
    }
    return (
      <FormEngine
        wrappedComponentRef={formEngine => { this.formEngine = formEngine; }}
        enterSubmit={true}
        saveForm={form => { this.form = form; }}
        defaultLabelCol={defaultLabelCol}
        columnCount={columnCount}
        resetValues={resetValues}
        defaultValues={defaultValues}
        formFields={formFieldsTmp}
        defaultRowProps={defaultRowProps}
        wrapClassName={formClassName || styles.queryForm}
        wrapStyle={formStyle}
        actionsConfig={actionsConfig}
        formProps={{
          // 回车就能搜索
          onSubmit: e => {
            // console.log("getForm --> onSubmit", e);
            if (e) e.preventDefault();
            this.handleQuery();
          },
          ...formEngineProps
        }}
      />
    )
  }

  // 查询表单按钮 resetValues, defaultValues, form, submitLoading
  getFormActions = (showFormReset, showFormDownUp) => {
    const { internalLoading, formIsDown } = this.state;
    return (
      <Fragment>
        <Button type="primary" disabled={internalLoading} onClick={this.handleQuery}>查询</Button>
        {
          showFormReset === true ?
            (<Button type="default" disabled={internalLoading} style={{ marginLeft: 12 }} onClick={this.handleReset}>重置</Button>)
            : undefined
        }
        {
          showFormDownUp === true ?
            (
              <Tooltip title={formIsDown ? "展开" : "折叠"} placement="top">
                <Icon
                  style={{ userSelect: "none", marginLeft: 12, cursor: "pointer", color: "#1890ff", verticalAlign: "middle", fontSize: 22 }}
                  type={formIsDown ? "caret-down" : "caret-up"}
                  onClick={this.handFormIsDown}
                />
              </Tooltip>
            ) : undefined
        }
      </Fragment>
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
      <div className={actionsClassName || undefined} style={{ marginBottom: 12, ...actionsStyle }}>
        {(actionsContent instanceof Function) ? actionsContent(internalLoading) : actionsContent}
      </div>
    )
  }

  // 数据表格
  getTable = ({
    smartHeight,
    formValuesHandle,
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
    const { screenHeight } = this.state;
    let y = screenHeight - 300;
    if (y < 300) y = 500;
    const tableProps = (smartHeight === true) ? { scroll: { x: true, y }, ...pagingQueryTableProps } : pagingQueryTableProps;
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
        requestInterceptor={({ url, options }, reStartQuery) => this.handleRequestInterceptor({ originalParams: { url, options }, reStartQuery, formValuesHandle, requestInterceptor })}
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
        // tableProps={{ style: { maxHeight: 400, overflowX: "auto" }, ...pagingQueryTableProps }}
        // tableProps={{ scroll: true, ...pagingQueryTableProps }}
        // tableProps={{ scroll: { x: true, y }, ...pagingQueryTableProps }}
        // tableProps={pagingQueryTableProps}
        tableProps={tableProps}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // 表单 展开/折叠
  handFormIsDown = (e) => {
    if (e) e.preventDefault();
    const { formIsDown } = this.state;
    this.setState({ formIsDown: !formIsDown });
  }

  // 表单请求数据处理
  handleRequestInterceptor = ({
    originalParams: { url, options },
    reStartQuery,
    formValuesHandle,
    requestInterceptor
  }) => {
    const result = { url, options };
    const { form } = this;
    if (!form) return false;
    const separatorIndex = url.indexOf("/");
    const queryStringIndex = url.indexOf("?", separatorIndex !== -1 ? separatorIndex : 0);
    const path = (queryStringIndex === -1 ? url : url.substr(0, queryStringIndex));
    const queryString = (queryStringIndex === -1 ? "" : url.substr(queryStringIndex + 1, url.length));
    // console.log(`requestInterceptor --> path=[${path}]`);
    // console.log(`requestInterceptor --> queryString=[${queryString}]`);
    let tmp;
    form.validateFields((err, formValues) => {
      if (err) return;
      let formData = formValues;
      if (formValuesHandle instanceof Function) formData = formValuesHandle(formValues);
      if (!formData) formData = formValues;
      // console.log(`requestInterceptor --> queryString `, parse(queryString));
      // console.log(`requestInterceptor --> formData `, stringify(formData));
      const queryObject = lodash.merge(parse(queryString), formData);
      // console.log(`requestInterceptor --> queryObject `, queryObject);
      result.url = `${path}?${stringify(queryObject)}`;
      // console.log(`requestInterceptor --> result.url `, result.url);
      if (requestInterceptor instanceof Function) tmp = requestInterceptor(result, reStartQuery, path, queryString, formData);
    });
    if (tmp === false) return false;
    if (tmp && tmp.url) result.url = tmp.url;
    if (tmp && tmp.options) result.options = tmp.options;
    return result;
  }

  // 查询数据
  handleQuery = () => {
    if (this.pagingQueryTable) this.pagingQueryTable.reloadDataSource(true);
  }

  // 重置表单
  handleReset = () => {
    if (this.formEngine) {
      // console.log("this.formEngine -->", this.formEngine);
      this.formEngine.formReset();
      // TODO 保存状态数据
    }
  }

  // 高度变化
  handleHeight = () => {
    const screenHeight = document.documentElement.clientHeight;
    this.setState({ screenHeight });
    // console.log("handleHeight -> clientHeight", document.documentElement.clientHeight);
  };

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  render() {
    const {
      smartHeight = false,            // 智能高度调节
      defaultLabelCol,                // 默认全局的Form.Item labelCol属性(wrapperCol属性是通过labelCol值计算得出)
      columnCount = 1,                // 表单布局列数(支持1、2、3、4、6)
      resetValues = {},               // 表单重置值配置
      defaultValues = {},             // 表单字段默认值
      formFields = {},                // 表单字段配置
      defaultRowProps = {},           // Row组件默认属性配置
      formEngineProps = {},           // 表单引擎属性
      formActionsWidth = 205,         // 表单操作部分宽度，只能使用绝对宽度 number
      formClassName,                  // 表单最外层包装元素的className
      formStyle = {},                 // 表单最外层包装元素的样式
      formValuesHandle,               // 表单数据处理 (formValues) => (formValues)
      showFormReset = false,          // 是否显示表单[重置]按钮
      showFormDownUp = false,         // 是否显示表单[展开/折叠]指示器
      initFormIsDown = false,         // 查询表单[展开(false)/折叠(true)]默认值
      actionsInLastformField = false, // 操作块内容位置是否在最后一个表单查询字段的suffixLabel位置
      actionsContent,                 // 操作块内容 ReactNode | (?) => (ReactNode)
      actionsClassName,               // 操作块className
      actionsStyle = {},              // 操作块样式
      rowKey = "key",                 // 表格行 key 的取值，可以是字符串或一个函数
      columns = [],                   // 表格列配置
      defaultPagination = {},         // 默认分页数据
      defaultData,                    // 默认表格数据 array
      defaultLoadData = true,         // 是否初始化就加载数据
      dataUrl,                        // 表格数据请求地址
      requestMethod = "GET",          // 请求提交 Method
      requestOptions = {},            // 请求 fetch options(选项)
      requestInterceptor,             // 请求之前的拦截 ({ url, options }, reStartQuery, path, queryString, formValues) => (boolean | {url, options })
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
      <div className={wrapClassName || undefined} style={{ height: "100%", ...wrapStyle }}>
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
            formActionsWidth,
            formClassName,
            formStyle,
            showFormReset,
            showFormDownUp,
            initFormIsDown,
            actionsInLastformField,
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
            smartHeight,
            formValuesHandle,
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
