import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import lodash from 'lodash';
// import moment from 'moment';
// import { connect } from 'dva';
import { ossUrl, appVersion } from "@/../ali-oss-conf";
// import classNames from 'classnames';
import styles from './index.less'

const enableCnd = ENABLE_CND;

class IFramePage extends PureComponent {

  // 构造器
  constructor(props) {
    super(props);
    const { src } = props;
    this.state.loading = !!(src && lodash.trim(src).length > 0);
    this.state.iframeID = lodash.uniqueId("iframe_");
  }

  // 加载完成
  componentDidMount() {
    this.handleInit();
  }

  // 组件更新 prevProps
  componentDidUpdate() {
    this.handleInit();
  }

  // // 组件卸载之前
  // componentWillUnmount() {
  //   // clearTimeout(this.timer);
  // }

  state = {
    loading: false,
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getIframe = ({
    src,
    iframeProps,
    iframeClassName,
    iframeStyle,
  }) => {
    const { iframeID } = this.state;
    let srcUrl = src;
    if (srcUrl && !srcUrl.startsWith("http://") && !srcUrl.startsWith("https://") && enableCnd) {
      srcUrl = `${ossUrl}/${appVersion}${src.startsWith("/") ? '' : '/'}${src}`;
    }
    const iframe = (
      <iframe
        id={iframeID}
        name={iframeID}
        key={iframeID}
        title="iframe"
        src={srcUrl}
        className={iframeClassName}
        style={{ border: 0, width: "100%", height: "100%", ...iframeStyle }}
        {...iframeProps}
      />
    );
    this.handleInit();
    return iframe;
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  handleInit = () => {
    if (this.init === true) return;
    const { iframeID } = this.state;
    const iframe = document.getElementById(iframeID);
    if (iframe) {
      this.init = true;
      iframe.onload = this.handleLoad;
    }
  }

  handleLoad = () => {
    const { onload } = this.props;
    let result = null;
    if (onload instanceof Function) result = onload();
    if (result !== true) this.setState({ loading: false });
  }

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  // 获取 iframe DOM
  getIFrameElement = () => {
    const { iframeID } = this.state;
    return document.getElementById(iframeID)
  }

  // 返回 iframe 下的 window 对象
  getIFrameWindow = () => {
    const { iframeID } = this.state;
    return window.frames[iframeID];
  }

  // 返回 iframe 的ID (name)
  getIFrameID = () => {
    const { iframeID } = this.state;
    return iframeID;
  }

  // 重现设置 src
  setSrc = (newSrc) => {
    const { src } = this.props;
    if (newSrc && lodash.trim(newSrc).length > 0 && lodash.trim(newSrc) !== lodash.trim(src)) {
      const { iframeID } = this.state;
      const iframe = document.getElementById(iframeID);
      if (iframe) {
        iframe.src = newSrc;
        this.setState({ loading: true });
      }
    }
  }

  // 设置loading状态
  setLoading = (loading) => {
    this.setState({ loading: !!loading });
  }

  // 通过 postMessage 通信
  postMessage = (message, targetOrigin, transfer) => {
    const { iframeID } = this.state;
    const iframe = document.getElementById(iframeID);
    if (!iframe) return;
    if (transfer) {
      iframe.contentWindow.postMessage(message, targetOrigin, transfer);
    } else {
      iframe.contentWindow.postMessage(message, targetOrigin);
    }
  }

  render() {
    const {
      src,                          // 内嵌页面地址(非受控属性，最好不要变化)
      onload,                       // 完成加载时的事件 () => boolean(返回true继续保持加载状态)
      iframeProps = {},             // iframe属性
      spinProps = {},               // Spin组件属性
      className,                    // 最外层包装元素的className
      style = {},                   // 最外层包装元素的样式
      iframeClassName,              // iframe元素的className
      iframeStyle = {},             // iframe元素的样式
    } = this.props;
    const { loading } = this.state;
    return (
      <div className={className} style={{ width: "100%", height: 300, ...style }}>
        <Spin spinning={loading} wrapperClassName={styles.spin} {...spinProps}>
          {
            this.getIframe({
              src,
              onload,
              iframeProps,
              iframeClassName,
              iframeStyle,
            })
          }
        </Spin>
      </div>
    )
  }
}

export default IFramePage;
