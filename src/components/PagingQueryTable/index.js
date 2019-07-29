import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { formatMessage } from 'umi/locale';
import jsonpath from "jsonpath";
// import lodash from 'lodash';
// import moment from 'moment';
import { stringify } from 'qs';
// import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from "@/utils/TypeOf";
import { MapperObject } from "@/utils/enum";
import { cutOffStr } from "@/utils/utils";
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
    const { columns = [], orderFieldMapping, defaultQueryParam, defaultPagination, defaultData } = props;
    const { internalQueryParam, internalPagination } = this.state;
    // 默认排序参数处理
    if (!internalQueryParam.orderField && varTypeOf(columns) === TypeEnum.array && columns.length > 0) {
      const column = columns.find(tmp => (tmp.defaultSortOrder === "ascend" || tmp.defaultSortOrder === "descend"));
      if (column && column.orderFieldParam) {
        internalQueryParam.orderField = column.orderFieldParam;
      } else if (varTypeOf(orderFieldMapping) === TypeEnum.object) {
        internalQueryParam.orderField = orderFieldMapping[column.dataIndex];
        if (!internalQueryParam.orderField) internalQueryParam.orderField = column.dataIndex;
      }
      internalQueryParam.sort = SorterOrderMapper[column.defaultSortOrder];
    }
    if (varTypeOf(defaultQueryParam) === TypeEnum.object) this.state.internalQueryParam = { ...internalQueryParam, defaultQueryParam };
    if (varTypeOf(defaultPagination) === TypeEnum.object) this.state.internalPagination = { ...internalPagination, defaultPagination };
    if (varTypeOf(defaultData) === TypeEnum.array) this.state.internalData = defaultData;
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
    orderFieldMapping,
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
    onLoadingChange,
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
            orderFieldMapping,
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
            onLoadingChange,
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
      orderFieldMapping,
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
      onLoadingChange,
      onDataSourceChange,
    }) => {
    // console.log("handleChange --> sorter", sorter);
    const { internalQueryParam } = this.state;
    let queryParam = { ...internalQueryParam, pageNo: pagination.current, pageSize: pagination.pageSize };
    // 排序
    if (sorter.field) {
      // orderFieldParam
      queryParam.orderField = undefined;
      if (sorter.column && sorter.column.orderFieldParam) {
        queryParam.orderField = sorter.column.orderFieldParam;
      } else if (varTypeOf(orderFieldMapping) === TypeEnum.object) {
        queryParam.orderField = orderFieldMapping[sorter.field];
      }
      // console.log("handleChange --> orderFieldMapping", orderFieldMapping);
      if (!queryParam.orderField) queryParam.orderField = sorter.field;
      queryParam.sort = SorterOrderMapper[sorter.order];
    } else {
      queryParam.orderField = undefined;
      queryParam.sort = undefined;
    }
    // console.log("handleChange --> queryParam", queryParam);
    if (onChange instanceof Function) {
      const queryParamExt = onChange(pagination, filters, sorter, extra);
      if (varTypeOf(queryParamExt) === TypeEnum.object) {
        queryParam = { ...queryParam, ...queryParamExt };
      }
    }
    // console.log("handleChange --> queryParam", queryParam);
    this.fetchData({
      reStartQuery: false,
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
      onLoadingChange,
      onDataSourceChange,
    });
  }

  // 请求服务端数据
  fetchData = ({
    reStartQuery,
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
    onLoadingChange,
    onDataSourceChange,
  }) => {
    // console.log("fetchData --> ", dataUrl);
    if (dataUrl === null || dataUrl === undefined) return;
    let { internalQueryParam, internalPagination } = this.state;
    internalQueryParam = { ...internalQueryParam, ...queryParam };
    // 组装请求数据
    const fetchOptions = {
      url: `${dataUrl}?${stringify(internalQueryParam)}`,
      options: { method: requestMethod, ...requestOptions },
    };
    // 请求之前的拦截
    if (requestInterceptor instanceof Function) {
      const tmp = requestInterceptor(fetchOptions, reStartQuery);
      if (tmp === false) return;
      if (tmp && tmp.url) {
        fetchOptions.url = tmp.url;
      }
      if (tmp && tmp.options) {
        fetchOptions.options = tmp.options;
      }
    }
    this.setState({ internalLoading: true });
    if (onLoadingChange instanceof Function) onLoadingChange(true);
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
        if (onLoadingChange instanceof Function) onLoadingChange(false);
      })
      .catch(err => {
        if (fetchCount < this.lastFetchCount) return;
        if (requestError instanceof Function) requestError(undefined, undefined, err);
        this.setState({ internalLoading: false });
        if (onLoadingChange instanceof Function) onLoadingChange(false);
      });
  }

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  // 重新加载数据
  reloadDataSource = (resetPagination = false) => {
    const {
      dataUrl,
      requestMethod = "GET",
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
      onLoadingChange,
      onDataSourceChange,
    } = this.props;
    // const
    // 初始化加载数据
    this.fetchData({
      reStartQuery: resetPagination,
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
      onLoadingChange,
      onDataSourceChange,
    });
  }

  render() {
    // console.log("PagingQueryTable --> render");
    const {
      size = "middle",                // 表格大小
      bordered = true,                // 表格是否有边框
      loading,                        // 页面是否加载中
      rowKey = "key",                 // 表格行 key 的取值，可以是字符串或一个函数
      columns = [],                   // 表格列配置
      dataSource,                     // 表格数据
      pagination,                     // 分页配置
      onChange,                       // 分页、排序、筛选变化时触发 (pagination, filters, sorter, extra) => (Object<queryParamExt>)
      tableProps = {},                // 表格属性
      defaultQueryParam = {},         // 默认查询参数
      defaultPagination = {},         // 默认分页数据
      defaultData,                    // 默认表格数据 array
      orderFieldMapping,              // 全局排序映射关系 { "columnsDataIndex_1": "orderFieldParam_1", "columnsDataIndex_2": "orderFieldParam_2", ... }
      defaultLoadData = true,         // 是否初始化就加载数据
      dataUrl,                        // 表格数据请求地址
      requestMethod = "GET",          // 请求提交 Method
      requestOptions = {},            // 请求 fetch options(选项)
      requestInterceptor,             // 请求之前的拦截 ({ url, options }, reStartQuery) => (boolean | {url, options })
      responseFilter,                 // 响应数据拦截 (Object<resData>, response) => (Object<resData> | undefined | null)
      requestError,                   // 请求失败处理   (resData, response, error) => (Object<resData> | undefined | null)
      requestSuccessful,              // 请求成功回调 (resData, response) => ()
      getDataSource,                  // 请求响应josn中取表格数据 (resData, response) => (Array<dataSource>)
      dataSourceJsonPath,             // 请求响应josn中取表格数据的JsonPath
      getPaginationInfo,              // 请求响应josn中取分页数据 (resData, response) => (object<{pageSize, current, total}>)
      totalJsonPath,                  // 请求响应josn中数据总量的JsonPath
      pageSizeJsonPath,               // 请求响应josn中页面数据量的JsonPath
      currentJsonPath,                // 请求响应josn中页面当前页码数的JsonPath
      onLoadingChange,                // 表格加载状态发生变化 (loading) => ()
      onDataSourceChange,             // 表格数据发生变化事件 (queryParam, pagination, dataSource) => ()
      wrapClassName,                  // 最外层包装元素的className
      wrapStyle = {},                 // 最外层包装元素的样式
    } = this.props;
    // console.log("render --> ", defaultLoadData);
    const columnsTmp = columns.map((column = {}) => {
      const {
        // orderFieldParam,       // 列排序请求参数
        contentMaxLength,      // 内容最大长度(一个中文长度为2，英文字母长度为1)
        transform,             // 列数据转换 array | ReactNode | (text, record, index, column) => (string | ReactNode)
      } = column;
      let { render } = column;
      if (!render && transform) {
        switch (varTypeOf(transform)) {
          case TypeEnum.array:
            render = (text) => {
              const object = MapperObject(transform, text);
              if (varTypeOf(object) === TypeEnum.object) {
                const { style, label, color } = object;
                return <span style={{ ...style, color }}>{label}</span>;
              }
              return object;
            }
            break;
          case TypeEnum.reactNode:
            render = () => transform;
            break;
          case TypeEnum.function:
            render = (text, record, index) => transform(text, record, index, column);
            break;
          case TypeEnum.object:
            render = () => transform;
            break;
          default:
        }
      }
      if (!render && varTypeOf(contentMaxLength) === TypeEnum.number && contentMaxLength > 0) {
        render = (text) => {
          const tmp = cutOffStr(text, contentMaxLength);
          if (tmp === text) return text;
          return <span title={text}>{tmp}</span>
        }
      }
      // console.log("render --> contentMaxLength ", contentMaxLength);
      return { ...column, render };
    });
    // console.log("render --> columnsTmp ", columnsTmp);
    return (
      <div className={wrapClassName || undefined} style={wrapStyle}>
        {
          this.getTable({
            size,
            bordered,
            loading,
            rowKey,
            columns: columnsTmp,
            dataSource,
            pagination,
            onChange,
            tableProps,
            defaultQueryParam,
            defaultPagination,
            defaultData,
            orderFieldMapping,
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
            onLoadingChange,
            onDataSourceChange,
          })
        }
      </div>
    )
  }
}

export default PagingQueryTable;
