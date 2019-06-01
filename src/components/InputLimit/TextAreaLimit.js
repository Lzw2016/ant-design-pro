import React, { PureComponent, Fragment } from 'react';
import { Input } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
// import classNames from 'classnames';
// import styles from './index.less'

class TextAreaLimit extends PureComponent {

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
    maxLength,
    preventInput,
    autosize,
    onChange,
    onLimit,
    wrapClassName,
    wrapStyle,
    textAreaClassName,
    textAreaStyle,
    textAreaProps,
  }) => {
    const { useDefaultValue } = this;
    const { innerValue, defaultValue } = this.state;
    const valueProp = {};
    if (useDefaultValue) {
      valueProp.defaultValue = defaultValue;
    } else {
      valueProp.value = (value === undefined ? innerValue : value);
    }
    return (
      <span className={wrapClassName || undefined} style={{ whiteSpace: 'nowrap', ...wrapStyle }}>
        <Input.TextArea
          className={textAreaClassName || undefined}
          {...valueProp}
          autosize={autosize}
          onChange={e => this.handleChange(e, maxLength, preventInput, value, onChange, onLimit)}
          style={textAreaStyle}
          {...textAreaProps}
        />
        {this.getSuffix(maxLength, valueProp.defaultValue ? valueProp.defaultValue : valueProp.value)}
      </span>
    )
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

  getSuffix = (maxLength, value) => {
    const length = this.getLength(maxLength) + this.getLength((value || "").length);
    return (
      <Fragment>
        <span
          style={{
            position: 'relative',
            left: -1 * (21 + length * 8.75),
            bottom: 2,
            color: maxLength < (value || "").length ? 'red' : '#bbb'
          }}
        >
          {(value || "").length}/{maxLength}
        </span>
      </Fragment>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleChange = (e, maxLength, preventInput, value, onChange, onLimit) => {
    // console.log("handleChange --> ", e.target.value);
    if (value === undefined && (!preventInput || (e.target.value || "").length <= (maxLength + 1))) {
      this.setState({ innerValue: e.target.value });
    }
    if (onChange instanceof Function) onChange(e);
    if (onLimit instanceof Function && (e.target.value || "").length <= (maxLength + 1)) onLimit(e.target.value, e);
  }

  render() {
    const {
      defaultValue,                 // 输入框默认内容
      value,                        // 输入框内容
      maxLength,                    // 输入框输入最大长度
      preventInput = false,         // 输入框输入操过最大长度是否阻止输入
      autosize = false,             // 自适应内容高度，可设置为 true|false 或对象：{ minRows: 2, maxRows: 6 }
      onChange,                     // 输入框内容变化时的回调 (e) => ()
      onLimit,                      // 输入超限 (value, e) => ()
      wrapClassName,                // 最外层包装元素的className
      wrapStyle = {},               // 最外层包装元素的className
      textAreaClassName,            // Input.TextArea控件className
      textAreaStyle = {},           // Input.TextArea控件style
      textAreaProps = {},           // Input.TextArea控件属性
    } = this.props;
    return (
      <Fragment>
        {
          this.getInput({
            defaultValue,
            value,
            maxLength,
            preventInput,
            autosize,
            onChange,
            onLimit,
            wrapClassName,
            wrapStyle,
            textAreaClassName,
            textAreaStyle,
            textAreaProps,
          })
        }
      </Fragment>
    );
  }
}

export default TextAreaLimit;
