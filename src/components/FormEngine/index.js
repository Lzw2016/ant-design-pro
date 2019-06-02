import React, { PureComponent } from 'react';
import { Row, Col, Form, Button, Input } from 'antd';
import lodash from 'lodash';
// import classNames from 'classnames';
import InputEnum from './InputEnum';
import DisplayEnum from './DisplayEnum';
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

  // Form labelCol
  labelCol = { span: 6 };

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
    let columnCountTmp = columnCount || 1;
    if (columnCountTmp < 1) columnCountTmp = 1;
    if (columnCountTmp > 4) columnCountTmp = 6;
    const colSpan = Math.ceil(24 / columnCountTmp);
    // console.log("getGridForm --> colSpan = ", colSpan, "Math.ceil(24 / columnCount) = ", Math.ceil(24 / columnCount));
    const rowArray = [];    // 表单行数组
    let columnArray = [];   // 单行表单输入组件数组
    let columnIndex = 0;    // 一行中当前列位置
    lodash.forEach(formFields, (fieldProp, fieldName) => {
      const { prefixColSpan = 0, suffixColSpan = 0, display = DisplayEnum.show } = fieldProp;
      let { fieldColSpan = 1 } = fieldProp;
      if (fieldColSpan <= 0) fieldColSpan = 1;
      if (display === DisplayEnum.none) {
        // 不占位置消失
        return;
      }
      if (display === DisplayEnum.hidden) {
        // 占着位置隐藏
        let colSpanTmp = fieldColSpan + prefixColSpan + suffixColSpan;
        columnIndex += colSpanTmp;
        if (columnArray.length >= 1 && columnIndex > columnCount) colSpanTmp = columnCount - (columnIndex - colSpanTmp);
        columnArray.push(<Col key={fieldName} span={colSpan * colSpanTmp} />);
        return;
      }
      if (columnIndex >= columnCount) {
        // console.log("getGridForm --> ", "columnIndex = ", columnIndex, "columnCount = ", columnCount, "fieldName = ", fieldName, "fieldProp = ", fieldProp);
        // 需要换行 - 正常换行
        columnIndex = 0;
        rowArray.push(columnArray);
        columnArray = [];
      }
      columnIndex = columnIndex + fieldColSpan + prefixColSpan + suffixColSpan;
      if (columnArray.length >= 1 && columnIndex > columnCount) {
        // console.log("getGridForm --> ", "columnIndex = ", columnIndex, "columnCount = ", columnCount, "fieldName = ", fieldName, "fieldProp = ", fieldProp);
        // 需要换行 - 当前行位置不够
        rowArray.push(columnArray);
        columnArray = [];
      }
      if (prefixColSpan >= 1) {
        columnArray.push(<Col key={`${fieldName}-prefixColSpan`} span={colSpan * prefixColSpan} />);
      }
      columnArray.push(
        <Col key={fieldName} span={colSpan * fieldColSpan}>
          {this.getInputComponent(fieldColSpan, fieldName, fieldProp, defaultValues)}
        </Col>
      );
      if (suffixColSpan >= 1) {
        columnArray.push(<Col key={`${fieldName}-suffixColSpan`} span={colSpan * suffixColSpan} />);
      }
    });
    // 加入最后一行
    rowArray.push(columnArray);
    // console.log("getGridForm --> ", rowArray);
    return (
      <Form
        layout="horizontal"
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
    fieldColSpan,
    fieldName,
    fieldProp,
    defaultValues,
  ) => {
    // console.log("getInputComponent --> ", "fieldName = ", fieldName, "fieldProp = ", fieldProp, "labelProp = ", labelProp);
    const { form: { getFieldDecorator } } = this.props;
    const { label, formItemProps, InputComponent, inputProp, inputRender, decorator = true, rules = [], decoratorOptions = {} } = fieldProp;
    const itemProps = this.mergeCalculateCol(fieldColSpan, formItemProps);
    // console.log("getInputComponent --> ", "fieldColSpan = ", fieldColSpan, "itemProps = ", itemProps);
    // TODO InputComponent 适配逻辑
    let component;
    if (inputRender) {
      // 自定义控件
      component = inputRender;
      if (inputRender instanceof Function) component = inputRender();
    } else if (InputComponent) {
      // 使用预设控件
      component = <InputComponent.Component style={{ width: '100%' }} {...inputProp} />;
    } else {
      // 默认输入控件
      component = <Input style={{ width: '100%' }} {...inputProp} />;
    }
    // 是否需要使用 form.getFieldDecorator 装饰输入控件
    if (decorator === true) {
      component = getFieldDecorator(
        fieldName,
        {
          initialValue: defaultValues[fieldName] || undefined,
          rules,
          ...decoratorOptions,
        }
      )(component);
    }
    return (
      <Form.Item
        label={label || fieldName}
        {...itemProps}
      >
        {component}
      </Form.Item>
    )
  }

  // 合并计算 labelCol wrapperCol
  mergeCalculateCol = (colSpan = 1, colProps = {}) => {
    let labelCol = colProps.labelCol || this.labelCol || {};
    const { offset = 0, order = 0, pull = 0, push = 0, span, xs, sm, md, lg, xl, xxl } = labelCol;

    labelCol = {
      offset,
      order,
      pull: pull ? Math.ceil(pull / colSpan) : undefined,
      push: push ? Math.ceil(push / colSpan) : undefined,
      span: span ? Math.ceil(span / colSpan) : undefined,
      xs: xs ? Math.ceil(xs / colSpan) : undefined,
      sm: sm ? Math.ceil(sm / colSpan) : undefined,
      md: md ? Math.ceil(md / colSpan) : undefined,
      lg: lg ? Math.ceil(lg / colSpan) : undefined,
      xl: xl ? Math.ceil(xl / colSpan) : undefined,
      xxl: xxl ? Math.ceil(xxl / colSpan) : undefined,
    };
    const wrapperCol = colProps.wrapperCol || {};
    wrapperCol.span = wrapperCol.span ? 24 - labelCol.span : undefined
    wrapperCol.xs = wrapperCol.xs ? 24 - labelCol.xs : undefined
    wrapperCol.sm = wrapperCol.sm ? 24 - labelCol.sm : undefined
    wrapperCol.md = wrapperCol.md ? 24 - labelCol.md : undefined
    wrapperCol.lg = wrapperCol.lg ? 24 - labelCol.lg : undefined
    wrapperCol.xl = wrapperCol.xl ? 24 - labelCol.xl : undefined
    wrapperCol.xxl = wrapperCol.xxl ? 24 - labelCol.xxl : undefined
    if (!wrapperCol.span && !wrapperCol.xs && !wrapperCol.sm && !wrapperCol.md && !wrapperCol.lg && !wrapperCol.xl && !wrapperCol.xxl) {
      wrapperCol.span = 24 - labelCol.span;
    }
    return { ...colProps, labelCol, wrapperCol };
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
    const { form } = this.props;
    form.resetFields();
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
  DisplayEnum,
  FormEngine,
}
