import React, { PureComponent, Fragment } from 'react';
// import { Modal, Icon } from 'antd';
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
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

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getEditorMD = ({

  }) => {
    return (
      <IFramePage
        ref={frame => { this.frame = frame; }}
        onload={this.handleInit}
        src="/iframe-page/editot.md-standard.html"
        style={{ height: 600 }}
      />
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleInit = () => {
    if (this.init === true) return;
    if (this.frame && this.frame.getIFrameWindow) {
      this.init = true;
      this.frameWindow = this.frame.getIFrameWindow();
      this.frameElement = this.frame.getIFrameElement();
      this.frameWindow.initEditor();
    }
  }


  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  render() {
    const {
      src,                          // 内嵌页面地址(非受控属性，最好不要变化)
      onload,                       // 完成加载时的事件 () => ()
      iframeProps = {},             // iframe属性
      spinProps = {},               // Spin组件属性
      className,                    // 最外层包装元素的className
      style = {},                   // 最外层包装元素的样式
      iframeClassName,              // iframe元素的className
      iframeStyle = {},             // iframe元素的样式
    } = this.props;
    return (
      <Fragment>
        {
          this.getEditorMD({

          })
        }
      </Fragment>
    )
  }
}

export default EditorMD;
