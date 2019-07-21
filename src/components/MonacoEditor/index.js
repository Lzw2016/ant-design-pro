import React, { PureComponent, Fragment } from 'react';
// import { Modal, Icon } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from '@/components/_utils/varTypeOf';
import IFramePage from '@/components/IFramePage';
// import PagingQueryPage from "@/components/PagingQueryPage";
// import classNames from 'classnames';
// import styles from './index.less'

class MonacoEditor extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // // 加载完成
  // componentDidMount() {
  // }

  // 组件更新 prevProps
  componentDidUpdate() {
    if (this.editor) {
      this.editor.layout();
    }
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
    monacoProps,
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
        onload={() => this.handleInit(monacoProps)}
        src="/iframe-page/monaco-editor-standard.html"
        {...framePageProps}
        style={styleTmp}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleInit = (monacoProps) => {
    if (this.init === true) return true;
    if (this.frame && this.frame.getIFrameWindow) {
      this.init = true;
      this.frameWindow = this.frame.getIFrameWindow();
      this.frameElement = this.frame.getIFrameElement();
      // 初始化编辑器
      this.frameWindow.initEditor(monacoProps, (editor) => {
        this.editor = editor;
        this.frame.setLoading(false);
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

  // 设置主题 vs、vs-dark、hc-black
  setTheme = (theme) => this.frameWindow.setTheme(theme);

  // 改变属性
  updateOptions = (config) => this.frameWindow.updateOptions(config);

  render() {
    const {
      width = "100%",               // IFramePage 宽
      height = 300,                 // IFramePage 高
      framePageProps = {},          // IFramePage 组件属性
      monacoProps = {},            // editor.md 配置属性
    } = this.props;
    if (width) monacoProps.width = width;
    if (height) monacoProps.height = varTypeOf(height) === TypeEnum.number ? (height - 2) : height;
    // 自定义全屏/退出全屏逻辑
    monacoProps.fullscreen = this.fullscreen;
    return (
      <Fragment>
        {
          this.getNEditor({
            width,
            height,
            framePageProps,
            monacoProps,
          })
        }
      </Fragment>
    )
  }
}

export default MonacoEditor;
