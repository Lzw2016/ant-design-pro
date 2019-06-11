import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Form, Button, Input } from 'antd';
import lodash from 'lodash';
// import classNames from 'classnames';
import InputEnum from './InputEnum';
import DisplayEnum from './DisplayEnum';
import RulesEnum from './RulesEnum';
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
    // 表单提交状态
    submitLoading: false,
  }

  // Form labelCol
  labelCol = { span: 6 };

  // Row gutter
  gutter = 8;

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getGridForm = ({
    defaultLabelCol,
    columnCount,
    defaultRules,
    resetValues,
    defaultValues,
    formFields,
    defaultRowProps,
    rowPropsArray,
    actionsConfig,
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
          {this.getInputComponent(fieldColSpan, fieldName, fieldProp, defaultLabelCol, defaultValues, disabled, readOnly, defaultRules)}
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
            {(suffixLabel instanceof Function) ? suffixLabel(fieldName, defaultValues[fieldName], form.getFieldsValue()) : suffixLabel}
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
    // 生成表单
    const formComponent = (
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
      </Form>
    );
    return this.getActionForm(formComponent, actionsConfig, resetValues, defaultValues);
  }

  // 表单和提交部分 - 布局处理
  getActionForm = (formComponent, actionsConfig, resetValues, defaultValues) => {
    const { submitLoading } = this.state;
    const { form } = this.props;
    // 根据 actionsConfig 动态渲染表单提交部分
    const {
      render,                   // 自定义渲染表单提交部分
      className,                // 自定义class
      style,                    // 自定义style
      placement,                // 表单提交部分的位置 top | bottom | left | right
      height,                   // 高度
      wrapStyle,                // 当lacement=left | right时表单提交部分外层div的自定义样式
      leftStyle,                // 当lacement=left | right时表单提交部分左边div的自定义样式
      rightStyle,               // 当lacement=left | right时表单提交部分右边div的自定义样式
      width,                    // 当lacement=left | right时表单提交部分宽度
      submitText,               // 提交按钮描述
      resetText,                // 重置按钮描述
      cancelText,               // 取消按钮描述
      onSubmit,                 // 表单提交事件 (formValues, form) => ()
      onReset,                  // 表单重置事件(resetValues, defaultValues, form) => ()
      onCancel,                 // 表单取消事件 (form) => ()
      submitUrl,                // 数据提交给服务端地址
      submitMethod,             // 数据提交 Method
      requestInterceptor,       // 请求之前的拦截 ({ url, options }) => (boolean | {url, options })
      submitSuccessful,         // 提交成功回调 (resData, response) => ()
      submitFailure,            // 提交失败回调 (resData, response, error) => ()
    } = actionsConfig;
    const actions = !actionsConfig ?
      undefined
      : render ?
        (render instanceof Function) ? render(resetValues, defaultValues, form, submitLoading) : render
        : (
          <div style={{ textAlign: 'center', height, ...style }} className={className}>
            <Button loading={submitLoading} type="primary" onClick={() => this.handleSubmit(submitUrl, submitMethod, submitSuccessful, submitFailure, requestInterceptor, onSubmit)}>{submitText || "保存"}</Button>
            {
              resetText ? (
                <Fragment>
                  <span style={{ display: 'inline-block', width: 36 }} />
                  <Button disabled={submitLoading} onClick={() => this.handleReset(resetValues, defaultValues, onReset)}>{resetText || "重置"}</Button>
                </Fragment>
              )
                : undefined
            }
            {
              cancelText ? (
                <Fragment>
                  <span style={{ display: 'inline-block', width: 36 }} />
                  <Button disabled={submitLoading} onClick={() => this.handleCancel(onCancel)}>{cancelText || "取消"}</Button>
                </Fragment>
              )
                : undefined
            }
          </div>
        );
    // console.log("getActionForm --> actionsConfig=", actionsConfig, " | actions=", actions);
    if (!actions) return formComponent;
    // 布局处理
    let widthTmp;
    if (`${width}`.toLowerCase().endsWith("%")) {
      widthTmp = lodash.toFinite(width.substr(0, width.length - 1));
      widthTmp = (100 - widthTmp);
      if (widthTmp <= 0) widthTmp = undefined;
    }
    let actionForm;
    switch ((placement || "bottom").toLowerCase()) {
      case "top":
        actionForm = (
          <Fragment>
            {actions}
            {formComponent}
          </Fragment>
        )
        break;
      case "bottom":
        actionForm = (
          <Fragment>
            {formComponent}
            {actions}
          </Fragment>
        )
        break;
      case "left":
        actionForm = (
          <div style={{ width: '100%', ...wrapStyle }}>
            <span style={{ display: 'inline-block', verticalAlign: 'top', width, ...leftStyle }}>{actions}</span>
            <span style={{ display: 'inline-block', verticalAlign: 'top', width: `${widthTmp}%`, ...rightStyle }}>{formComponent}</span>
          </div>
        )
        break;
      case "right":
        actionForm = (
          <div style={{ width: '100%', ...wrapStyle }}>
            <span style={{ display: 'inline-block', verticalAlign: 'top', width: `${widthTmp}%`, ...rightStyle }}>{formComponent}</span>
            <span style={{ display: 'inline-block', verticalAlign: 'top', width, ...leftStyle }}>{actions}</span>
          </div>
        )
        break;
      default:
        actionForm = (
          <Fragment>
            {formComponent}
            {actions}
          </Fragment>
        )
    }
    return actionForm;
  }

  // 得到单个输入控件
  getInputComponent = (
    fieldColSpan,
    fieldName,
    fieldProp,
    defaultLabelCol,
    defaultValues,
    disabled,
    readOnly,
    defaultRules,
  ) => {
    // console.log("getInputComponent --> ", "fieldName = ", fieldName, "fieldProp = ", fieldProp, "labelProp = ", labelProp);
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { useFormItem = true, label, formItemProps, InputComponent, inputProp, inputRender, decorator = true, rules = [], decoratorOptions = {} } = fieldProp;
    const itemProps = this.mergeCalculateCol(fieldColSpan, formItemProps, defaultLabelCol, label);
    // console.log("getInputComponent --> ", "fieldColSpan = ", fieldColSpan, "itemProps = ", itemProps);
    let component;
    if (inputRender) {
      // 自定义控件
      component = inputRender;
      if (inputRender instanceof Function) component = inputRender(fieldName, defaultValues[fieldName], form.getFieldsValue());
    } else if (InputComponent) {
      // 使用预设控件
      if (InputComponent.render instanceof Function) {
        component = InputComponent.render(form, fieldName, defaultValues, rules, defaultRules, decoratorOptions, { disabled, readOnly, ...inputProp });
      } else {
        component = <InputComponent.Component style={{ width: '100%' }} {...inputProp} disabled={disabled} readOnly={readOnly} />;
      }
    } else {
      // 默认输入控件
      component = <Input style={{ width: '100%' }} {...inputProp} disabled={disabled} readOnly={readOnly} />;
    }
    // 是否需要使用 form.getFieldDecorator 装饰输入控件
    if (decorator === true && InputComponent.skipDecorator !== true) {
      component = getFieldDecorator(
        fieldName,
        {
          initialValue: defaultValues[fieldName] || undefined,
          rules: (rules && rules.length > 0) ? rules : defaultRules,
          ...decoratorOptions,
        }
      )(component);
    }
    return (
      useFormItem === true ?
        (
          <Form.Item
            label={label || fieldName}
            {...itemProps}
          >
            {component}
          </Form.Item>
        )
        : component
    )
  }

  // 合并计算 labelCol wrapperCol
  mergeCalculateCol = (colSpan = 1, colProps = {}, defaultLabelCol, label) => {
    let labelCol = colProps.labelCol || defaultLabelCol || this.labelCol || {};
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

  handleSubmit = (submitUrl, submitMethod, submitSuccessful, submitFailure, requestInterceptor, onSubmit) => {
    const { form } = this.props;
    form.validateFields((err, formValues) => {
      // console.log("handleSubmit --> ", formValues);
      if (err) return;
      // 事件处理
      if (onSubmit instanceof Function) onSubmit(formValues, form);
      // 发送提交请求
      if (!submitUrl) return;
      const fetchOptions = {
        url: submitUrl,
        options: { method: submitMethod, body: JSON.stringify(formValues), headers: { "Content-Type": "application/json" } },
      };
      // 请求之前的拦截
      if (requestInterceptor instanceof Function) {
        const tmp = requestInterceptor(fetchOptions);
        if (tmp === false) return;
        if (tmp && tmp.url) fetchOptions.url = tmp.url;
        if (tmp && tmp.options) fetchOptions.options = tmp.options;
      }
      // console.log("handleSubmit --> ", fetchOptions);
      this.setState({ submitLoading: true });
      fetch(fetchOptions.url, fetchOptions.options)
        .then(response => {
          this.setState({ submitLoading: false });
          const resData = response.json();
          if (response.status < 200 || response.status >= 400) {
            if (submitFailure instanceof Function) submitFailure(resData, response);
            return;
          }
          if (submitSuccessful instanceof Function) submitSuccessful(resData, response);

        })
        .catch(error => {
          this.setState({ submitLoading: false });
          if (submitFailure instanceof Function) submitFailure(undefined, undefined, error);
        });
    });
  }

  handleReset = (resetValues, defaultValues, onReset) => {
    // console.log("handleReset --> resetValues=", resetValues, " | defaultValues=", defaultValues);
    const { form } = this.props;
    // TODO 需要优化
    if (lodash.values(resetValues).length >= 1) {
      // form.setFields(resetValues);
      form.resetFields();
    } else {
      form.resetFields();
    }
    if (onReset instanceof Function) onReset(resetValues, defaultValues, form);
  }

  handleCancel = (onCancel) => {
    // console.log("handleCancel --> ", {});
    const { form } = this.props;
    if (onCancel instanceof Function) onCancel(form);
  }

  render() {
    const {
      saveForm,                         // 保存表单Form对象 (form) => ()
      defaultLabelCol,                  // 默认全局的Form.Item labelCol属性(wrapperCol属性是通过labelCol值计算得出)
      actionsConfig = {},               // 表单提交部分配置 boolean | {}
      columnCount = 1,                  // 表单布局列数(支持1、2、3、4、6)
      resetValues = {},                 // 表单重置值配置
      defaultValues = {},               // 表单字段默认值
      defaultRules = [],                // 默认全局校验
      formFields = {},                  // 表单字段配置
      defaultRowProps = {},             // Row组件默认属性配置
      rowPropsArray = [],               // 自定义每一行的Row组件属性配置(第1行配置取数组rowPropsArray[0]的值)
      onFormValuesChange,               // 表单数据发生变化触发
      wrapClassName,                    // 最外层包装元素的className
      wrapStyle = {},                   // 最外层包装元素的className
      formProps = {},                   // Form控件属性
      form,                             // 使用@Form.create()增强的表单对象
    } = this.props;
    // columnCount 默认值处理
    let columnCountTmp = columnCount || 1;
    if (columnCountTmp < 1) columnCountTmp = 1;
    if (columnCountTmp > 4) columnCountTmp = 6;
    // actionsConfig 默认值处理
    const actionsConfigTmp = actionsConfig === false ? undefined : {
      render: undefined,                  // 自定义渲染表单提交部分
      className: undefined,               // 自定义class
      style: undefined,                   // 自定义style
      placement: "bottom",                // 表单提交部分的位置 top bottom left right
      height: undefined,                  // 高度
      wrapStyle: {},                      // 当lacement=left | right时表单提交部分外层div的自定义样式
      leftStyle: {},                      // 当lacement=left | right时表单提交部分左边div的自定义样式
      rightStyle: {},                     // 当lacement=left | right时表单提交部分右边div的自定义样式
      width: "20%",                       // 当lacement=left | right时表单提交部分宽度
      submitText: "提交",                  // 提交按钮描述
      resetText: "重置",                   // 重置按钮描述
      cancelText: undefined,              // 取消按钮描述
      onSubmit: undefined,                // 表单提交事件 (formValues, form) => ()
      onReset: undefined,                 // 表单重置事件(resetValues, defaultValues, form) => ()
      onCancel: undefined,                // 表单取消事件 (form) => ()
      submitUrl: undefined,               // 数据提交给服务端地址
      submitMethod: "post",               // 数据提交 Method
      requestInterceptor: undefined,      // 请求之前的拦截 ({ url, options }) => (boolean | {url, options })
      submitSuccessful: undefined,        // 提交成功回调 (resData, response) => ()
      submitFailure: undefined,           // 提交失败回调 (resData, response, error) => ()
      ...(actionsConfig || {}),
    }
    if (this.saveFormFlag !== true && saveForm instanceof Function) {
      saveForm(form);
      this.saveFormFlag = true;
    }
    // console.log("render --> formData ", form.getFieldsValue());
    return (
      <div className={wrapClassName || undefined} style={wrapStyle}>
        {
          this.getGridForm({
            defaultLabelCol,
            columnCount: columnCountTmp,
            defaultRules,
            resetValues,
            defaultValues,
            formFields,
            defaultRowProps,
            rowPropsArray,
            actionsConfig: actionsConfigTmp,
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
  RulesEnum,
  FormEngine,
}
