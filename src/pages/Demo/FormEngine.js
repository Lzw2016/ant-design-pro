import React, { PureComponent, Fragment } from 'react';
import { Card, Icon, Input } from 'antd';
// import { connect } from 'dva';
import { FormEngine, InputEnum, DisplayEnum } from '@/components/FormEngine';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

// @connect(({ DemoTestModel, loading }) => ({
//   DemoTestModel,
//   loading: loading.effects['DemoTestModel/findByPage'],
// }))
class Demo1 extends PureComponent {

  render() {
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Card bordered={true} style={{ width: 1000 }}>
            <FormEngine
              columnCount={3}
              formFields={{
                userName10: {
                  label: "用户名10",
                  InputComponent: InputEnum.Select,
                  inputProp: { placeholder: "请输入用户名" },
                },
                userName11: {
                  label: "用户名11",
                  InputComponent: InputEnum.Input,
                  inputProp: { placeholder: "请输入用户名" },
                },
                userName12: {
                  label: "用户名12",
                  InputComponent: InputEnum.Input,
                  inputProp: { placeholder: "请输入用户名" },
                },
                userName1: {
                  label: "用户名1",
                  InputComponent: InputEnum.Input,
                  inputProp: { placeholder: "请输入用户名" },
                  suffixLabel: (
                    <Fragment>
                      <Icon type="exclamation-circle" style={{ color: 'red' }} />
                      <span style={{ marginLeft: 8 }}>提示信息12345678</span>
                    </Fragment>
                  )
                },
                userName2: {
                  fieldColSpan: 2,
                  label: "用户名2",
                  InputComponent: InputEnum.Input,
                  inputProp: { placeholder: "请输入用户名" },
                },
                userName3: {
                  label: "用户名3",
                  InputComponent: InputEnum.DatePicker,
                  inputProp: { placeholder: "请输入用户名" },
                },
                userName4: {
                  prefixColSpan: 1,
                  display: DisplayEnum.none,
                  label: "用户名4",
                  InputComponent: InputEnum.Input,
                  inputProp: { placeholder: "请输入用户名" },
                },
                userName5: {
                  label: "用户名5",
                  InputComponent: InputEnum.Input,
                  inputProp: { placeholder: "请输入用户名" },
                },
                userName6: {
                  label: "用户名6",
                  InputComponent: InputEnum.Input,
                  inputProp: { placeholder: "请输入用户名" },
                },
                userName7: {
                  fieldColSpan: 3,
                  label: "用户名7",
                  InputComponent: InputEnum.Input,
                  inputProp: { placeholder: "请输入用户名" },
                },
                userName8: {
                  // suffixColSpan: 0,
                  label: "用户名8",
                  InputComponent: InputEnum.Input,
                  inputProp: { placeholder: "请输入用户名" },
                  rules: [
                    { required: true, message: "必须填项" },
                  ],
                },
                userName9: {
                  suffixColSpan: 1,
                  label: "用户名9",
                  decorator: false,
                  inputRender: <Input placeholder="请输入-用户名9" />,
                  // InputComponent: InputEnum.Input,
                  // inputProp: { placeholder: "请输入用户名" },
                  rules: [
                    { required: true, message: "必须填项" },
                  ],
                },
                userName20: {
                  fieldColSpan: 2,
                  display: formValues => {
                    if (formValues.userName8 && formValues.userName8 === "111") return DisplayEnum.none;
                    return DisplayEnum.show;
                  },
                  disabled: formValues => {
                    if (formValues.userName8 && formValues.userName8 === "222") return true;
                    return false;
                  },
                  readOnly: formValues => {
                    if (formValues.userName8 && formValues.userName8 === "333") return true;
                    return false;
                  },
                  label: "用户名20",
                  InputComponent: InputEnum.InputTextArea,
                  inputProp: { placeholder: "请输入用户名20" },
                  rules: [
                    { required: true, message: "必须填项" },
                  ],
                },
              }}
              defaultValues={{
                userName1: "lizhiwei1",
                // userName2: "lizhiwei2",
                // userName3: "lizhiwei3",
                // userName4: "lizhiwei4",
                userName5: "lizhiwei5",
                userName6: "lizhiwei6",
                userName20: "默认值",
              }}
              onFormValuesChange={(formValues, form) => {
                if (formValues.userName8 && formValues.userName8 === "666") {
                  form.setFieldsValue({ userName20: "666-888" });
                }
              }}
            />
          </Card>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Demo1;
