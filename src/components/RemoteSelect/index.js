import React, { PureComponent, Fragment } from 'react';
import { Select, Empty, Spin, message, Alert, Table, Tooltip, Icon } from 'antd';
import lodash from 'lodash';
import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
import { downloadExcel, openDownloadDialog } from './excelUtils';
// import classNames from 'classnames';
// import styles from './Log.less'

class RemoteSelect extends PureComponent {

  // 构造器
  constructor(props) {
    super(props);
    const { requestDelay } = props;
    // 最后一次查询请求次数
    this.lastFetchCount = 0;
    this.fetchData = lodash.debounce(this.fetchData, requestDelay || 200);
  }

  // 加载完成
  componentDidMount() {
    const {
      defaultLoadData,
      url,
      searchParamName,
      requestOptions,
      requestDelay,
      requestInterceptor,
      responseFilter,
    } = this.props;
    if (defaultLoadData !== true) return;
    // 初始化加载数据
    this.fetchData({
      url,
      searchParamName,
      requestOptions,
      requestDelay,
      requestInterceptor,
      responseFilter,
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
    // 是否正在请求服务端
    fetching: false,
    // 请求存在错误
    fetchHasError: false,
    // 当前选中值
    value: undefined,
    // 上传数据结果
    responseData: undefined,
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  // 单选搜索选择输入框
  getSelect = ({
    defaultLoadData,
    url,
    searchParamName,
    requestOptions,
    requestInterceptor,
    requestError,
    responseFilter,

    dataArrayKey,
    dataKey,
    dataValueKey,
    dataLabelKey,
    render,

    selectStyle,
    selectProps,
  }) => {
    const { fetching, fetchHasError, value, responseData } = this.state;
    let arrayData = [];
    if (varTypeOf(defaultLoadData) !== TypeEnum.boolean) {
      if (varTypeOf(defaultLoadData) !== TypeEnum.array) {
        throw Error("defaultLoadData不是数组");
      }
      arrayData = defaultLoadData;
    } else {
      if (responseData) arrayData = responseData;
      if (dataArrayKey && responseData[dataArrayKey] && responseData[dataArrayKey] instanceof Array) {
        arrayData = responseData[dataArrayKey];
      }
      if (varTypeOf(arrayData) !== TypeEnum.array) {
        throw Error("响应数据不是数组");
      }
    }
    return (
      <Select
        allowClear={true}
        value={value}
        notFoundContent={fetching ? <Spin delay={0} size="small" /> : fetchHasError === true ? <span style={{ color: "#f5222d" }}>查询失败</span> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        onChange={this.handleChange}
        filterOption={false}
        showSearch={true}
        onSearch={() => this.fetchData({
          value,
          url,
          searchParamName,
          requestOptions,
          requestInterceptor,
          requestError,
          responseFilter,
        })}
        style={{ ...selectStyle }}
        {...selectProps}
      >
        {arrayData.map(item => {
          if (varTypeOf(arrayData) === TypeEnum.string) {
            return (
              <Select.Option key={item} value={item}>
                {render && (render instanceof Function) ? render(item, item, item, item) : item}
              </Select.Option>
            )
          }
          return (
            <Select.Option key={item[dataKey]} value={item[dataValueKey]}>
              {render && (render instanceof Function) ? render(item[dataKey], item[dataValueKey], item[dataLabelKey], item) : item[dataLabelKey]}
            </Select.Option>
          )
        })}
      </Select>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // 选择数据
  handleChange = (value) => {
    this.setState({ value });
  }

  // 请求服务端数据
  fetchData = ({
    value = "",
    url,
    searchParamName,
    requestOptions,
    requestInterceptor,
    requestError,
    responseFilter,
  }) => {
    const fetchOptions = { url: `${url}?${searchParamName}=${encodeURIComponent(value)}`, options: { method: "GET", ...requestOptions } };
    // 请求之前的拦截
    if (requestInterceptor instanceof Function) {
      const tmp = requestInterceptor(fetchOptions);
      if (tmp === false) return;
      if (tmp && tmp.url) {
        fetchOptions.url = tmp.url;
      }
      if (tmp && tmp.options) {
        fetchOptions.url = tmp.options;
      }
    }
    this.setState({ responseData: undefined, fetching: true });
    this.lastFetchCount++;
    const fetchCount = this.lastFetchCount;
    fetch(fetchOptions.url, fetchOptions.options)
      .then(response => {
        if (fetchCount < this.lastFetchCount) return {};
        let resData = response.json();
        // 请求数据过滤处理
        if (responseFilter instanceof Function) {
          const tmp = responseFilter(resData, response);
          if (tmp) resData = tmp;
        }
        return resData;
      })
      .then(resData => {
        if (fetchCount < this.lastFetchCount) return;
        this.setState({ responseData: resData, fetching: false });
      })
      .catch(err => {
        if (fetchCount < this.lastFetchCount) return;
        let fetchHasError = true;
        let resData;
        if (requestError instanceof Function) {
          resData = requestError(err);
          if (resData) {
            fetchHasError = false;
          }
        }
        this.setState({ responseData: resData, fetching: false, fetchHasError });
      });
  }

  render() {
    const {
      defaultLoadData = false,    // 是否初始化就加载数据
      url,                        // 加载远程数据请求地址
      searchParamName = "search", // 搜索请求参数名
      requestOptions,             // 请求参数选项
      requestDelay = 200,         // 每次请求延时时间(防止一个时间内多次请求)
      requestInterceptor,         // 发送请求之前的拦截
      requestError,               // 请求失败处理
      responseFilter,             // 响应数据拦截
      dataArrayKey,               // 响应数据中选项数组的名称(如果直接返回响应数组不需要此值)
      dataKey = "value",          // 数据主键
      dataValueKey = "value",     // 数据值属性名称
      dataLabelKey = "label",     // 数据标题属性名
      render,                     // 自定义渲染数据 (key, value, label, item) => (String | RactNode)

      selectStyle = {},           // Select控件style
      selectProps = {},           // Select控件属性
    } = this.props;
    // const { visible, fileList, uploadResponseData: { excelImportState } } = this.state;
    // if (children) {
    // React.Children.only(children);
    // }
    return (
      <Fragment>
        {
          this.getSelect({
            defaultLoadData,
            url,
            searchParamName,
            requestOptions,
            requestDelay,
            requestInterceptor,
            requestError,
            responseFilter,

            dataArrayKey,
            dataKey,
            dataValueKey,
            dataLabelKey,
            render,

            selectStyle,
            selectProps,
          })
        }
      </Fragment>
    )
  }
}

export default RemoteSelect;
