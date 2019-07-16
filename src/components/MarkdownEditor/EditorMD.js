import React, { PureComponent, Fragment } from 'react';
// import { Modal, Icon } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
import { TypeEnum, varTypeOf } from '@/components/_utils/varTypeOf';
import IFramePage from '@/components/IFramePage';
// import PagingQueryPage from "@/components/PagingQueryPage";
// import classNames from 'classnames';
// import styles from './index.less'

class EditorMD extends PureComponent {

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

  getEditorMD = ({
    width,
    height,
    framePageProps,
    editorMDProps,
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
        onload={() => this.handleInit(editorMDProps)}
        src="/iframe-page/editor.md-standard.html"
        {...framePageProps}
        style={styleTmp}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleInit = (editorMDProps) => {
    if (this.init === true) return false;
    if (this.frame && this.frame.getIFrameWindow) {
      this.init = true;
      this.frameWindow = this.frame.getIFrameWindow();
      this.frameElement = this.frame.getIFrameElement();
      this.frameWindow.initEditor({
        ...editorMDProps,
        onload: () => {
          this.frame.setLoading(false);
          this.editor = this.frameWindow.getEditor();
          // 编辑器全屏
          this.editor.fullscreen();
          if (editorMDProps.onload instanceof Function) editorMDProps.onload();
        },
      });
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
    if (this.editor && this.editor.toolbar && myFullscreen !== newFullscreen) {
      this.editor.toolbar.find(".fa[name=myFullscreen]").parent().toggleClass("active");
    }
  }

  // 读取文本
  getValue = () => {
    let value;
    if (this.editor) {
      value = this.editor.getValue();
    }
    return value;
  }

  // 设置内容
  setValue = (value = "") => {
    if (this.editor) {
      this.editor.setValue(value || "");
    }
  }

  // 读取HTML内容
  getHTML = () => {
    let html;
    if (this.editor) {
      html = this.editor.getHTML();
    }
    return html;
  }

  // 读取Markdown内容
  getMarkdown = () => {
    let markdown;
    if (this.editor) {
      markdown = this.editor.getMarkdown();
    }
    return markdown;
  }

  render() {
    const {
      width = "100%",               // IFramePage 宽
      height = 300,                 // IFramePage 高
      framePageProps = {},          // IFramePage 组件属性
      editorMDProps = {},           // editor.md 配置属性
    } = this.props;
    if (width) editorMDProps.width = width;
    if (height) editorMDProps.height = varTypeOf(height) === TypeEnum.number ? (height - 2) : height;
    // 自定义全屏/退出全屏逻辑
    editorMDProps.fullscreen = this.fullscreen;
    return (
      <Fragment>
        {
          this.getEditorMD({
            width,
            height,
            framePageProps,
            editorMDProps,
          })
        }
      </Fragment>
    )
  }
}

export default EditorMD;
