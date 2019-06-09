import React, { PureComponent, Fragment } from 'react';
import { Input } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
import classNames from 'classnames';
import styles from './index.less'


class InputLimit extends PureComponent {

  // 构造器
  constructor(props) {
    super(props);
    const { defaultValue } = props;
    this.useDefaultValue = defaultValue !== undefined;
    this.state = { defaultValue };
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
    // 输入框内容
    innerValue: undefined,
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getInput = ({
    value,
    suffix,
    maxLength,
    allowClear,
    preventInput,
    onChange,
    onLimit,
    inputStyle,
    inputProps,
  }) => {
    const { useDefaultValue } = this;
    const { innerValue, defaultValue } = this.state;
    const valueProp = {};
    if (useDefaultValue) {
      valueProp.defaultValue = defaultValue;
    } else {
      valueProp.value = (value === undefined ? innerValue : value);
    }
    if (maxLength && preventInput === true) {
      valueProp.maxLength = maxLength;
    }
    const inputCalss = {};
    inputCalss[this.getClassName(maxLength, valueProp.defaultValue ? valueProp.defaultValue : valueProp.value, allowClear, suffix)] = true;
    inputCalss[styles.input] = allowClear;
    return (
      <Input
        className={classNames(inputCalss)}
        {...valueProp}
        suffix={this.getSuffix(maxLength, valueProp.defaultValue ? valueProp.defaultValue : valueProp.value, suffix)}
        allowClear={allowClear}
        onChange={e => this.handleChange(e, maxLength, preventInput, value, onChange, onLimit)}
        style={inputStyle}
        {...inputProps}
      />
    )
  }

  getClassName = (maxLength, value, allowClear, suffix) => {
    const length = this.getLength(maxLength) + this.getLength((value || "").length);
    let inputClass = styles[`input-${length}${allowClear === true ? '-clear' : ''}${suffix ? '-suffix' : ''}`];
    if (!inputClass) {
      inputClass = styles[`input-8${allowClear === true ? '-clear' : ''}${suffix ? '-suffix' : ''}`]
    }
    // console.log("getClassName --> ", length, inputClass);
    return inputClass;
  }

  getLength = (num) => {
    let length = 0;
    let maxLengthTmp = num;
    while (maxLengthTmp >= 1) {
      maxLengthTmp /= 10;
      length++;
    }
    if (length <= 0) length = 1;
    return length;
  }

  getSuffix = (maxLength, value, suffix) => {
    return (
      <Fragment>
        <span style={{ color: maxLength <= (value || "").length ? 'red' : '#bbb', marginRight: suffix ? 5 : undefined }}>
          {(value || "").length}/{maxLength}
        </span>
        {suffix || null}
      </Fragment>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleChange = (e, maxLength, preventInput, value, onChange, onLimit) => {
    // console.log("handleChange --> ", e.target.value);
    this.useDefaultValue = false;
    if (value === undefined && (!preventInput || (e.target.value || "").length <= maxLength)) {
      this.setState({ innerValue: e.target.value });
    }
    if (onChange instanceof Function) onChange(e);
    if (onLimit instanceof Function && (e.target.value || "").length <= maxLength) onLimit(e.target.value, e);
  }

  render() {
    const {
      defaultValue,                 // 输入框默认内容
      value,                        // 输入框内容
      suffix,                       // input的后缀图标 ReactNode
      maxLength,                    // 输入框输入最大长度
      preventInput = true,         // 输入框输入操过最大长度是否阻止输入
      allowClear = false,           // 可以点击清除图标删除内容 boolean
      onChange,                     // 输入框内容变化时的回调 (e) => ()
      onLimit,                      // 输入超限 (value, e) => ()
      inputStyle = {},              // Input控件style
      inputProps = {},              // Input控件属性
    } = this.props;
    return (
      <Fragment>
        {
          this.getInput({
            defaultValue,
            value,
            suffix,
            maxLength,
            preventInput,
            allowClear,
            onChange,
            onLimit,
            inputStyle,
            inputProps,
          })
        }
      </Fragment>
    );
  }
}

export default InputLimit;
