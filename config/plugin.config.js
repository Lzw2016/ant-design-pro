// Change theme plugin

import MergeLessPlugin from 'antd-pro-merge-less';
import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import path from 'path';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

function getModulePackageName(module) {
  if (!module.context) return null;

  const nodeModulesPath = path.join(__dirname, '../node_modules/');
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName;
  // handle tree shaking
  if (packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }
  return packageName;
}

export default config => {
  // Monaco 编辑器插件 available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
  config.plugin('monaco-editor-webpack-plugin').use(
    new MonacoWebpackPlugin({
      languages: ['json', 'javascript', 'typescript']
    })
  );
  const monacoDir = path.resolve(__dirname, '../node_modules/monaco-editor');
  config.module
    // 某些模块编译不过在这里排除
    .rule('css-in-node_modules')
    .exclude.add(monacoDir).end()
    .end()
    // 使用自定义的编译方式进行编译 - monaco-editor
    .rule('monaco-editor')
    .test(/\.css$/)
    .include.add(monacoDir).end()
    .use('style-loader').loader('style-loader').end()
    .use('css-loader').loader('css-loader').end()
    .end()
  // 写入webpack配置
  const FS = require("fs");
  FS.writeFile("./webpack-config.json", config.toString(), error => {
    if (error) {
      console.log("写入文件失败,原因是" + error.message);
      return;
    }
    console.log("写入成功");
  });
  // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  if (
    process.env.ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ||
    process.env.NODE_ENV !== 'production'
  ) {
    // 将所有 less 合并为一个供 themePlugin使用
    const outFile = path.join(__dirname, '../.temp/ant-design-pro.less');
    const stylesDir = path.join(__dirname, '../src/');

    config.plugin('merge-less').use(MergeLessPlugin, [
      {
        stylesDir,
        outFile,
      },
    ]);

    config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
      {
        antDir: path.join(__dirname, '../node_modules/antd'),
        stylesDir,
        varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
        mainLessFile: outFile, //     themeVariables: ['@primary-color'],
        indexFileName: 'index.html',
        generateOne: true,
        lessUrl: 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js',
      },
    ]);
  }
  // optimize chunks
  config.optimization
    .runtimeChunk(false) // share the same chunks across different modules
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: module => {
            const packageName = getModulePackageName(module);
            if (packageName) {
              return ['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0;
            }
            return false;
          },
          name(module) {
            const packageName = getModulePackageName(module);

            if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
              return 'viz'; // visualization package
            }
            return 'misc';
          },
        },
      },
    });
};
