export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      { path: '/user/register-result', name: 'register.result', component: './User/RegisterResult' },
      { component: '404' },
    ],
  },
  // app
  {
    path: '/',
    // component: '../layouts/TopAndSideLayout',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // 跟路径跳转
      { path: '/', redirect: '/demo/test' },
      // Demo 菜单
      {
        path: '/demo',
        name: 'demo',
        icon: 'bars',
        routes: [
          { path: '/demo/test', name: 'test', icon: 'smile', component: './Demo/DemoTest' },
          {
            path: '/demo/test2',
            name: 'test2',
            icon: 'smile',
            routes: [
              { path: '/demo/test2/test', name: 'test', icon: 'smile', component: './Demo/DemoTest' },
            ],
          },
          { path: '/demo/excel', name: 'excel-import', icon: 'file-excel', component: './Demo/ExcelImport' },
          { path: '/demo/detail-form', name: 'detail-form', icon: 'table', component: './Demo/DetailForm' },
          { path: '/demo/remote-select-input', name: 'remote-select-input', icon: 'table', component: './Demo/RemoteSelect' },
          { path: '/demo/image-upload', name: 'image-upload', icon: 'table', component: './Demo/ImageUpload' },
          { path: '/demo/input-limit', name: 'input-limit', icon: 'table', component: './Demo/InputLimit' },
          { path: '/demo/form-engine', name: 'form-engine', icon: 'table', component: './Demo/FormEngine' },
          { path: '/demo/form-engine-01', name: 'form-engine-01', icon: 'table', component: './Demo/FormEngine01' },
          // {
          //   path: '/demo/FormEngine',
          //   name: 'FormEngine',
          //   icon: 'form',
          //   routes: [
          //     { path: '/demo/FormEngine/demo1', name: 'Demo1', component: './Demo/FormEngine/Demo1' },
          //   ],
          // },
        ],
      },
      // 多语言翻译开发工具
      {
        path: '/translate',
        name: 'translate',
        icon: 'icon-transform',
        routes: [
          { path: '/translate/baidu', name: 'baidu', icon: 'icon-fanyi', component: './Translate/Baidu' },
        ],
      },
      //  editor
      {
        name: 'editor',
        icon: 'highlight',
        path: '/editor',
        routes: [
          { path: '/editor/flow', name: 'flow', component: './Editor/GGEditor/Flow' },
          { path: '/editor/mind', name: 'mind', component: './Editor/GGEditor/Mind' },
          { path: '/editor/koni', name: 'koni', component: './Editor/GGEditor/Koni' },
        ],
      },
      // 个人帐号中心
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              { path: '/account/center', redirect: '/account/center/articles' },
              { path: '/account/center/articles', component: './Account/Center/Articles' },
              { path: '/account/center/applications', component: './Account/Center/Applications' },
              { path: '/account/center/projects', component: './Account/Center/Projects' },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              { path: '/account/settings', redirect: '/account/settings/base' },
              { path: '/account/settings/base', component: './Account/Settings/BaseView' },
              { path: '/account/settings/security', component: './Account/Settings/SecurityView' },
              { path: '/account/settings/binding', component: './Account/Settings/BindingView' },
              { path: '/account/settings/notification', component: './Account/Settings/NotificationView' },
            ],
          },
        ],
      },
      // 异常页面 - 403 404 500
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          { path: '/exception/403', name: 'not-permission', component: './Exception/403' },
          { path: '/exception/404', name: 'not-find', component: './Exception/404' },
          { path: '/exception/500', name: 'server-error', component: './Exception/500' },
        ],
      },
      // 其他路由 - 404
      { component: './Exception/404' },
    ],
  },
];
