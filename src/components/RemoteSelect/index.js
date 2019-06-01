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
    const { requestDelay = 350, defaultValue } = props;
    // 最后一次查询请求次数
    this.lastFetchCount = 0;
    this.useDefaultValue = defaultValue !== undefined;
    this.fetchData = lodash.debounce(this.fetchData, requestDelay || 350);
    this.state = { defaultValue };
    // console.log("constructor -> ", defaultValue);
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

  // 组件卸载之前
  componentWillUnmount() {
    // 卸载主键之后不能再修改 state
    this.setState = () => { };
  }

  // 组件状态
  state = {
    // 是否正在请求服务端
    fetching: false,
    // 请求存在错误
    fetchHasError: false,
    // 上传数据结果
    responseData: undefined,
    // 控件内部值
    innerValue: undefined,
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  // 单选搜索选择输入框
  getSelect = ({
    value,
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

    onChange,
    onSearch,

    selectStyle,
    selectProps,
  }) => {
    const { useDefaultValue } = this;
    const { fetching, fetchHasError, responseData, innerValue, defaultValue } = this.state;
    // console.log("getSelect -> ", defaultValue);
    const valueProp = {};
    if (useDefaultValue) {
      valueProp.defaultValue = defaultValue;
    } else {
      valueProp.value = (value === undefined ? innerValue : value);
    }
    // 获取选项数组
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
    // console.log("getSelect --> ", arrayData, responseData);
    return (
      <Select
        allowClear={true}
        placeholder="请输入关键字搜索"
        notFoundContent={
          fetching ? <Spin delay={0} size="small" />
            : fetchHasError === true ? <span style={{ color: "#f5222d" }}><Icon type="warning" style={{ marginRight: 8 }} />查询失败</span>
              : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        }
        {...valueProp}
        showSearch={true}
        filterOption={false}
        labelInValue={true}
        onChange={(valueChange, option) => {
          // console.log("option --> ", option);
          this.handleChange(valueChange, option, value, onChange);
        }}
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
          if (onSearch instanceof Function) onSearch(searchText);
        }}
        style={{ width: 260, ...selectStyle }}
        {...selectProps}
      >
        {arrayData.map(item => {
          if (varTypeOf(item) === TypeEnum.string) {
            return (
              <Select.Option key={item} value={item} data-option={item}>
                {render && (render instanceof Function) ? render(item, item, item, item) : item}
              </Select.Option>
            )
          }
          let tmpDataKey = dataKey;
          if (!tmpDataKey) tmpDataKey = dataValueKey;
          return (
            <Select.Option key={item[tmpDataKey]} value={item[dataValueKey]} data-option={item}>
              {render && (render instanceof Function) ? render(item[tmpDataKey], item[dataValueKey], item[dataLabelKey], item) : item[dataLabelKey]}
            </Select.Option>
          )
        })}
      </Select>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // 选择数据
  handleChange = (valueChange, option, valueProp, onChange) => {
    // console.log("handleChange -> ", value);
    this.useDefaultValue = false;
    const newState = {};
    let flag = false;
    if (varTypeOf(valueChange) === TypeEnum.undefined) {
      newState.responseData = undefined;
      flag = true;
    }
    if (valueProp === undefined) {
      newState.innerValue = valueChange;
      flag = true;
    }
    if (flag) this.setState(newState);
    if (onChange instanceof Function) onChange(valueChange, option, option.props["data-option"]);
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
        if (response.status < 200 || response.status >= 400) {
          const { message, error } = resData;
          // error: "业务异常"
          // exception: "org.clever.common.exception.BusinessException"
          // message: "测试异常"
          // path: "/api/remote/input/object"
          // status: 400
          // timestamp: "2019-05-27 17:21:29"
          throw Error(message || error || `响应状态码: ${response.status}`);
        }
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
      defaultValue,               // 默认值
      value,                      // 输入值(可控属性)
      defaultLoadData = false,    // 是否初始化就加载数据
      url,                        // 加载远程数据请求地址
      searchParamName = "search", // 搜索请求参数名
      searchQueryString = {},     // 搜索请求扩展的QueryString
      requestOptions,             // 请求参数选项(fetch Options参数)
      requestDelay = 350,         // 每次请求延时时间(防止一个时间内多次请求)
      requestInterceptor,         // 发送请求之前的拦截
      requestError,               // 请求失败处理
      responseFilter,             // 响应数据拦截
      dataArrayKey,               // 响应数据中选项数组的名称(如果直接返回响应数组不需要此值)
      dataKey,                    // 数据主键(可以使用dataValueKey属性配置)
      dataValueKey = "value",     // 数据值属性名称
      dataLabelKey = "label",     // 数据标题属性名
      render,                     // 自定义渲染数据 (key, value, label, item) => (String | RactNode)

      onChange,                   // 选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
      onSearch,                   // 文本框值变化时回调

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
            defaultValue,
            value,
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

            onChange,
            onSearch,

            selectStyle,
            selectProps,
          })
        }
      </Fragment>
    )
  }
}

export default RemoteSelect;
