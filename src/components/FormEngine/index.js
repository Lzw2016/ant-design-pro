import React, { PureComponent } from 'react';
import { Row, Col, Form, Button, Input } from 'antd';
import lodash from 'lodash';
// import classNames from 'classnames';
import InputEnum from './InputEnum';
import DisplayEnum from './DisplayEnum';
// import styles from './index.less';

@Form.create({
  // onFieldsChange: (props, changedFields, allFields) => {
  //   console.log("onFieldsChange --> props ", props);
  //   console.log("onFieldsChange --> changedFields ", changedFields);
  //   console.log("onFieldsChange --> allFields ", allFields);
  // },
  onValuesChange: (props, changedValues, allValues) => {
    // console.log("onValuesChange --> props ", props);
    // console.log("onValuesChange --> changedValues ", changedValues);
    // console.log("onValuesChange --> allValues ", allValues);
    const { onFormValuesChange, form } = props;
    if (onFormValuesChange instanceof Function) onFormValuesChange(changedValues, allValues, form);
  },
})
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

  // Row gutter
  gutter = 8;

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
    const colSpan = Math.ceil(24 / columnCount);
    const { form } = this.props;
    // console.log("getGridForm --> colSpan = ", colSpan, "Math.ceil(24 / columnCount) = ", Math.ceil(24 / columnCount));
    const rowArray = [];    // 表单行数组
    let columnArray = [];   // 单行表单输入组件数组
    let columnIndex = 0;    // 一行中当前列位置
    lodash.forEach(formFields, (fieldProp, fieldName) => {
      const {
        prefixColSpan = 0,
        suffixColSpan = 0,
        suffixLabel,
        suffixLabelColSpan = 1,
        suffixLabelColProps = {}
      } = fieldProp;
      let { fieldColSpan = 1, display = DisplayEnum.show, disabled = false, readOnly = false } = fieldProp;
      if (fieldColSpan <= 0) fieldColSpan = 1;
      if (display instanceof Function) display = display(form.getFieldsValue()) || DisplayEnum.show;
      if (disabled instanceof Function) disabled = disabled(form.getFieldsValue()) || false;
      if (readOnly instanceof Function) readOnly = readOnly(form.getFieldsValue()) || false;
      const colSpanTmp = fieldColSpan + prefixColSpan + suffixColSpan + (suffixLabel ? suffixLabelColSpan : 0);
      // console.log("getGridForm --> ", "columnIndex = ", columnIndex, " | fieldName = ", fieldName, " | prefixColSpan = ", prefixColSpan, " | fieldColSpan = ", fieldColSpan, " | suffixColSpan = ", suffixColSpan);
      // 不占位置消失
      if (display === DisplayEnum.none) {
        // console.log("getGridForm --> 不占位置消失");
        return;
      }
      // 占着位置隐藏
      // if (display === DisplayEnum.hidden) {
      //   console.log("getGridForm --> 占着位置隐藏 css visibility: hidden");
      // }
      // 需要换行 - 正常换行
      if (columnIndex >= columnCount) {
        // console.log("getGridForm 正常换行 --> ", "columnIndex = ", columnIndex, "columnCount = ", columnCount, "fieldName = ", fieldName, "fieldProp = ", fieldProp);
        columnIndex = 0;
        rowArray.push(columnArray);
        columnArray = [];
      }
      columnIndex += colSpanTmp;
      // 需要换行 - 当前行位置不够
      if (columnArray.length >= 1 && columnIndex > columnCount) {
        // console.log("getGridForm 当前行位置不够 --> ", "columnIndex = ", columnIndex, "columnCount = ", columnCount, "fieldName = ", fieldName, "fieldProp = ", fieldProp);
        columnIndex = colSpanTmp;
        rowArray.push(columnArray);
        columnArray = [];
      }
      // 前缀空列
      if (prefixColSpan >= 1) {
        columnArray.push(<Col key={`${fieldName}-prefixColSpan`} span={colSpan * prefixColSpan} />);
      }
      // 输入控件
      columnArray.push(
        <Col key={fieldName} span={colSpan * fieldColSpan} style={{ visibility: display === DisplayEnum.hidden ? 'hidden' : undefined }}>
          {this.getInputComponent(fieldColSpan, fieldName, fieldProp, defaultValues, disabled, readOnly)}
        </Col>
      );
      // 输入控件后缀文案
      if (suffixLabel) {
        columnArray.push(
          <Col
            key={`${fieldName}-suffixLabel`}
            style={{ lineHeight: "39.9999px", verticalAlign: 'middle' }}
            span={colSpan * suffixLabelColSpan}
            {...suffixLabelColProps}
          >
            {(suffixLabel instanceof Function) ? suffixLabel() : suffixLabel}
          </Col>
        );
      }
      // 后缀空列
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
        // onSubmit={e => console.log(e)}
        {...formProps}
      >
        {
          rowArray.map((columns, index) => {
            let rowProps = defaultRowProps;
            if (rowPropsArray && rowPropsArray.length > index) rowProps = rowPropsArray[index];
            return <Row key={index} gutter={this.gutter} {...rowProps}>{columns}</Row>;
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
    disabled,
    readOnly,
  ) => {
    // console.log("getInputComponent --> ", "fieldName = ", fieldName, "fieldProp = ", fieldProp, "labelProp = ", labelProp);
    const { form: { getFieldDecorator } } = this.props;
    const { label, formItemProps, InputComponent, inputProp, inputRender, decorator = true, rules = [], decoratorOptions = {} } = fieldProp;
    const itemProps = this.mergeCalculateCol(fieldColSpan, formItemProps, label);
    // console.log("getInputComponent --> ", "fieldColSpan = ", fieldColSpan, "itemProps = ", itemProps);
    // TODO InputComponent 适配逻辑
    let component;
    if (inputRender) {
      // 自定义控件
      component = inputRender;
      if (inputRender instanceof Function) component = inputRender();
    } else if (InputComponent) {
      // 使用预设控件
      component = <InputComponent.Component style={{ width: '100%' }} {...inputProp} disabled={disabled} readOnly={readOnly} />;
    } else {
      // 默认输入控件
      component = <Input style={{ width: '100%' }} {...inputProp} disabled={disabled} readOnly={readOnly} />;
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
  mergeCalculateCol = (colSpan = 1, colProps = {}, label) => {
    let labelCol = colProps.labelCol || this.labelCol || {};
    const { offset = 0, order = 0, pull = 0, push = 0, span, xs, sm, md, lg, xl, xxl } = labelCol;
    if (label === false) {
      labelCol = {
        offset,
        order,
        pull: pull ? 0 : undefined,
        push: push ? 0 : undefined,
        span: span ? 0 : undefined,
        xs: xs ? 0 : undefined,
        sm: sm ? 0 : undefined,
        md: md ? 0 : undefined,
        lg: lg ? 0 : undefined,
        xl: xl ? 0 : undefined,
        xxl: xxl ? 0 : undefined,
      };
    } else {
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
    }
    const wrapperCol = colProps.wrapperCol || {};
    wrapperCol.span = wrapperCol.span ? 24 - labelCol.span : undefined
    wrapperCol.xs = wrapperCol.xs ? 24 - labelCol.xs : undefined
    wrapperCol.sm = wrapperCol.sm ? 24 - labelCol.sm : undefined
    wrapperCol.md = wrapperCol.md ? 24 - labelCol.md : undefined
    wrapperCol.lg = wrapperCol.lg ? 24 - labelCol.lg : undefined
    wrapperCol.xl = wrapperCol.xl ? 24 - labelCol.xl : undefined
    wrapperCol.xxl = wrapperCol.xxl ? 24 - labelCol.xxl : undefined
    if (
      wrapperCol.span === undefined
      && wrapperCol.xs === undefined
      && wrapperCol.sm === undefined
      && wrapperCol.md === undefined
      && wrapperCol.lg === undefined
      && wrapperCol.xl === undefined
      && wrapperCol.xxl === undefined
    ) {
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
      onFormValuesChange,               // 表单数据发生变化触发

      wrapClassName,                    // 最外层包装元素的className
      wrapStyle = {},                   // 最外层包装元素的className
      formProps = {},                   // Form控件属性
      form,                             // 使用@Form.create()增强的表单对象
    } = this.props;
    let columnCountTmp = columnCount || 1;
    if (columnCountTmp < 1) columnCountTmp = 1;
    if (columnCountTmp > 4) columnCountTmp = 6;
    if (this.saveFormFlag !== true && saveForm instanceof Function) {
      saveForm(form);
      this.saveFormFlag = true;
    }
    // console.log("render --> formData ", form.getFieldsValue());
    return (
      <div className={wrapClassName || undefined} style={wrapStyle}>
        {
          this.getGridForm({
            columnCount: columnCountTmp,
            defaultValues,
            formFields,
            defaultRowProps,
            rowPropsArray,
            actions,
            onFormValuesChange,
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
