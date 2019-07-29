import React, { PureComponent, Fragment } from 'react';
// import { Modal, Icon } from 'antd';
import Editor from 'wangeditor'
import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
// import PagingQueryPage from "@/components/PagingQueryPage";
import classNames from 'classnames';
import { varTypeOf, TypeEnum } from "@/utils/TypeOf";
import styles from './WangEditor.less'

class WangEditor extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // 加载完成
  componentDidMount() {
    const {
      debug,
      defaultValue,
      value,
      disable,
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
      defaultFullscreen,
      fullscreenClassName,
      textContainerStyle,
    } = this.props;
    this.initFullscreenPlugin(defaultFullscreen, fullscreenClassName);
    if (!this.editorElem) return;
    if (this.editor) return;
    if (this.toolbarElem) {
      this.editor = new Editor(this.toolbarElem, this.editorElem);
    } else {
      this.editor = new Editor(this.editorElem);
    }
    const { customConfig } = this.editor;
    // 启用调试
    if (debug === false || debug === true) customConfig.debug = true;
    // 使用 onchange 函数监听内容的变化
    if (onchange instanceof Function) customConfig.onchange = onchange;
    // 自定义 onchange 触发的延迟时间(单位ms)，默认为 200 ms
    if (onchangeTimeout) customConfig.onchangeTimeout = onchangeTimeout;
    // 自定义菜单配置
    if (menus && varTypeOf(menus) === TypeEnum.array) customConfig.menus = menus;
    // 配置编辑区域的 z-index, 默认为10000
    if (zIndex && varTypeOf(zIndex) === TypeEnum.number) customConfig.zIndex = zIndex;
    // 多语言
    if (lang && varTypeOf(lang) === TypeEnum.object) customConfig.lang = lang;
    // 关闭粘贴样式的过滤
    if (pasteFilterStyle === false || pasteFilterStyle === true) customConfig.pasteFilterStyle = pasteFilterStyle;
    // 忽略粘贴内容中的图片
    if (pasteIgnoreImg === false || pasteIgnoreImg === true) customConfig.pasteIgnoreImg = pasteIgnoreImg;
    // 自定义处理粘贴的文本内容
    if (pasteTextHandle instanceof Function) customConfig.pasteTextHandle = pasteTextHandle;
    // 插入网络图片的回调
    if (linkImgCallback instanceof Function) customConfig.linkImgCallback = linkImgCallback;
    // 插入链接的校验
    if (linkCheck instanceof Function) customConfig.linkCheck = linkCheck;
    // 插入网络图片的校验
    if (linkImgCheck instanceof Function) customConfig.linkImgCheck = linkImgCheck;
    // 配置 onfocus 函数
    if (onfocus instanceof Function) customConfig.onfocus = onfocus;
    // 配置 onblur 函数
    if (onblur instanceof Function) customConfig.onblur = onblur;
    // 自定义配置颜色（字体颜色、背景色）
    if (colors && varTypeOf(colors) === TypeEnum.array) customConfig.colors = colors;
    // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
    if (emotions && varTypeOf(emotions) === TypeEnum.array) {
      customConfig.emotions = emotions;
    } else {
      customConfig.emotions = [
        {
          title: '表情',
          type: 'emoji',
          content: [
            '😀', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '😗', '😙', '😚', '😇', '😐', '😑', '😶', '😏', '😣', '😥', '😮', '😯', '😪', '😫',
            '😴', '😌', '😛', '😜', '😝', '😒', '😓', '😔', '😕', '😲', '😷', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😬', '😰', '😱', '😳', '😵', '😡', '😠'
          ]
        },
        {
          title: '人物',
          type: 'emoji',
          content: [
            '👦', '👧', '👨', '👩', '👴', '👵', '👶', '👱', '👮', '👲', '👳', '👷', '👸', '💂', '🎅', '👰', '👼', '💆', '💇', '🙍',
            '🙎', '🙅', '🙆', '💁', '🙋', '🙇', '🙌', '🙏', '👤', '👥', '🚶', '🏃', '👯', '💃', '👫', '👬', '👭', '💏', '💑', '👪'
          ]
        },
        {
          title: '动物',
          type: 'emoji',
          content: [
            '🙈', '🙉', '🙊', '🐵', '🐒', '🐶', '🐕', '🐩', '🐺', '🐱', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐈', '🐯', '🐅', '🐆', '🐴', '🐎', '🐮', '🐂',
            '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🐘', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐻', '🐨', '🐼', '🐾', '🐔', '🐓', '🐣', '🐤', '🐥',
            '🐦', '🐧', '🐸', '🐊', '🐢', '🐍', '🐲', '🐉', '🐳', '🐋', '🐬', '🐟', '🐠', '🐡', '🐙', '🐚', '🐌', '🐛', '🐜', '🐝', '🐞', '🦋'
          ]
        },
        {
          title: '物品',
          type: 'emoji',
          content: [
            '💌', '💎', '🔪', '💈', '🚪', '🚽', '🚿', '🛁', '⌛', '⏳', '⌚', '⏰', '🎈', '🎉', '🎊', '🎎', '🎏', '🎐', '🎀', '🎁', '📯', '📻', '📱', '📲', '☎', '📞', '📟', '📠',
            '🔋', '🔌', '💻', '💽', '💾', '💿', '📀', '🎥', '📺', '📷', '📹', '📼', '🔍', '🔎', '🔬', '🔭', '📡', '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓',
            '📃', '📜', '📄', '📰', '📑', '🔖', '💰', '💴', '💵', '💶', '💷', '💸', '💳', '✉', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '✏', '✒',
            '📝', '📁', '📂', '📅', '📆', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '📏', '📐', '✂', '🔒', '🔓', '🔏', '🔐', '🔑', '🔨', '🔫', '🔧', '🔩', '🔗', '💉', '💊',
            '🚬', '🔮', '🚩', '🎌', '💦', '💨'
          ]
        },
      ];
      // 🌹🍀🍎💰📱🌙🍁🍂🍃🌷💎🔪🔫🏀⚽⚡👄👍🔥
      // 手势 💪👈👉☝👆👇✌✋👌👍👎✊👊👋👏👐✍
      // 日常 👣👀👂👃👅👄💋👓👔👕👖👗👘👙👚👛👜👝🎒💼👞👟👠👡👢👑👒🎩🎓💄💅💍🌂
      // 手机 📱📲📶📳📴☎📞📟📠
      // 公共 ♻🏧🚮🚰♿🚹🚺🚻🚼🚾⚠🚸⛔🚫🚳🚭🚯🚱🚷🔞💈
      // 植物 💐🌸💮🌹🌺🌻🌼🌷🌱🌲🌳🌴🌵🌾🌿🍀🍁🍂🍃
      // 自然 🌍🌎🌏🌐🌑🌒🌓🌔🌕🌖🌗🌘🌙🌚🌛🌜☀🌝🌞⭐🌟🌠☁⛅☔⚡❄🔥💧🌊
      // 饮食 🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑🍒🍓🍅🍆🌽🍄🌰🍞🍖🍗🍔🍟🍕🍳🍲🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥🍡🍦🍧🍨🍩🍪🎂🍰🍫🍬🍭🍮🍯🍼☕🍵🍶🍷🍸🍹🍺🍻🍴
      // 文体 🎪🎭🎨🎰🚣🛀🎫🏆⚽⚾🏀🏈🏉🎾🎱🎳⛳🎣🎽🎿🏂🏄🏇🏊🚴🚵🎯🎮🎲🎷🎸🎺🎻🎬
      // 恐怖 😈👿👹👺💀☠👻👽👾💣
      // 旅游 🌋🗻🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽⛪⛲🌁🌃🌆🌇🌉🌌🎠🎡🎢🚂🚃🚄🚅🚆🚇🚈🚉🚊🚝🚞🚋🚌🚍🚎🚏🚐🚑🚒🚓🚔🚕🚖🚗🚘🚚🚛🚜🚲⛽🚨🚥🚦🚧⚓⛵🚤🚢✈💺🚁🚟🚠🚡🚀🎑🗿🛂🛃🛄🛅
      // 标志 ♠♥♦♣🀄🎴🔇🔈🔉🔊📢📣💤💢💬💭♨🌀🔔🔕✡✝🔯📛🔰🔱⭕✅☑✔✖❌❎➕➖➗➰➿〽✳✴❇‼⁉❓❔❕❗©®™🎦🔅🔆💯🔠🔡🔢🔣🔤🅰🆎🅱🆑🆒🆓ℹ🆔Ⓜ🆕🆖🅾🆗🅿🆘🆙🆚🈁🈂🈷🈶🈯🉐🈹🈚🈲🉑🈸🈴🈳㊗㊙🈺🈵▪▫◻◼◽◾⬛⬜🔶🔷🔸🔹🔺🔻💠🔲🔳⚪⚫🔴🔵
      // 生肖 🐁🐂🐅🐇🐉🐍🐎🐐🐒🐓🐕🐖
      // 星座 ♈♉♊♋♌♍♎♏♐♑♒♓⛎
      // 钟表 🕛🕧🕐🕜🕑🕝🕒🕞🕓🕟🕔🕠🕕🕡🕖🕢🕗🕣🕘🕤🕙🕥🕚🕦⌛⏳⌚⏰⏱⏲🕰
      // 心形 💘❤💓💔💕💖💗💙💚💛💜💝💞💟❣
      // 花草 💐🌸💮🌹🌺🌻🌼🌷🌱🌿🍀
      // 树叶🌿🍀🍁🍂🍃
      // 月亮 🌑🌒🌓🌔🌕🌖🌗🌘🌙🌚🌛🌜🌝
      // 水果 🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑🍒🍓
      // 钱币 💴💵💶💷💰💸💳
      // 交通 🚂🚃🚄🚅🚆🚇🚈🚉🚊🚝🚞🚋🚌🚍🚎🚏🚐🚑🚒🚓🚔🚕🚖🚗🚘🚚🚛🚜🚲⛽🚨🚥🚦🚧⚓⛵🚣🚤🚢✈💺🚁🚟🚠🚡🚀
      // 建筑 🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽⛪🌆🌇🌉
      // 办公 📱📲☎📞📟📠🔋🔌💻💽💾💿📀🎥📺📷📹📼🔍🔎🔬🔭📡📔📕📖📗📘📙📚📓📃📜📄📰📑🔖💳✉📧📨📩📤📥📦📫📪📬📭📮✏✒📝📁📂📅📆📇📈📉📊📋📌📍📎📏📐✂🔒🔓🔏🔐🔑
      // 箭头 ⬆↗➡↘⬇↙⬅↖↕↔↩↪⤴⤵🔃🔄🔙🔚🔛🔜🔝
    }
    // 自定义字体
    if (fontNames && varTypeOf(fontNames) === TypeEnum.array) customConfig.fontNames = fontNames;
    if (uploadImgServer && varTypeOf(uploadImgServer) === TypeEnum.string) {
      // 上传图片到服务器
      customConfig.uploadImgServer = uploadImgServer;
    } else if (uploadImgShowBase64 === false || uploadImgShowBase64 === true) {
      // 使用 base64 保存图片
      customConfig.uploadImgShowBase64 = uploadImgShowBase64;
    } else {
      customConfig.uploadImgShowBase64 = true;
    }
    // 隐藏“网络图片”tab
    if (showLinkImg === false || showLinkImg === true) customConfig.showLinkImg = showLinkImg;
    // 创建编辑器
    this.editor.create();
    // 初始化全屏插件
    Editor.fullscreen.init(this.editorElem);
    // 设置样式
    if (textContainerStyle && this.editor.$textElem && this.editor.$textElem.length && this.editor.$textElem.length > 0 && this.editor.$textElem[0].parentNode) {
      // console.log("this.editor.$textElem[0].parentNode", this.editor.$textElem[0].parentNode);
      lodash.forEach(textContainerStyle, (v, k) => {
        // console.log("textContainerStyle --> k ", k, v);
        this.editor.$textElem[0].parentNode.style[k] = v;
      });
    }
    // 禁用/启用编辑器
    if (disable === false || disable === true) this.editor.$textElem.attr('contenteditable', disable);
    // 设置内容
    if (value && varTypeOf(value) === TypeEnum.string) {
      this.editor.txt.html(value);
    } else if (defaultValue && varTypeOf(defaultValue) === TypeEnum.string) {
      this.editor.txt.html(defaultValue);
    }
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
  initFullscreenPlugin = (defaultFullscreen, fullscreenClassName) => {
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
          if (defaultFullscreen === true) Editor.fullscreen.toggleFullscreen(editorSelector);
        },
        toggleFullscreen: editorSelector => {
          if (fullscreenClassName) {
            editorSelector.classList.toggle(fullscreenClassName);
          } else {
            editorSelector.classList.toggle(styles.fullscreen);
          }
          editorSelector.classList.toggle(styles['fullscreen-editor']);
          editorSelector.classList.toggle(styles['fullscreen-active']);
        }
      };
    }
  }

  // 返回编辑器
  getWangEditor = ({
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
      value,                        // 输入框内容(受控属性)
      disable,                      // 禁用编辑器
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
      defaultFullscreen = false,    // 默认是否全屏
      fullscreenClassName,          // 全屏的自定义样式
      textContainerStyle,           // 编辑器容器样式(主要用于设置高度)
      className,                    // 最外层包装元素的className
      style = {},                   // 最外层包装元素的样式
    } = this.props;
    // 设置内容
    if (value && varTypeOf(value) === TypeEnum.string && this.editor && this.editor.txt) {
      // console.log("render --> | value", value);
      this.editor.txt.html(value);
    }
    return (
      <Fragment>
        {
          this.getWangEditor({
            debug,
            defaultValue,
            value,
            disable,
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
            defaultFullscreen,
            fullscreenClassName,
            textContainerStyle,
            className,
            style,
          })
        }
      </Fragment>
    )
  }
}

export default WangEditor;
