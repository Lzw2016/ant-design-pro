import React, { PureComponent, Fragment } from 'react';
// import { Modal, Icon } from 'antd';
import Editor from 'wangeditor'
// import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
// import PagingQueryPage from "@/components/PagingQueryPage";
import classNames from 'classnames';
import styles from './WangEditor.less'

class WangEditor extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // 加载完成
  componentDidMount() {
    this.initFullscreenPlugin();
    if (!this.editorElem) return;
    if (this.editor) return;
    if (this.toolbarElem) {
      this.editor = new Editor(this.toolbarElem, this.editorElem);
    } else {
      this.editor = new Editor(this.editorElem);
    }
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    this.editor.customConfig.onchange = html => {
      console.log("html --> ", html);
    }
    // 自定义菜单配置
    this.editor.customConfig.menus = [
      'head',  // 标题
      'bold',  // 粗体
      'fontSize',  // 字号
      'fontName',  // 字体
      'italic',  // 斜体
      'underline',  // 下划线
      'strikeThrough',  // 删除线
      'foreColor',  // 文字颜色
      'backColor',  // 背景颜色
      'link',  // 插入链接
      'list',  // 列表
      'justify',  // 对齐方式
      'quote',  // 引用
      'emoticon',  // 表情
      'image',  // 插入图片
      'table',  // 表格
      'video',  // 插入视频
      'code',  // 插入代码
      'undo',  // 撤销
      'redo'  // 重复
    ];
    // 启用调试
    this.editor.customConfig.debug = true;
    // 自定义 onchange 触发的延迟时间(单位ms)，默认为 200 ms
    this.editor.customConfig.onchangeTimeout = 1000;
    // 配置编辑区域的 z-index, 默认为10000
    this.editor.customConfig.zIndex = 100;
    // 多语言
    // this.editor.customConfig.lang = {
    //   '设置标题': 'title',
    //   '正文': 'p',
    //   '链接文字': 'link text',
    //   '链接': 'link',
    //   '上传图片': 'upload image',
    //   '上传': 'upload',
    //   '创建': 'init'
    //   // 还可自定添加更多
    // };
    // 关闭粘贴样式的过滤
    // this.editor.customConfig.pasteFilterStyle = false;
    // 忽略粘贴内容中的图片
    // this.editor.customConfig.pasteIgnoreImg = false;
    // 自定义处理粘贴的文本内容
    // this.editor.customConfig.pasteTextHandle = content => `${content}<p>在粘贴内容后面追加一行</p>`;
    // 插入网络图片的回调
    this.editor.customConfig.linkImgCallback = url => {
      console.log("插入网络图片的回调 --> ", url);
    }
    // 插入链接的校验
    this.editor.customConfig.linkCheck = (text, link) => {
      console.log(text) // 插入的文字
      console.log(link) // 插入的链接
      return true // 返回 true 表示校验成功
      // return '验证失败' // 返回字符串，即校验失败的提示信息
    }
    // 插入网络图片的校验
    this.editor.customConfig.linkImgCheck = src => {
      console.log(src) // 图片的链接
      return true // 返回 true 表示校验成功
      // return '验证失败' // 返回字符串，即校验失败的提示信息
    }
    // 配置 onfocus 函数
    this.editor.customConfig.onfocus = () => {
      console.log("onfocus");
    }
    // 配置 onblur 函数
    this.editor.customConfig.onblur = html => {
      // html 即编辑器中的内容
      console.log('onblur', html)
    }
    // 自定义配置颜色（字体颜色、背景色）
    this.editor.customConfig.colors = [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#ffffff',
    ];
    // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
    this.editor.customConfig.emotions = [
      {
        // tab 的标题
        title: '默认',
        // type -> 'emoji' / 'image'
        type: 'image',
        // content -> 数组
        content: [
          {
            alt: '[坏笑]',
            src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
          },
          {
            alt: '[舔屏]',
            src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
          }
        ]
      },
      {
        // tab 的标题
        title: 'emoji',
        // type -> 'emoji' / 'image'
        type: 'emoji',
        // content -> 数组
        content: ['😀', '😃', '😄', '😁', '😆']
      },
    ];
    // 自定义字体
    this.editor.customConfig.fontNames = [
      '宋体',
      '微软雅黑',
      'Arial',
      'Tahoma',
      'Verdana',
    ];
    // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用
    this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
    // this.editor.customConfig.uploadImgServer = '/upload'  // 上传图片到服务器
    // 隐藏“网络图片”tab
    this.editor.customConfig.showLinkImg = false
    // 创建编辑器
    this.editor.create();
    Editor.fullscreen.init(this.editorElem);
    // 禁用/启用编辑器
    this.editor.$textElem.attr('contenteditable', true);
    // 设置内容
    this.editor.txt.html('<p>用 JS 设置的内容</p>');
  }

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
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  // 初始化全屏插件
  initFullscreenPlugin = () => {
    if (Editor && !Editor.fullscreen) {
      Editor.fullscreen = {
        init: editorSelector => {
          let toolbar = editorSelector.querySelectorAll('.w-e-toolbar');
          if (toolbar.length <= 0) return;
          toolbar = toolbar[0];
          // console.log("fullscreen --> | toolbar ", toolbar);
          const i = document.createElement("i");
          i.classList.add("wangeditor-btn-fullscreen");
          i.innerHTML = `
            <svg width="21" height="21" viewBox="0 0 1024 1024">
              <path fill="currentColor" d="M189.75 428.89a36.87 36.87 0 0 0 36.84-36.85V228.12h164a36.85 36.85 0 1 0 0-73.7H189.75a36.82 36.82 0 0 0-36.8 36.85v200.8a36.83 36.83 0 0 0 36.8 36.82zM834.26 595.06a36.82 36.82 0 0 0-36.8 36.84v164H633.41a36.85 36.85 0 0 0 0 73.7h200.85a36.87 36.87 0 0 0 36.84-36.85V631.9a36.86 36.86 0 0 0-36.84-36.84zM797.46 228.12v179.31a36.82 36.82 0 1 0 73.64 0V191.24a36.86 36.86 0 0 0-36.84-36.85H602.33a36.85 36.85 0 0 0 0 73.7zM421.62 795.9H226.54V616.56a36.82 36.82 0 1 0-73.64 0v216.19a36.83 36.83 0 0 0 36.85 36.85h231.87a36.85 36.85 0 0 0 0-73.7z"></path>
              <path fill="currentColor" d="M306.5 307.94m32.95 0l345.1 0q32.95 0 32.95 32.95l0 342.22q0 32.95-32.95 32.95l-345.1 0q-32.95 0-32.95-32.95l0-342.22q0-32.95 32.95-32.95Z"></path>
            </svg>
          `;
          const fullscreen = document.createElement("div");
          fullscreen.style.padding = "5px 7px 5px 6px";
          fullscreen.classList.add("w-e-menu");
          fullscreen.appendChild(i)
          toolbar.appendChild(fullscreen)
          fullscreen.addEventListener("click", () => Editor.fullscreen.toggleFullscreen(editorSelector));
        },
        toggleFullscreen: editorSelector => {
          editorSelector.classList.toggle(styles.fullscreen);
          editorSelector.classList.toggle(styles['fullscreen-editor']);
          editorSelector.classList.toggle(styles['fullscreen-active']);
        }
      };
    }
  }

  // 返回编辑器
  getWangEditor = ({
    // debug,
    // defaultValue,
    // value,
    // onchange,
    // onchangeTimeout,
    // menus,
    // zIndex,
    // lang,
    // pasteFilterStyle,
    // pasteIgnoreImg,
    // pasteTextHandle,
    // linkImgCallback,
    // linkCheck,
    // linkImgCheck,
    // onfocus,
    // onblur,
    // colors,
    // emotions,
    // fontNames,
    // uploadImgShowBase64,
    // uploadImgServer,
    // showLinkImg,
    // fullscreen,
    // fullscreenClassName,
    className,
    style,
  }) => {
    return (
      <Fragment>
        {/* <div ref={(toolbarElem) => { this.toolbarElem = toolbarElem }} /> */}
        <div
          ref={(editorElem) => { this.editorElem = editorElem }}
          className={classNames(className, styles['wang-editor'])}
          style={{ textAlign: 'left', ...style }}
        />
      </Fragment>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // -------------------------------------------------------------------------------------------------------------- 对外暴露的方法

  render() {
    const {
      debug,                        // 启用调试
      defaultValue,                 // 输入框默认内容
      value,                        // 输入框内容
      onchange,                     // 输入内容花生变化事件 (html) => ()
      onchangeTimeout,              // onchange 触发的延迟时间(单位ms)，默认为 200ms
      menus,                        // 自定义菜单 Array<String>
      zIndex,                       // 配置编辑区域的 z-index, 默认为10000
      lang,                         // 多语言配置
      pasteFilterStyle,             // 配置粘贴样式过滤
      pasteIgnoreImg,               // 忽略粘贴内容中的图片
      pasteTextHandle,              // 自定义处理粘贴的文本内容 (content) => (content)
      linkImgCallback,              // 插入网络图片的回调 (url) => ()
      linkCheck,                    // 插入链接的校验 (text, link) => (boolean)
      linkImgCheck,                 // 插入网络图片的校验 (src) => (boolean)
      onfocus,                      // 得到焦点事件 () => ()
      onblur,                       // 失去焦点事件 (html) => ()
      colors,                       // 自定义配置颜色（字体颜色、背景色）Array
      emotions,                     // 配置表情 Array
      fontNames,                    // 配置字体 Array
      uploadImgShowBase64 = true,   // 使用base64保存上传图片
      uploadImgServer,              // 上传图片文件服务器api地址
      showLinkImg,                  // 隐藏“网络图片”tab
      fullscreen = false,           // 默认是否全屏
      fullscreenClassName,          // 全屏的自定义样式
      className,                    // 最外层包装元素的className
      style = {},                   // 最外层包装元素的样式
    } = this.props;
    // console.log("render --> ");
    return (
      <Fragment>
        {
          this.getWangEditor({
            debug,
            defaultValue,
            value,
            onchange,
            onchangeTimeout,
            menus,
            zIndex,
            lang,
            pasteFilterStyle,
            pasteIgnoreImg,
            pasteTextHandle,
            linkImgCallback,
            linkCheck,
            linkImgCheck,
            onfocus,
            onblur,
            colors,
            emotions,
            fontNames,
            uploadImgShowBase64,
            uploadImgServer,
            showLinkImg,
            fullscreen,
            fullscreenClassName,
            className,
            style,
          })
        }
      </Fragment>
    )
  }
}

export default WangEditor;
