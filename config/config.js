// https://umijs.org/config/
import os from 'os';
import slash from 'slash2';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import aliOssConf from '../ali-oss-conf';

const { pwa, primaryColor, defaultLocale, enableBaseNavigator } = defaultSettings;
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, TEST, ENABLE_CND } = process.env;

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: defaultLocale, // default zh-CN
        baseNavigator: enableBaseNavigator, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false,
      ...(!TEST && os.platform() === 'darwin'
        ? {
          dll: {
            include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
            exclude: ['@babel/runtime', 'netlify-lambda'],
          },
          hardSource: false,
        }
        : {}),
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  publicPath: (ENABLE_CND === true || ENABLE_CND === 'true') ? `${aliOssConf.cdnUrl}/${aliOssConf.appVersion}/` : '',
  // runtimePublicPath: true,
  hash: true,
  history: 'hash',
  // add for transfer to umi
  plugins,
  define: {
    // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '',
    // 请求接口地址前缀
    PROXY_PREFIX: process.env.PROXY_PREFIX || '',
    // 是否启用CDN
    ENABLE_CND: ENABLE_CND === true || ENABLE_CND === 'true'
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  devtool: ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION ? 'source-map' : false,
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  proxy: {
    '/baidu': {
      target: 'http://api.fanyi.baidu.com/',
      changeOrigin: true,
      pathRewrite: { '^/baidu': '' },
    },
    '/api': {
      target: 'http://127.0.0.1:18080/',
      changeOrigin: true,
      pathRewrite: { '^/': '' },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};
