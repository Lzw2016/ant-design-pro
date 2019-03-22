// 全局常量
import React, { Fragment } from 'react';
import { Icon } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

// 系统信息
const SystemInfo = {
  // 系统名称
  name: 'xxx MGR',
  // 系统说明
  description: 'Welcome To xxx MGR',
  // 系统菜单配置
  menu: {
    // 禁用菜单国际化
    disableLocal: false,
  },
  // 系统权限存储key
  localStorageAuthorityKey: 'xxx-MGR',
  languages: [
    { key: 'zh-CN', lang: '🇨🇳', label: '简体中文' },
    { key: 'zh-TW', lang: '🇭🇰', label: '繁体中文' },
    { key: 'en-US', lang: '🇬🇧', label: 'English' },
    { key: 'pt-BR', lang: '🇵🇹', label: 'Português' },
  ],
};

// Layout 配置
const LayoutConfig = {
  // 左侧菜单栏宽度配置
  siderMenuWidth: 200,
  // 全局页头
  globalHeader: {
    // 是否启用全局搜索
    enableHeaderSearch: true,
    // 默认搜索提示关键字
    searchList: () => [
      formatMessage({ id: 'component.globalHeader.search.example1' }),
      formatMessage({ id: 'component.globalHeader.search.example2' }),
      formatMessage({ id: 'component.globalHeader.search.example3' }),
    ],
    // 是否启用帮助文档
    enableHelpDocument: true,
    // 帮助文档地址
    helpDocumentHref: 'https://pro.ant.design/docs/getting-started',
    // 帮助文档打卡方式
    helpDocumentTarget: '_blank',
    // 是否启用系统通知
    enableNotice: true,
    // 是否启用多语言选择
    enableSelectLang: true,
    // 用户中心菜单配置
    userCenter: {
      enableAccountCenter: true,
      enableAccountSettings: true,
    }
  },
  // 是否隐藏页脚
  hiddenFooter: false,
  // 页脚连接
  copyrightLinks: [
    { key: 'help', title: formatMessage({ id: 'common.layout.user.link.help' }), href: '', blankTarget: true },
    { key: 'privacy', title: formatMessage({ id: 'common.layout.user.link.privacy' }), href: '', blankTarget: true },
    { key: 'terms', title: formatMessage({ id: 'common.layout.user.link.terms' }), href: '', blankTarget: true },
  ],
  // 页脚版权
  copyright: (
    <Fragment>
      Copyright <Icon type="copyright" /> <FormattedMessage id="common.layout.copyright" />
    </Fragment>
  ),
};

// 用户登录也配置
const LoginConfig = {
  // 启用帐号登录(帐号密码)
  enableAccountLogin: true,
  // 启用手机号登录(手机号码验证码)
  enableTelephoneLogin: true,
  // 启用忘记密码
  enableForgotPassword: true,
  // 启用用户注册
  enableRegistered: true,
  // 启用Auth2三方登录
  enableAuth2Login: true,
}

// HTTP 状态码错误说明
const CodeMessage = status => {
  const errorMsg = {
    200: formatMessage({ id: 'common.request.error.message.200' }),
    201: formatMessage({ id: 'common.request.error.message.201' }),
    202: formatMessage({ id: 'common.request.error.message.202' }),
    204: formatMessage({ id: 'common.request.error.message.204' }),
    400: formatMessage({ id: 'common.request.error.message.400' }),
    401: formatMessage({ id: 'common.request.error.message.401' }),
    403: formatMessage({ id: 'common.request.error.message.403' }),
    404: formatMessage({ id: 'common.request.error.message.404' }),
    406: formatMessage({ id: 'common.request.error.message.406' }),
    410: formatMessage({ id: 'common.request.error.message.410' }),
    422: formatMessage({ id: 'common.request.error.message.422' }),
    500: formatMessage({ id: 'common.request.error.message.500' }),
    502: formatMessage({ id: 'common.request.error.message.502' }),
    503: formatMessage({ id: 'common.request.error.message.503' }),
    504: formatMessage({ id: 'common.request.error.message.504' }),
  };
  return errorMsg[status];
};

// Model 初始化值配置
const ModelInitState = {
  // 请求 “分页参数” 和 “排序参数” 默认值配置
  queryParam: { pageSize: 10, pageNo: 1, orderField: undefined, sort: undefined },
  // 分页参数默认值配置
  pagination: {
    defaultCurrent: 1,
    defaultPageSize: 10,
    hideOnSinglePage: false,
    pageSizeOptions: ['10', '30', '50', '100'],
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: total => formatMessage({ id: 'common.pagination.showTotal' }, { total }),
    current: 1,
    pageSize: 10,
    total: 0,
  },
};

// 加密解密配置
const CryptoConfig = {
  ManageAES: {
    key: '636c657665722d73656375726974792d',
    iv: 'f0021ea5a06d5a7bade961afe47e9ad9',
  },
  LoginAES: {
    key: '636c657665722d736563757288888888',
    iv: '636c657665722d736563757266666666',
  },
};

// 百度翻译配置
const BaiduTranslate = {
  appid: '201901040002544810',
  key: 'FP3FQIYZNhGbhSe1EtX70',
}

export { SystemInfo, LayoutConfig, LoginConfig, CodeMessage, ModelInitState, CryptoConfig, BaiduTranslate };
