import React, { PureComponent, Fragment } from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';
import jsonpath from "jsonpath";
// import lodash from 'lodash';
// import moment from 'moment';
import { stringify } from 'qs';
// import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
// import classNames from 'classnames';
// import styles from './index.less';

// Model 初始化值配置
const ModelInitState = {
  // 请求 “分页参数” 和 “排序参数” 默认值配置
  queryParam: { pageSize: 10, pageNo: 1, orderField: undefined, sort: undefined },
  // 分页参数默认值配置
  pagination: {
    defaultCurrent: 1,
    defaultPageSize: 10,
    hideOnSinglePage: false,
    pageSizeOptions: ['10', '30', '50', '100'],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => formatMessage({ id: 'common.pagination.showTotal' }, { total }),
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

// 排序
const SorterOrderMapper = {
  "descend": "DESC",
  "ascend": "ASC",
  "undefined": "ASC",
  "null": "ASC",
};

class PagingQueryTable extends PureComponent {

  // 构造器
  constructor(props) {
    super(props);
    this.lastFetchCount = 0;
  }

  // 加载完成
  componentDidMount() {
    const { defaultLoadData = true } = this.props;
    // console.log("componentDidMount --> ", defaultLoadData);
    if (defaultLoadData !== true) return;
    this.reloadDataSource(false);
  }

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
    // 内部表格加载状态
    internalLoading: false,
    // 查询参数
    internalQueryParam: {
      ...ModelInitState.queryParam,
    },
    // 分页参数
    internalPagination: {
      ...ModelInitState.pagination,
    },
    // 表格数据
    internalData: [],
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getTable = ({
    size,
    bordered,
    loading,
    rowKey,
    columns,
    dataSource,
    pagination,
    onChange,
    tableProps,
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
  }) => {
    const { internalLoading, internalPagination, internalData } = this.state;
    return (
      <Table
        size={size}
        bordered={bordered}
        loading={(loading !== undefined && loading !== null) ? loading : internalLoading}

        rowKey={rowKey}
        columns={columns}
        dataSource={(dataSource !== undefined && dataSource !== null) ? dataSource : internalData}
        pagination={(pagination !== undefined && pagination !== null) ? pagination : internalPagination}
        onChange={(paginationParam, filters, sorter, extra) => {
          this.handleChange(paginationParam, filters, sorter, extra, {
            onChange,
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
          })
        }}
        {...tableProps}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // Function(pagination, filters, sorter, extra: { currentDataSource: [] })
  handleChange = (pagination, filters, sorter, extra,
    {
      onChange,
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
    }) => {
    const { internalQueryParam } = this.state;
    let queryParam = { ...internalQueryParam, pageNo: pagination.current, pageSize: pagination.pageSize };
    // 排序
    if (sorter.field) {
      // OrderFieldMapping
      // const sorterMapper = {};
      // queryParam.orderField = sorterMapper[sorter.field];
      queryParam.orderField = sorter.field;
      queryParam.sort = SorterOrderMapper[sorter.order];
    } else {
      queryParam.orderField = undefined;
      queryParam.sort = undefined;
    }
    // console.log("handleChange --> sorter", sorter);
    if (onChange instanceof Function) {
      const queryParamExt = onChange(pagination, filters, sorter, extra);
      if (varTypeOf(queryParamExt) === TypeEnum.object) {
        queryParam = { ...queryParam, ...queryParamExt };
      }
    }
    // console.log("handleChange --> queryParam", queryParam);
    this.fetchData({
      queryParam,
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
    });
  }

  // 请求服务端数据
  fetchData = ({
    queryParam = {},
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
  }) => {
    // console.log("fetchData --> ", dataUrl);
    if (dataUrl === null || dataUrl === undefined) return;
    let { internalQueryParam, internalPagination } = this.state;
    internalQueryParam = { ...internalQueryParam, ...queryParam };
    const fetchOptions = {
      url: `${dataUrl}?${stringify(internalQueryParam)}`,
      options: { method: requestMethod, ...requestOptions },
    };
    // 请求之前的拦截
    if (requestInterceptor instanceof Function) {
      const tmp = requestInterceptor(fetchOptions);
      if (tmp === false) return;
      if (tmp && tmp.url) {
        fetchOptions.url = tmp.url;
      }
      if (tmp && tmp.options) {
        fetchOptions.options = tmp.options;
      }
    }
    this.setState({ internalLoading: true });
    this.lastFetchCount++;
    const fetchCount = this.lastFetchCount;
    // console.log("fetchData --> ", fetchOptions)
    fetch(fetchOptions.url, fetchOptions.options)
      .then(async response => {
        if (fetchCount < this.lastFetchCount) return {};
        let resData = await response.json();
        if (response.status < 200 || response.status >= 400) {
          if (requestError instanceof Function) return { resData: requestError(resData, response), response };
          return {};
        }
        // 请求数据过滤处理
        if (responseFilter instanceof Function) {
          const tmp = responseFilter(resData, response);
          if (tmp) resData = tmp;
        }
        // 请求成功事件
        if (requestSuccessful instanceof Function) requestSuccessful(resData, response);
        return { resData, response };
      })
      .then(({ resData, response }) => {
        if (fetchCount < this.lastFetchCount) return;
        // 从响应数据中读取表格数据
        let internalData = (varTypeOf(resData) === TypeEnum.array ? resData : []);
        if (getDataSource instanceof Function) {
          internalData = getDataSource(resData, response);
        } else if (dataSourceJsonPath !== undefined && dataSourceJsonPath !== null) {
          internalData = jsonpath.query(resData, dataSourceJsonPath);
          // console.log("fetchData --> internalData", internalData);
          if (varTypeOf(internalData) === TypeEnum.array && internalData.length >= 1) internalData = internalData[0];
        }
        // 从响应数据中读取分页信息
        if (getPaginationInfo instanceof Function) {
          const { pageSize, current, total } = getPaginationInfo(resData, response);
          internalPagination = { ...internalPagination, pageSize, current, total };
        } else if (totalJsonPath && pageSizeJsonPath && currentJsonPath) {
          let pageSize = jsonpath.query(resData, pageSizeJsonPath);
          if (varTypeOf(pageSize) === TypeEnum.array && pageSize.length >= 1) pageSize = pageSize[0];
          let current = jsonpath.query(resData, currentJsonPath);
          if (varTypeOf(current) === TypeEnum.array && current.length >= 1) current = current[0];
          let total = jsonpath.query(resData, totalJsonPath);
          if (varTypeOf(total) === TypeEnum.array && total.length >= 1) total = total[0];
          // 全部取到值才赋值
          if (varTypeOf(pageSize) === TypeEnum.number && varTypeOf(current) === TypeEnum.number && varTypeOf(total) === TypeEnum.number) {
            internalPagination = { ...internalPagination, pageSize, current, total };
          }
        }
        if (onDataSourceChange instanceof Function) onDataSourceChange(internalQueryParam, internalPagination, internalData);
        // console.log("fetchData --> internalPagination", internalPagination);
        this.setState({ internalLoading: false, internalQueryParam, internalPagination, internalData });
      })
      .catch(err => {
        if (fetchCount < this.lastFetchCount) return;
        if (requestError instanceof Function) requestError(undefined, undefined, err);
        this.setState({ internalLoading: false });
      });
  }

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  // 重新加载数据
  reloadDataSource = (resetPagination = false) => {
    const {
      dataUrl,
      requestMethod = "get",
      requestOptions = {},
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
    } = this.props;
    // const
    // 初始化加载数据
    this.fetchData({
      queryParam: (resetPagination === true ? { pageNo: 0 } : {}),
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
    });
  }

  render() {
    const {
      size = "middle",                // 表格大小
      bordered = true,                // 表格是否有边框
      loading,                        // 页面是否加载中
      rowKey = "key",                 // 表格行 key 的取值，可以是字符串或一个函数
      columns = [],                   // 表格列配置
      dataSource,                     // 表格数据
      pagination,                     // 分页配置
      onChange,                       // 分页、排序、筛选变化时触发
      tableProps = {},                // 表格属性
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
    } = this.props;
    // console.log("render --> ", defaultLoadData);
    return (
      <Fragment>
        {
          this.getTable({
            size,
            bordered,
            loading,
            rowKey,
            columns,
            dataSource,
            pagination,
            onChange,
            tableProps,

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
          })
        }
      </Fragment>
    )
  }
}

export default PagingQueryTable;
