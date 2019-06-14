import React, { PureComponent } from 'react';
import { Modal, Upload, Icon, message, Alert } from 'antd';
import jsonpath from "jsonpath";
import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
// import classNames from 'classnames';
import styles from './index.less'

class ImageUpload extends PureComponent {

  // 构造器
  constructor(props) {
    super(props);
    const { defaultFileList, initFileList = [] } = props;
    this.useDefaultFileList = defaultFileList !== undefined && varTypeOf(defaultFileList) === TypeEnum.array;
    const { innerFileList } = this.state;
    this.state = { ...this.state, innerFileList: [...initFileList, ...innerFileList], defaultFileList };
    // console.log("constructor -> ", defaultFileList);
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
    // 预览上传文件
    previewVisible: false,
    // 预览上传文件内容
    previewContent: undefined,
    // 预览上传文件名称或者描述文本
    previewAlt: undefined,
    // 上传文件列表
    innerFileList: [
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
    widthMinPixel,
    highMinPixel,
    widthMaxPixel,
    highMaxPixel,
    aspectRatioArray,
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
    uploadWrapClassName,
    uploadProps,
    children,
  }) => {
    const { useDefaultFileList } = this;
    const { defaultFileList, innerFileList } = this.state;
    const valueProp = {};
    if (useDefaultFileList) {
      valueProp.defaultFileList = defaultFileList;
    } else {
      valueProp.fileList = innerFileList;
    }
    // console.log("getImageUpload -> ", innerFileList);
    return (
      <Upload
        accept={accept}
        action={uploadUrl}
        // directory={false}
        beforeUpload={(fileParam, fileListParam) =>
          this.beforeUpload(
            fileParam,
            fileListParam,
            fileMaxSizeByMB,
            beforeUpload,
            widthMinPixel,
            highMinPixel,
            widthMaxPixel,
            highMaxPixel,
            aspectRatioArray,
          )
        }
        // customRequest={}
        data={extFormData}
        {...valueProp}
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
        className={uploadWrapClassName || styles.upload}
        {...uploadProps}
      >
        {
          (valueProp.defaultFileList ? valueProp.defaultFileList : valueProp.fileList).length >= fileMaxCount ?
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

  // 上传文件提示
  getAlert = ({
    fileMaxSizeByMB,
    fileMaxCount,
    widthMinPixel,
    highMinPixel,
    widthMaxPixel,
    highMaxPixel,
    aspectRatioArray,
    alertStyle,
  }) => {
    const alerts = [];
    if (fileMaxCount && fileMaxCount > 1 && fileMaxSizeByMB) {
      alerts.push(`最多只能上传${fileMaxCount}张图片,每张不能超过${fileMaxSizeByMB}MB`);
    } else if (fileMaxCount && fileMaxCount > 1) {
      alerts.push(`最多只能上传${fileMaxCount}张图片`);
    } else if (fileMaxSizeByMB) {
      alerts.push(`上传图片文件大小不能超过${fileMaxSizeByMB}MB`);
    }
    if ((widthMinPixel || highMinPixel) && (widthMaxPixel || highMaxPixel)) {
      if (widthMinPixel === widthMaxPixel && highMinPixel === highMaxPixel) {
        alerts.push(`仅支持分辨率${widthMinPixel || "*"}(宽) × ${highMinPixel || "*"}(高)`);
      } else {
        alerts.push(`支持分辨率${widthMinPixel || "*"}(宽) × ${highMinPixel || "*"}(高) ~ ${widthMaxPixel || "*"}(宽) × ${highMaxPixel || "*"}(高)`);
      }
    } else if (widthMinPixel || highMinPixel) {
      alerts.push(`支持最小分辨率${widthMinPixel || "*"}(宽) × ${highMinPixel || "*"}(高)`);
    } else if (widthMaxPixel || highMaxPixel) {
      alerts.push(`支持最大分辨率${widthMaxPixel || "*"}(宽) × ${highMaxPixel || "*"}(高)`);
    }
    if (aspectRatioArray && aspectRatioArray.length > 0) {
      const tmp = aspectRatioArray.map((item, index, arr) => `${item.w}(宽) : ${item.h}(高)${index < (arr.length - 1) ? "、 " : ""}`);
      alerts.push(`图片宽高比必须是: ${tmp.join("")}`);
    }
    return (
      <Alert
        style={{ padding: "6px 0 6px 12px", marginBottom: 8, width: 260, display: "inline-block", ...alertStyle }}
        className={styles.alert}
        type="info"
        message="提示:"
        description={(
          <div style={{ fontSize: 12 }}>
            {alerts.map((alert, index) => (
              <div key={index}>
                {alerts.length <= 1 ? undefined : <strong>{index + 1}.</strong>}
                {alert}
              </div>
            ))}
          </div>
        )}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // 上传之前文件校验
  beforeUpload = (
    fileParam,
    fileListParam,
    fileMaxSizeByMB,
    beforeUpload,
    widthMinPixel,
    highMinPixel,
    widthMaxPixel,
    highMaxPixel,
    aspectRatioArray,
  ) => {
    // console.log("beforeUpload file -->", fileParam);
    // console.log("beforeUpload fileList -->", fileListParam);
    // console.log("beforeUpload fileMaxSizeByMB -->", fileMaxSizeByMB);
    // console.log("------------------------------------------------------------");
    // 文件大小控制
    let fileMaxSize = 10;
    if (fileMaxSizeByMB) fileMaxSize = fileMaxSizeByMB;
    if ((fileParam.size / 1024 / 1024) > fileMaxSize) {
      message.warning(`上传文件[${fileParam.name}]大小已经超过${fileMaxSize}MB`);
      return false;
    }
    // 图片规格控制(宽高比、像素、尺寸)
    if ((widthMaxPixel && highMaxPixel) || (aspectRatioArray && aspectRatioArray.length > 0)) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(fileParam);
        fileReader.onload = (e) => {
          const image = new Image();
          image.src = e.target.result;
          image.onload = () => {
            // console.log("图片：", image.width, image.height);
            let msg = null;
            if (!msg && (widthMinPixel || highMinPixel)) {
              if (!msg && widthMinPixel && image.width < widthMinPixel && highMinPixel && image.height > highMinPixel) {
                msg = `上传文件[${fileParam.name}]低于最小分辨率${widthMinPixel}(宽) x ${highMinPixel}(高)`;
              }
              if (!msg && widthMinPixel && image.width < widthMinPixel) {
                msg = `上传文件[${fileParam.name}]低于最小分辨率${widthMinPixel}(宽)`;
              }
              if (!msg && highMinPixel && image.height < highMinPixel) {
                msg = `上传文件[${fileParam.name}]低于最小分辨率${highMinPixel}(高)`;
              }
            }
            if (!msg && (widthMaxPixel || highMaxPixel)) {
              if (!msg && widthMaxPixel && image.width > widthMaxPixel && highMaxPixel && image.height > highMaxPixel) {
                msg = `上传文件[${fileParam.name}]超过最大分辨率${widthMaxPixel}(宽) x ${highMaxPixel}(高)`;
              }
              if (!msg && widthMaxPixel && image.width > widthMaxPixel) {
                msg = `上传文件[${fileParam.name}]超过最大分辨率${widthMaxPixel}(宽)`;
              }
              if (!msg && highMaxPixel && image.height > highMaxPixel) {
                msg = `上传文件[${fileParam.name}]超过最大分辨率${highMaxPixel}(高)`;
              }
            }
            if (!msg && (aspectRatioArray && aspectRatioArray.length > 0)) {
              let flag = false;
              const aspectRatio = `${(image.width / image.height).toFixed(2)}`;
              aspectRatioArray.forEach(({ w, h }) => {
                if (flag === false && `${(w / h).toFixed(2)}` === aspectRatio) flag = true;
              });
              if (flag === false) msg = `上传文件[${fileParam.name}]宽高比不正确`;
            }
            if (!msg && beforeUpload instanceof Function && beforeUpload(fileParam, fileListParam) === false) {
              msg = `上传文件[${fileParam.name}]自定义取消上传`;
            }
            if (msg) {
              message.warning(msg);
              reject(msg);
            } else {
              resolve(fileParam);
            }
          }
          image.onerror = (error) => {
            return reject(error);
          }
        }
        fileReader.onerror = (error) => {
          return reject(error);
        }
      });
    }
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
    // console.log("getFileUrl file -->", fileParam, " | ",fileParam.response);
    const file = fileParam;
    if (!file.url && file.response && getPreviewUrl instanceof Function) {
      file.url = getPreviewUrl(file, file.response);
    }
    if (!file.url && file.response && varTypeOf(file.response) === TypeEnum.object && fileUrlJsonPath) {
      let url = jsonpath.query(file.response, fileUrlJsonPath);
      if (varTypeOf(url) === TypeEnum.array && url.length >= 1) url = url[0];
      // console.log("getFileUrl url -->", url, file.response, fileUrlJsonPath);
      if (previewUrlPrefix && varTypeOf(url) === TypeEnum.string && lodash.trim(url).length > 0) {
        file.url = previewUrlPrefix + url;
      } else {
        file.url = url;
      }
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
    let { innerFileList } = this.state;
    innerFileList = innerFileList.filter(tmpFile => tmpFile.uid !== file.uid);
    // uid name status
    let msg;
    switch (file.status) {
      case "uploading":
        // 上传中
        innerFileList.push(file);
        if (onUploading instanceof Function) onUploading(changeParam);
        break;
      case "done":
        // 上传完成
        innerFileList.push(file);
        if (onUploadDone instanceof Function) onUploadDone(changeParam);
        break;
      case "error":
        // 上传失败
        msg = `上传文件[${file.name}]出错`;
        if (file.response && (file.response.message || file.response.error)) {
          msg = `${msg}: ${file.response.message || file.response.error}`;
        }
        message.warning(msg);
        innerFileList.push(file);
        if (onUploadError instanceof Function) onUploadError(changeParam);
        break;
      case "removed":
        // 被删除
        if (onUploadRemoved instanceof Function) onUploadRemoved(changeParam);
        break;
      default:
        if (file.percent !== undefined) {
          innerFileList.push(file);
        }
    }
    // console.log("handleChange fileList -->", fileList);
    this.useDefaultFileList = false;
    this.setState({ innerFileList: [...innerFileList] });
    if (onChange instanceof Function) onChange(changeParam);
  }

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  // 返回上传文件列表
  getFileList = () => {
    const { innerFileList } = this.state;
    return innerFileList;
  }

  render() {
    const {
      defaultFileList,              // 默认上传图片数据
      initFileList = [],            // 初始上传的图片数据
      uploadUrl,                    // 上传请求地址
      accept,                       // 支持上传的文件后缀, 如: ".bmp,.jpg,.jpeg,.png,.gif,.svg,.ico"
      fileFormName = "file",        // 上传文件数据表单字段名
      extFormData = {},             // 除了上传文件数据额外需要提交的表单数据
      fileMaxSizeByMB = 10,         // 上传文件的最大大小，默认: 10MB
      fileMaxCount = 1,             // 上传文件数量限制，默认: 1
      widthMinPixel,                // 宽度最小像素
      highMinPixel,                 // 高度最小像素
      widthMaxPixel,                // 宽度最大像素
      highMaxPixel,                 // 高度最大像素
      aspectRatioArray = [],        // 图片宽高比例，如: [{ w: 16, h: 9 }, { w: 4, h: 3 }, { w: 5, h: 3 }]
      fileUrlJsonPath,              // 从上传文件响应数据中读取文件url数据的JsonPath
      previewUrlPrefix,             // 文件预览地址前缀
      getPreviewUrl,                // 文件预览地址 (file, response) => (String)
      beforeUpload,                 // 上传文件之前的钩子(功能同，antd的Upload组件beforeUpload配置)
      onPreview,                    // 点击文件链接或预览图标时的回调(功能同，antd的Upload组件onPreview配置)
      onUploading,                  // 文件正在上传事件 ({ file, fileList, event }) => ()
      onUploadDone,                 // 文件上传完成事件 ({ file, fileList, event }) => ()
      onUploadError,                // 文件上传错误事件 ({ file, fileList, event }) => ()
      onUploadRemoved,              // 文件上传删除事件 ({ file, fileList, event }) => ()
      onChange,                     // 上传文件改变时的状态(功能同，antd的Upload组件onChange配置)
      showAlert = true,             // 是否显示文件上传提示信息Alert
      alertContent,                 // 自定义文件上传提示信息Alert内容 ReactNode
      wrapStyle = {},               // 组件最外层样式
      alertStyle = {},              // 文件上传提示信息Alert组件样式
      uploadWrapClassName,          // 上传组件Upload的属性WrapClassName
      uploadProps = {},             // 上传组件Upload的属性
      modalProps = {},              // 文件预览对话框属性
      saveGetFileList,              // 保存getFileList函数 (getFileList) => ()
      children,                     // 子组件
    } = this.props;
    const { previewVisible, previewContent, previewAlt } = this.state;
    if (children) {
      React.Children.only(children);
    }
    if (saveGetFileList instanceof Function) saveGetFileList(this.getFileList);
    return (
      <div style={{ minHeight: 112, ...wrapStyle }}>
        {
          this.getImageUpload({
            defaultFileList,
            initFileList,
            uploadUrl,
            accept: accept || ".bmp,.jpg,.jpeg,.png,.gif,.svg,.ico,.webp,.pcx,.tif,.tga,.exif,.fpx,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.hdri,.raw,.wmf,.flic,.emf",
            fileFormName,
            extFormData,
            fileMaxSizeByMB,
            fileMaxCount,
            widthMinPixel,
            highMinPixel,
            widthMaxPixel,
            highMaxPixel,
            aspectRatioArray,
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
            uploadWrapClassName,
            uploadProps,
            children,
          })
        }
        {
          showAlert === true ?
            alertContent || this.getAlert({
              fileMaxSizeByMB,
              fileMaxCount,
              widthMinPixel,
              highMinPixel,
              widthMaxPixel,
              highMaxPixel,
              aspectRatioArray,
              alertStyle,
            }) :
            null
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
