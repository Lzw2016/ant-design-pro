import React, { PureComponent, Fragment } from 'react';
import { Table } from 'antd';
import jsonpath from "jsonpath";
// import lodash from 'lodash';
import moment from 'moment';
// import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
// import classNames from 'classnames';
// import styles from './index.less';

class PagingQueryTable extends PureComponent {

  // 构造器
  constructor(props) {
    super(props);
    this.lastFetchCount = 0;
  }

  // 加载完成
  componentDidMount() {
    const {
      defaultLoadData = true,
      dataUrl,
      requestMethod = "get",
      requestOptions = {},
      requestInterceptor,
      responseFilter,
      requestError,
      requestSuccessful,
      getDataSource,
      dataSourceJsonPath,
    } = this.props;
    // console.log("componentDidMount --> ", defaultLoadData);
    if (defaultLoadData !== true) return;
    // 初始化加载数据
    this.fetchData({
      dataUrl,
      requestMethod,
      requestOptions,
      requestInterceptor,
      responseFilter,
      requestError,
      requestSuccessful,
      getDataSource,
      dataSourceJsonPath,
    });
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
    // queryParam
    // internalQueryParam: {},
    // pagination
    internalPagination: {
      // ...ModelInitState.pagination,
    },
    // data
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
        // onChange={this.handleTableChange}
        {...tableProps}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // // 查询数据
  // findByPage = (e) => {
  //   if (e) e.preventDefault();
  //   const { dispatch, form } = this.props;
  //   const queryParam = form.getFieldsValue();
  //   if (queryParam.lastUsedStart) {
  //     queryParam.lastUsedStart = moment(queryParam.lastUsedStart).format('YYYY-MM-DD 00:00:00');
  //   }
  //   if (queryParam.lastUsedEnd) {
  //     queryParam.lastUsedEnd = moment(queryParam.lastUsedEnd).format('YYYY-MM-DD 23:59:59');
  //   }
  //   dispatch({ type: 'RememberMeTokenManageModel/findByPage', payload: { ...queryParam, pageNo: 0 } });
  // }

  // // 表格数据过滤或跳页
  // handleTableChange = (pagination, _, sorter) => {
  //   const { dispatch, RememberMeTokenManageModel } = this.props;
  //   const queryParam = { ...RememberMeTokenManageModel.queryParam, pageNo: pagination.current, pageSize: pagination.pageSize };
  //   // 排序
  //   if (sorter.field) {
  //     const sorterMapper = {};
  //     queryParam.orderField = sorterMapper[sorter.field];
  //     queryParam.sort = SorterOrderMapper[sorter.order];
  //   } else {
  //     queryParam.orderField = undefined;
  //     queryParam.sort = undefined;
  //   }
  //   dispatch({ type: 'RememberMeTokenManageModel/findByPage', payload: queryParam });
  // }

  // 请求服务端数据
  fetchData = ({
    dataUrl,
    requestMethod,
    requestOptions,
    requestInterceptor,
    responseFilter,
    requestError,
    requestSuccessful,
    getDataSource,
    dataSourceJsonPath,
  }) => {
    console.log("fetchData --> ", dataUrl);
    if (dataUrl === null || dataUrl === undefined) return;
    // let queryString = searchQueryString;
    // if (queryString && varTypeOf(queryString) === TypeEnum.object) {
    //   queryString = stringify(queryString);
    // }
    const fetchOptions = {
      url: dataUrl,
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
        if (fetchCount < this.lastFetchCount) return undefined;
        let resData = await response.json();
        if (response.status < 200 || response.status >= 400) {
          if (requestError instanceof Function) return requestError(resData, response);
          return undefined;
        }
        // 请求数据过滤处理
        if (responseFilter instanceof Function) {
          const tmp = responseFilter(resData, response);
          if (tmp) resData = tmp;
        }
        // 请求成功事件
        if (requestSuccessful instanceof Function) requestSuccessful(resData, response);
        return resData;
      })
      .then(resData => {
        if (fetchCount < this.lastFetchCount) return;
        // 从响应数据中读取表格数据
        let internalData = (varTypeOf(resData) === TypeEnum.array ? resData : []);
        if (getDataSource instanceof Function) {
          internalData = getDataSource(resData); // 参数 response
        } else if (dataSourceJsonPath !== undefined && dataSourceJsonPath !== null) {
          internalData = jsonpath.query(resData, dataSourceJsonPath);
          if (varTypeOf(internalData) === TypeEnum.array && internalData.length >= 1) internalData = internalData[0];
        }
        this.setState({ internalData, internalLoading: false });
      })
      .catch(err => {
        if (fetchCount < this.lastFetchCount) return;
        let internalData;
        if (requestError instanceof Function) {
          internalData = requestError(undefined, undefined, err);
        }
        if (internalData && varTypeOf(internalData) === TypeEnum.array) {
          this.setState({ internalData, internalLoading: false });
        } else {
          this.setState({ internalLoading: false });
        }
      });
  }

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  render() {
    const {
      size = "middle",                // 表格大小
      bordered = true,                // 表格是否有边框
      loading,                        // 页面是否加载中
      rowKey = "key",                 // 表格行 key 的取值，可以是字符串或一个函数
      columns = [],                   // 表格列配置
      dataSource,                     // 表格数据
      pagination = false,             // 分页配置
      onChange,                       // 分页、排序、筛选变化时触发
      tableProps = {},                // 表格属性

      defaultLoadData = true,         // 是否初始化就加载数据
      dataUrl,                        // 表格数据请求地址
      requestMethod = "get",          // 请求提交 Method
      requestOptions = {},            // 请求 fetch options(选项)
      requestInterceptor,             // 请求之前的拦截 ({ url, options }) => (boolean | {url, options })
      responseFilter,                 // 响应数据拦截 (Object<resData>, response) => (Object<resData> | undefined | null)
      requestError,                   // 请求失败处理   (resData, response, error) => (Object<dataSource> | undefined | null)
      requestSuccessful,              // 提交成功回调 (resData, response) => ()
      getDataSource,                  // 请求响应josn中取表格数据 (resData, response) => (Array<dataSource>)
      dataSourceJsonPath,             // 请求响应josn中取表格数据的JsonPath
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
          })
        }
      </Fragment>
    )
  }
}

export default PagingQueryTable;
