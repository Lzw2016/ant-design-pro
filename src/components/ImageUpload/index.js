import React, { PureComponent, Fragment } from 'react';
import { Modal, Upload, Icon } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
// import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
// import classNames from 'classnames';
// import styles from './Log.less'

class ImageUpload extends PureComponent {

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
  // state = {

  // }

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [
      {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getImageUpload = () => {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理


  render() {
    // const {
    //   // defaultValue,               // 默认值
    //   // value,                      // 输入值(可控属性)
    //   // defaultLoadData = false,    // 是否初始化就加载数据
    //   // url,                        // 加载远程数据请求地址
    //   // searchParamName = "search", // 搜索请求参数名
    //   // searchQueryString = {},     // 搜索请求扩展的QueryString
    //   // requestOptions,             // 请求参数选项(fetch Options参数)
    //   // requestDelay = 350,         // 每次请求延时时间(防止一个时间内多次请求)
    //   // requestInterceptor,         // 发送请求之前的拦截
    //   // requestError,               // 请求失败处理
    //   // responseFilter,             // 响应数据拦截
    //   // dataArrayKey,               // 响应数据中选项数组的名称(如果直接返回响应数组不需要此值)
    //   // dataKey,                    // 数据主键(可以使用dataValueKey属性配置)
    //   // dataValueKey = "value",     // 数据值属性名称
    //   // dataLabelKey = "label",     // 数据标题属性名
    //   // render,                     // 自定义渲染数据 (key, value, label, item) => (String | RactNode)

    //   // onChange,                   // 选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数
    //   // onSearch,                   // 文本框值变化时回调

    //   // selectStyle = {},           // Select控件style
    //   // selectProps = {},           // Select控件属性
    // } = this.props;
    return (
      <Fragment>
        {this.getImageUpload()}
      </Fragment>
    )
  }
}

export default ImageUpload;
