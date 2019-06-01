import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Form, Button, Input } from 'antd';
import lodash from 'lodash';
// import classNames from 'classnames';
import InputEnum from './InputEnum';
// import styles from './index.less';

@Form.create()
class FormEngine extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
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
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关
  // align	flex 布局下的垂直对齐方式：top middle bottom	string	top
  // gutter	栅格间隔，可以写成像素值或支持响应式的对象写法 { xs: 8, sm: 16, md: 24}	number/object	0
  // justify	flex 布局下的水平排列方式：start end center space-around space-between	string	start
  // type	布局模式，可选 flex，现代浏览器 下有效	string

  getGridForm = ({
    columnCount,
    formFields,
    formLabels,

    defaultRowProps,
    rowPropsArray,

    formProps,
  }) => {

    let colSpan = Math.ceil(24 / columnCount);
    if (colSpan < 1) colSpan = 1;
    if (colSpan > 4) colSpan = 6;
    // console.log("getGridForm --> ", colSpan);
    const rowArray = [];
    let columnArray = [];
    let columnIndex = 0;
    lodash.forEach(formFields, (fieldProp, fieldName) => {
      const { label, defaultValue, value, inputType, inputProp, inputRender } = fieldProp;
      const { label: label2, formItemProps } = formLabels.fieldName || {};
      console.log("getGridForm --> fieldProp ", fieldProp, inputType);
      if (columnIndex >= columnCount) {
        // 需要换行
        columnIndex = 0;
        rowArray.push(columnArray);
        columnArray = [];
      }
      columnIndex++;

      columnArray.push(
        <Col key={fieldName} span={colSpan}>
          <Form.Item label={label || label2 || fieldName} {...formItemProps}>
            <Input placeholder="输入啦啦" defaultValue={defaultValue} value={value} {...inputProp} />
          </Form.Item>
        </Col>
      );
    });
    // 加入最后一行
    rowArray.push(columnArray);
    console.log("getGridForm --> ", rowArray);
    return (
      <Form
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        {...formProps}
      >
        {
          rowArray.map((columns, index) => <Row key={index}>{columns}</Row>)
        }
      </Form>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  render() {
    const {
      columnCount = 1,                  // 表单布局列数(支持1、2、3、4、6)
      formFields = {},                  // 表单字段配置
      formLabels = {},                  // 表单字段Label配置

      defaultRowProps = {},             // Row组件默认属性配置
      rowPropsArray = [],               // 自定义每一行的Row组件属性配置(第1行配置取数组rowPropsArray[0]的值)

      wrapClassName,                    // 最外层包装元素的className
      wrapStyle = {},                   // 最外层包装元素的className
      formProps = {},                   // Form控件属性





      // defaultValue,                 // 输入框默认内容
      // value,                        // 输入框内容
      // suffix,                       // input的后缀图标 ReactNode
      // maxLength,                    // 输入框输入最大长度
      // preventInput = false,         // 输入框输入操过最大长度是否阻止输入
      // allowClear = false,           // 可以点击清除图标删除内容 boolean
      // onChange,                     // 输入框内容变化时的回调 (e) => ()
      // onLimit,                      // 输入超限 (value, e) => ()
      // inputStyle = {},              // Input控件style
      // inputProps = {},              // Input控件属性
    } = this.props;
    return (
      <div className={wrapClassName || undefined} style={wrapStyle}>
        {
          this.getGridForm({
            columnCount,
            formFields,
            formLabels,

            defaultRowProps,
            rowPropsArray,

            formProps,
          })
        }
      </div>
    );
  }
}

export {
  InputEnum,
  FormEngine,
}
