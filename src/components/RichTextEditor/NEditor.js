import React, { PureComponent, Fragment } from 'react';
// import { Modal, Icon } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from '@/utils/TypeOf';
import IFramePage from '@/components/IFramePage';
// import PagingQueryPage from "@/components/PagingQueryPage";
// import classNames from 'classnames';
// import styles from './index.less'

class NEditor extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // // 加载完成
  // componentDidMount() {
  // }

  // // 组件更新
  // componentDidUpdate(prevProps) {
  //   // const { target } = this.props;
  // }

  // // 组件卸载之前
  // componentWillUnmount() {
  //   // clearTimeout(this.timer);
  // }

  state = {
    myFullscreen: false,
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getNEditor = ({
    width,
    height,
    framePageProps,
    neditorProps,
  }) => {
    const { myFullscreen } = this.state;
    const styleTmp = { ...(framePageProps.style || {}), width, height, border: "1px solid #ddd" };
    if (myFullscreen === true) {
      styleTmp.width = "100%";
      styleTmp.height = "100%";
      styleTmp.position = "fixed";
      styleTmp.top = 0;
      styleTmp.left = 0;
      styleTmp.border = "none";
      styleTmp.margin = "0 auto";
      styleTmp.zIndex = 99999;
    }
    return (
      <IFramePage
        ref={frame => { this.frame = frame; }}
        onload={() => this.handleInit(neditorProps)}
        src="/iframe-page/neditor-standard.html"
        {...framePageProps}
        style={styleTmp}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleInit = (neditorProps) => {
    if (this.init === true) return false;
    if (this.frame && this.frame.getIFrameWindow) {
      this.init = true;
      this.frameWindow = this.frame.getIFrameWindow();
      this.frameElement = this.frame.getIFrameElement();
      // 初始化编辑器
      this.editor = this.frameWindow.initEditor(neditorProps);
    }
    return false;
  }

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  // 获取编辑器对象
  getEditor = () => {
    return this.editor;
  }

  // 全屏/退出全屏
  fullscreen = (fullscreen) => {
    const { myFullscreen } = this.state;
    const newFullscreen = varTypeOf(fullscreen) === TypeEnum.boolean ? fullscreen : !myFullscreen;
    this.setState({ myFullscreen: newFullscreen });
  }

  // 获取纯文本内容
  getContentTxt = () => this.frameWindow.getContentTxt();

  // 获取保留格式的文本内容
  getPlainTxt = () => this.frameWindow.getPlainTxt();

  // 获得整个html的内容
  getAllHtml = () => this.frameWindow.getAllHtml();

  // 获取纯文本内容
  getContentTxt = () => this.frameWindow.getContentTxt();

  // 写入内容
  setContent = (content, isAppendTo = false) => this.frameWindow.setContent(content, isAppendTo);

  // 不可编辑
  setDisabled = () => this.frameWindow.setDisabled();

  // 可以编辑
  setEnabled = () => this.frameWindow.setEnabled();

  // 判断是否有内容
  hasContent = () => this.frameWindow.hasContent();

  setFocus = () => this.frameWindow.setFocus();

  // 销毁编辑器
  deleteEditor = () => this.frameWindow.deleteEditor();

  // 获取草稿箱内容
  getLocalData = () => this.frameWindow.getLocalData();

  // 清空草稿箱
  clearLocalData = () => this.frameWindow.clearLocalData();

  insertHtml = () => this.frameWindow.insertHtml();

  isFocus = () => this.frameWindow.isFocus();

  setblur = () => this.frameWindow.setblur();

  render() {
    const {
      width = "100%",               // IFramePage 宽
      height = 300,                 // IFramePage 高
      framePageProps = {},          // IFramePage 组件属性
      neditorProps = {},            // editor.md 配置属性
    } = this.props;
    if (width) neditorProps.width = width;
    if (height) neditorProps.height = varTypeOf(height) === TypeEnum.number ? (height - 2) : height;
    // 自定义全屏/退出全屏逻辑
    neditorProps.fullscreenFunc = this.fullscreen;
    return (
      <Fragment>
        {
          this.getNEditor({
            width,
            height,
            framePageProps,
            neditorProps,
          })
        }
      </Fragment>
    )
  }
}

export default NEditor;
