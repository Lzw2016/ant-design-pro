import React, { PureComponent, Fragment } from 'react';
import { Modal, Upload, Icon, message } from 'antd';
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
  state = {
    // 预览上传文件
    previewVisible: false,
    // 预览上传文件内容
    previewContent: undefined,
    // 预览上传文件名称或者描述文本
    previewAlt: undefined,
    // 文件列表 {}
    fileList: [
      // uid: 'uid',        // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
      // name: 'xx.png'     // 文件名
      // status: 'done',    // 状态有：uploading done error removed
      // response: '{"status": "success"}',     // 服务端响应内容
      // linkProps: '{"download": "image"}',    // 下载链接额外的 HTML 属性
      // url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    ],

  }

  handleCancel = () => this.setState({ previewVisible: false });



  handleChange = ({ fileList }) => this.setState({ fileList });




  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getImageUpload = ({
    uploadUrl,
    accept,
    fileFormName,
    extFormData,
    fileMaxSizeByMB,
    fileMaxCount,
    previewUrlPrefix,
    beforeUpload,
    onPreview,

    uploadProps,

    children,
  }) => {
    const { fileList } = this.state;

    return (
      <Upload
        accept={accept}
        action={uploadUrl}
        directory={false}
        beforeUpload={(fileParam, fileListParam) => this.beforeUpload(fileParam, fileListParam, fileMaxSizeByMB, beforeUpload)}
        // customRequest={}
        data={extFormData}
        fileList={fileList}
        listType="picture-card" // text picture picture-card
        multiple={false}
        name={fileFormName}
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
        withCredentials={true}
        openFileDialogOnClick={true}
        // onChange
        // onPreview
        // onRemove

        onPreview={fileParam => this.handlePreview(fileParam, onPreview)}
        onChange={this.handleChange}

        {...uploadProps}
      >
        {
          fileList.length >= fileMaxCount ?
            null :
            (React.Children.count(children) > 0 ? children : this.getUploadButton())
        }
      </Upload>
    )
  }

  // 获取上传按钮
  getUploadButton = () => {
    return (
      <div>
        <Icon type="plus" style={{ fontSize: 32, color: '#999' }} />
        <div>上传</div>
      </div>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // 上传之前文件校验
  beforeUpload = (fileParam, fileListParam, fileMaxSizeByMB, beforeUpload) => {
    // console.log("beforeUpload --> ", fileParam, "|", fileListParam, "|", fileMaxSizeByMB);
    // 文件大小控制
    let fileMaxSize = 10;
    if (fileMaxSizeByMB) fileMaxSize = fileMaxSizeByMB;
    if ((fileParam.size / 1024 / 1024) > fileMaxSize) {
      message.warning(`上传文件大小不能超过${fileMaxSize}MB`);
      return false;
    }
    // TODO 图片规格控制(宽高比、像素、尺寸)
    if (beforeUpload instanceof Function) return beforeUpload(fileParam, fileListParam);
    return true;
  }

  // 文件预览
  handlePreview = async (fileParam, onPreview) => {
    if (!fileParam.url && !fileParam.preview) {
      // eslint-disable-next-line no-param-reassign
      fileParam.preview = await this.getFileBase64(fileParam.originFileObj);
    }
    this.setState({ previewContent: fileParam.url || fileParam.preview, previewVisible: true });
    if (onPreview instanceof Function) onPreview(fileParam);
  };

  // 读取文件 Base64
  getFileBase64 = (file) => {
    console.log("getFileBase64 -->", file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => {
        console.log("getFileBase64 | onerror -->", error);
        return reject(error);
      }
    });
  }

  render() {
    const {
      uploadUrl,                    // 上传请求地址
      accept,                       // 支持上传的文件后缀
      fileFormName = "file",        // 上传文件数据表单字段名
      extFormData = {},             // 除了上传文件数据额外需要提交的表单数据
      fileMaxSizeByMB = 10,         // 上传文件的最大大小，默认: 10MB
      fileMaxCount = 1,             // 上传文件数量限制，默认: 1
      previewUrlPrefix,             // 文件预览地址前缀

      beforeUpload,                 // 上传文件之前的钩子(功能同，antd的Upload组件beforeUpload配置)
      onPreview,                    // 点击文件链接或预览图标时的回调(功能同，antd的Upload组件onPreview配置)

      wrapStyle = {},               // 组件最外层样式
      uploadProps = {},             // 上传组件Upload的属性
      modalProps = {},              // 文件预览对话框属性

      children,                     // 子组件

      // defaultValue,               // 默认值
      // value,                      // 输入值(可控属性)
      // defaultLoadData = false,    // 是否初始化就加载数据
      // url,                        // 加载远程数据请求地址
      // searchParamName = "search", // 搜索请求参数名
      // searchQueryString = {},     // 搜索请求扩展的QueryString
      // requestOptions,             // 请求参数选项(fetch Options参数)
      // requestDelay = 350,         // 每次请求延时时间(防止一个时间内多次请求)
      // requestInterceptor,         // 发送请求之前的拦截
      // requestError,               // 请求失败处理
      // responseFilter,             // 响应数据拦截
      // dataArrayKey,               // 响应数据中选项数组的名称(如果直接返回响应数组不需要此值)
      // dataKey,                    // 数据主键(可以使用dataValueKey属性配置)
      // dataValueKey = "value",     // 数据值属性名称
      // dataLabelKey = "label",     // 数据标题属性名
      // render,                     // 自定义渲染数据 (key, value, label, item) => (String | RactNode)
    } = this.props;
    const { previewVisible, previewContent, previewAlt } = this.state;
    if (children) {
      React.Children.only(children);
    }
    return (
      <div style={wrapStyle}>
        {
          this.getImageUpload({
            uploadUrl,
            accept: accept || ".bmp,.jpg,.jpeg,.png,.gif,.svg,.ico,.webp,.pcx,.tif,.tga,.exif,.fpx,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.hdri,.raw,.wmf,.flic,.emf",
            fileFormName,
            extFormData,
            fileMaxSizeByMB,
            fileMaxCount,
            previewUrlPrefix,
            beforeUpload,
            onPreview,

            uploadProps,

            children,
          })
        }
        <Modal
          visible={previewVisible}
          mask={true}
          maskClosable={true}
          footer={null}
          onCancel={this.handleCancel}
          {...modalProps}
        >
          <img alt={previewAlt || "文件预览"} src={previewContent} style={{ width: '100%' }} />
        </Modal>
      </div>
    )
  }
}

export default ImageUpload;
