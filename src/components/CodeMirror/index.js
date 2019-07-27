import React, { PureComponent, Fragment } from 'react';
// import { Modal, Icon } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from '@/components/_utils/varTypeOf';
import IFramePage from '@/components/IFramePage';
// import PagingQueryPage from "@/components/PagingQueryPage";
// import classNames from 'classnames';
// import styles from './index.less'

class CodeMirror extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // // 加载完成
  // componentDidMount() {
  // }

  // 组件更新 prevProps
  componentDidUpdate() {
  }

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
    codeMirrorProps,
    onInited,
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
        onload={() => this.handleInit(codeMirrorProps, onInited)}
        src="/iframe-page/codemirror-standard.html"
        {...framePageProps}
        style={styleTmp}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleInit = (codeMirrorProps, onInited) => {
    if (this.init === true) return true;
    if (this.frame && this.frame.getIFrameWindow) {
      this.init = true;
      this.frameWindow = this.frame.getIFrameWindow();
      this.frameElement = this.frame.getIFrameElement();
      // 初始化编辑器
      this.frameWindow.initEditor(codeMirrorProps, (editor) => {
        this.editor = editor;
        this.frame.setLoading(false);
        if (onInited instanceof Function) onInited(editor);
      });
    }
    return true;
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

  // 设置值
  setValue = (value) => this.frameWindow.setValue(value);

  // 获取值
  getValue = () => this.frameWindow.getValue();

  // 设置主题
  setTheme = (theme) => this.frameWindow.setTheme(theme);

  // 返回所有主题
  getAllThemes = () => this.frameWindow.themeArray;

  render() {
    const {
      width = "100%",               // IFramePage 宽
      height = 300,                 // IFramePage 高
      framePageProps = {},          // IFramePage 组件属性
      codeMirrorProps = {},         // editor.md 配置属性
      onInited,                     // IFrame组件加载完成事件 (editor) => ()
    } = this.props;
    if (width) codeMirrorProps.width = width;
    if (height) codeMirrorProps.height = varTypeOf(height) === TypeEnum.number ? (height - 2) : height;
    // 自定义全屏/退出全屏逻辑
    codeMirrorProps.fullscreen = this.fullscreen;
    return (
      <Fragment>
        {
          this.getNEditor({
            width,
            height,
            framePageProps,
            codeMirrorProps,
            onInited,
          })
        }
      </Fragment>
    )
  }
}

export default CodeMirror;
