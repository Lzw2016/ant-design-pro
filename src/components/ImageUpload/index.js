import React, { PureComponent } from 'react';
import { Modal, Upload, Icon, message } from 'antd';
import jsonpath from "jsonpath";
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
    // 上传文件列表
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

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getImageUpload = ({
    uploadUrl,
    accept,
    fileFormName,
    extFormData,
    fileMaxSizeByMB,
    fileMaxCount,
    fileUrlJsonPath,
    previewUrlPrefix,
    getPreviewUrl,
    beforeUpload,
    onPreview,
    onUploading,
    onUploadDone,
    onUploadError,
    onUploadRemoved,
    onChange,

    uploadProps,

    children,
  }) => {
    const { fileList } = this.state;
    return (
      <Upload
        accept={accept}
        action={uploadUrl}
        // directory={false}
        beforeUpload={(fileParam, fileListParam) => this.beforeUpload(fileParam, fileListParam, fileMaxSizeByMB, beforeUpload)}
        // customRequest={}
        data={extFormData}
        fileList={fileList}
        listType="picture-card" // text picture picture-card
        // multiple={false}
        name={fileFormName}
        showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
        // withCredentials={true}
        // openFileDialogOnClick={true}
        onPreview={fileParam =>
          this.handlePreview(
            fileParam,
            fileUrlJsonPath,
            previewUrlPrefix,
            getPreviewUrl,
            onPreview
          )
        }
        onChange={changeParam =>
          this.handleChange(
            changeParam,
            fileUrlJsonPath,
            previewUrlPrefix,
            getPreviewUrl,
            onUploading,
            onUploadDone,
            onUploadError,
            onUploadRemoved,
            onChange
          )
        }
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
    // console.log("beforeUpload file -->", fileParam);
    // console.log("beforeUpload fileList -->", fileListParam);
    // console.log("beforeUpload fileMaxSizeByMB -->", fileMaxSizeByMB);
    // console.log("------------------------------------------------------------");
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
  handlePreview = async (
    fileParam,
    fileUrlJsonPath,
    previewUrlPrefix,
    getPreviewUrl,
    onPreview
  ) => {
    // console.log("handlePreview -->", fileParam);
    const file = this.getFileUrl({ fileParam, fileUrlJsonPath, previewUrlPrefix, getPreviewUrl });
    if (!file.url && !file.preview) {
      file.preview = await this.getFileBase64(file.originFileObj);
    }
    this.setState({ previewContent: file.url || file.preview, previewAlt: file.name, previewVisible: true });
    if (onPreview instanceof Function) onPreview(file);
  }

  // 读取文件 Base64
  getFileBase64 = (file) => {
    // console.log("getFileBase64 -->", file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => {
        // console.log("getFileBase64 | onerror -->", error);
        return reject(error);
      }
    });
  }

  // 获取文件 URL路径
  getFileUrl = ({
    fileParam,
    fileUrlJsonPath,
    previewUrlPrefix,
    getPreviewUrl,
  }) => {
    const file = fileParam;
    if (!file.url && file.response && getPreviewUrl instanceof Function) {
      file.url = getPreviewUrl(file, file.response);
    }
    if (!file.url && file.response && fileUrlJsonPath) {
      file.url = jsonpath.query(file.response, fileUrlJsonPath);
      if (previewUrlPrefix) file.url = previewUrlPrefix + file.url;
    }
    // console.log("getFileUrl file -->", file, " | ", fileUrlJsonPath);
    return file;
  }

  // 文件发生变化
  handleChange = (
    changeParam,
    fileUrlJsonPath,
    previewUrlPrefix,
    getPreviewUrl,
    onUploading,
    onUploadDone,
    onUploadError,
    onUploadRemoved,
    onChange
  ) => {
    let { file } = changeParam;
    file = this.getFileUrl({ fileParam: file, fileUrlJsonPath, previewUrlPrefix, getPreviewUrl });
    // const { fileList: newFileList, event } = changeParam;
    // console.log("handleChange file -->", file);
    // console.log("handleChange fileList -->", newFileList);
    // console.log("handleChange event -->", event);
    // console.log("------------------------------------------------------------");
    let { fileList } = this.state;
    fileList = fileList.filter(tmpFile => tmpFile.uid !== file.uid);
    // uid name status
    switch (file.status) {
      case "uploading":
        // 上传中
        fileList.push(file);
        if (onUploading instanceof Function) onUploading(changeParam);
        break;
      case "done":
        // 上传完成
        fileList.push(file);
        if (onUploadDone instanceof Function) onUploadDone(changeParam);
        break;
      case "error":
        // 上传失败
        fileList.push(file);
        if (onUploadError instanceof Function) onUploadError(changeParam);
        break;
      case "removed":
        // 被删除
        if (onUploadRemoved instanceof Function) onUploadRemoved(changeParam);
        break;
      default:
        if (file.percent !== undefined) {
          fileList.push(file);
        }
    }
    // console.log("handleChange fileList -->", fileList);
    this.setState({ fileList: [...fileList] });
    if (onChange instanceof Function) onChange(changeParam);
  }

  render() {
    const {
      uploadUrl,                    // 上传请求地址
      accept,                       // 支持上传的文件后缀
      fileFormName = "file",        // 上传文件数据表单字段名
      extFormData = {},             // 除了上传文件数据额外需要提交的表单数据
      fileMaxSizeByMB = 10,         // 上传文件的最大大小，默认: 10MB
      fileMaxCount = 1,             // 上传文件数量限制，默认: 1
      fileUrlJsonPath,              // 从上传文件响应数据中读取文件url数据的JsonPath
      previewUrlPrefix,             // 文件预览地址前缀
      getPreviewUrl,                // 文件预览地址前缀 (file, response) => (String)
      beforeUpload,                 // 上传文件之前的钩子(功能同，antd的Upload组件beforeUpload配置)
      onPreview,                    // 点击文件链接或预览图标时的回调(功能同，antd的Upload组件onPreview配置)
      onUploading,                  // 文件正在上传事件 ({ file, fileList, event }) => ()
      onUploadDone,                 // 文件上传完成事件 ({ file, fileList, event }) => ()
      onUploadError,                // 文件上传错误事件 ({ file, fileList, event }) => ()
      onUploadRemoved,              // 文件上传删除事件 ({ file, fileList, event }) => ()
      onChange,                     // 上传文件改变时的状态(功能同，antd的Upload组件onChange配置)
      wrapStyle = {},               // 组件最外层样式
      uploadProps = {},             // 上传组件Upload的属性
      modalProps = {},              // 文件预览对话框属性
      children,                     // 子组件
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
            fileUrlJsonPath,
            previewUrlPrefix,
            getPreviewUrl,
            beforeUpload,
            onPreview,
            onUploading,
            onUploadDone,
            onUploadError,
            onUploadRemoved,
            onChange,

            uploadProps,

            children,
          })
        }
        <Modal
          visible={previewVisible}
          mask={true}
          maskClosable={true}
          footer={null}
          onCancel={() => this.setState({ previewVisible: false })}
          {...modalProps}
        >
          <img alt={previewAlt || "文件预览"} src={previewContent} style={{ width: '100%' }} />
        </Modal>
      </div>
    )
  }
}

export default ImageUpload;
