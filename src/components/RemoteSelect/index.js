import React, { PureComponent, Fragment } from 'react';
import { Select, Empty, Spin, Icon } from 'antd';
import lodash from 'lodash';
import { stringify } from 'qs';
// import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
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
      searchQueryString,
      requestOptions,
      requestInterceptor,
      requestError,
      responseFilter,
    } = this.props;
    if (defaultLoadData !== true) return;
    // 初始化加载数据
    this.fetchData({
      value: "",
      url,
      searchParamName,
      searchQueryString,
      requestOptions,
      requestInterceptor,
      requestError,
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
    searchQueryString,
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
      console.log(defaultLoadData);
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
    // console.log("getSelect --> ", arrayData, responseData);
    return (
      <Select
        allowClear={true}
        placeholder="请输入关键字搜索"
        value={value}
        notFoundContent={
          fetching ? <Spin delay={0} size="small" />
            : fetchHasError === true ? <span style={{ color: "#f5222d" }}><Icon type="warning" style={{ marginRight: 8 }} />查询失败</span>
              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
        filterOption={false}
        showSearch={true}
        // onSelect={(labelValue, option) => {
        //   console.log("onSelect --> ", labelValue, " | ", option);
        // }}
        onChange={this.handleChange}
        onSearch={searchText => {
          // console.log("onSearch --> ", searchText);
          this.fetchData({
            value: searchText || "",
            url,
            searchParamName,
            searchQueryString,
            requestOptions,
            requestInterceptor,
            requestError,
            responseFilter,
          });
        }}
        style={{ width: 260, ...selectStyle }}
        {...selectProps}
        labelInValue={true}
      >
        {arrayData.map(item => {
          if (varTypeOf(item) === TypeEnum.string) {
            return (
              <Select.Option key={item} value={item}>
                {render && (render instanceof Function) ? render(item, item, item, item) : item}
              </Select.Option>
            )
          }
          let tmpDataKey = dataKey;
          if (!tmpDataKey) tmpDataKey = dataValueKey;
          return (
            <Select.Option key={item[tmpDataKey]} value={item[dataValueKey]}>
              {render && (render instanceof Function) ? render(item[tmpDataKey], item[dataValueKey], item[dataLabelKey], item) : item[dataLabelKey]}
            </Select.Option>
          )
        })}
      </Select>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // 选择数据
  handleChange = (value) => {
    let { responseData } = this.state;
    // console.log("handleChange -> ", value, responseData);
    if (varTypeOf(value) === TypeEnum.undefined) {
      responseData = undefined;
    }
    this.setState({ value, responseData });
  }

  // 请求服务端数据
  fetchData = ({
    value = "",
    url,
    searchParamName,
    searchQueryString,
    requestOptions,
    requestInterceptor,
    requestError,
    responseFilter,
  }) => {
    if (url === null || url === undefined) return;
    let queryString = searchQueryString;
    if (queryString && varTypeOf(queryString) === TypeEnum.object) {
      queryString = stringify(queryString);
    }
    const fetchOptions = {
      url: `${url}?${searchParamName}=${encodeURIComponent(value)}${queryString ? `&${queryString}` : ""}`,
      options: { method: "GET", ...requestOptions },
    };
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
    // console.log("fetchData --> ", fetchOptions)
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
      searchQueryString = {},     // 搜索请求扩展的QueryString
      requestOptions,             // 请求参数选项(fetch Options参数)
      requestDelay = 200,         // 每次请求延时时间(防止一个时间内多次请求)
      requestInterceptor,         // 发送请求之前的拦截
      requestError,               // 请求失败处理
      responseFilter,             // 响应数据拦截
      dataArrayKey,               // 响应数据中选项数组的名称(如果直接返回响应数组不需要此值)
      dataKey,                    // 数据主键(可以使用dataValueKey属性配置)
      dataValueKey = "value",     // 数据值属性名称
      dataLabelKey = "label",     // 数据标题属性名
      render,                     // 自定义渲染数据 (key, value, label, item) => (String | RactNode)

      selectStyle = {},           // Select控件style
      selectProps = {},           // Select控件属性
    } = this.props;
    // const {  } = this.state;
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
            searchQueryString,
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
