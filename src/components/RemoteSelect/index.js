import React, { PureComponent, Fragment } from 'react';
import { Select, Empty, Spin, message, Alert, Table, Tooltip, Icon } from 'antd';
import lodash from 'lodash';
import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
import { downloadExcel, openDownloadDialog } from './excelUtils';
// import classNames from 'classnames';
// import styles from './Log.less'

class RemoteSelect extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  //   debounce
  // }

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
    // 是否正在请求服务端
    fetching: false,
    // 当前选中值
    value: undefined,
    // 上传数据结果
    responseData: undefined,
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getSelect = ({
    dataArrayKey,
    dataKey,
    dataValueKey,
    dataLabelKey,
    render,

    selectStyle,
    selectProps,
  }) => {
    const { fetching, value, responseData } = this.state;
    let arrayData = responseData || [];
    if (dataArrayKey && responseData[dataArrayKey] && responseData[dataArrayKey] instanceof Array) {
      arrayData = responseData[dataArrayKey];
    }
    if (varTypeOf(arrayData) !== TypeEnum.array) {
      throw Error("响应数据不是数组");
    }
    return (
      <Select
        allowClear={true}
        value={value}
        notFoundContent={fetching ? <Spin delay={0} size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        filterOption={false}
        showSearch={true}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={{ ...selectStyle }}
        {...selectProps}
      >
        {arrayData.map(item => {
          if (varTypeOf(arrayData) === TypeEnum.string) {
            return <Select.Option key={item} value={item}>{item}</Select.Option>
          }
          return <Select.Option key={item[dataKey]} value={item[dataValueKey]}>{item[dataLabelKey]}</Select.Option>
        })}
      </Select>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  render() {
    const {
      defaultLoadData = false,    // 是否初始化就加载数据
      url,                        // 加载远程数据请求地址
      requestOptions,             // 请求参数选项
      requestDelay = 200,         // 每次请求延时时间(防止一个时间内多次请求)
      requestInterceptor,         // 发送请求之前的拦截
      responseFilter,             // 响应数据拦截
      dataArrayKey,               // 响应数据中选项数组的名称(如果直接返回响应数组不需要此值)
      dataKey = "value",          // 数据主键
      dataValueKey = "value",     // 数据值属性名称
      dataLabelKey = "label",     // 数据标题属性名
      render,                     // 自定义渲染数据

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
