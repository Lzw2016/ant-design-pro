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

  getGridForm = ({
    columnCount,
    defaultValues,
    formFields,
    defaultRowProps,
    rowPropsArray,
    actions,
    formProps,
  }) => {
    let colSpan = Math.ceil(24 / columnCount);
    if (colSpan < 1) colSpan = 1;
    if (colSpan > 4) colSpan = 6;
    // console.log("getGridForm --> ", colSpan);
    const rowArray = [];    // 表单行数组
    let columnArray = [];   // 单行表单输入组件数组
    let columnIndex = 0;    // 一行中当前列位置
    lodash.forEach(formFields, (fieldProp, fieldName) => {
      if (columnIndex >= columnCount) {
        // 需要换行
        columnIndex = 0;
        rowArray.push(columnArray);
        columnArray = [];
      }
      columnIndex++;
      columnArray.push(
        <Col key={fieldName} span={colSpan}>
          {this.getInputComponent(fieldName, fieldProp, defaultValues)}
        </Col>
      );
    });
    // 加入最后一行
    rowArray.push(columnArray);
    // console.log("getGridForm --> ", rowArray);
    return (
      <Form
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        {...formProps}
      >
        {
          rowArray.map((columns, index) => {
            let rowProps = defaultRowProps;
            if (rowPropsArray && rowPropsArray.length > index) rowProps = rowPropsArray[index];
            return <Row key={index} {...rowProps}>{columns}</Row>;
          })
        }
        {
          actions || (
            <div style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={this.handleSubmit}>保存</Button>
              <span style={{ display: 'inline-block', width: 36 }} />
              <Button onClick={this.handleReset}>重置</Button>
              <span style={{ display: 'inline-block', width: 36 }} />
              <Button onClick={this.handleCancel}>取消</Button>
            </div>
          )
        }
      </Form>
    )
  }

  getInputComponent = (
    fieldName,
    fieldProp,
    defaultValues,
  ) => {
    // console.log("getInputComponent --> ", "fieldName = ", fieldName, "fieldProp = ", fieldProp, "labelProp = ", labelProp);
    const { form: { getFieldDecorator } } = this.props;
    const { label, formItemProps, InputComponent, inputProp, inputRender, rules = [] } = fieldProp;
    // TODO InputComponent 适配逻辑
    return (
      <Form.Item label={label || fieldName} {...formItemProps}>
        {getFieldDecorator(fieldName, {
          initialValue: defaultValues[fieldName] || undefined,
          rules,
        })(
          inputRender ?
            inputRender instanceof Function ? inputRender()
              : inputRender
            : InputComponent ? <InputComponent.Component style={{ width: '100%' }} {...inputProp} />
              : <Input style={{ width: '100%' }} {...inputProp} />
        )}
      </Form.Item>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, formValues) => {
      if (err) return;
      console.log("handleSubmit --> ", formValues);
      // 事件处理
    });
  }

  handleReset = () => {
    console.log("handleReset --> ", {});
  }

  handleCancel = () => {
    console.log("handleCancel --> ", {});
  }

  render() {
    const {
      columnCount = 1,                  // 表单布局列数(支持1、2、3、4、6)
      formFields = {},                  // 表单字段配置
      defaultValues = {},               // 表单字段默认值
      saveForm,                         // 保存表单Form对象 (form) => ()
      defaultRowProps = {},             // Row组件默认属性配置
      rowPropsArray = [],               // 自定义每一行的Row组件属性配置(第1行配置取数组rowPropsArray[0]的值)
      actions,                          // 自定义表单提交部分操作 ReactNode


      wrapClassName,                    // 最外层包装元素的className
      wrapStyle = {},                   // 最外层包装元素的className
      formProps = {},                   // Form控件属性
      form,                             // 使用@Form.create()增强的表单对象


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
    if (saveForm instanceof Function) saveForm(form);
    return (
      <div className={wrapClassName || undefined} style={wrapStyle}>
        {
          this.getGridForm({
            columnCount,
            defaultValues,
            formFields,
            defaultRowProps,
            rowPropsArray,
            actions,

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
