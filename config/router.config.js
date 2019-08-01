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
    ],
  },
  // Demo
  {
    path: '/',
    // component: '../layouts/TopAndSideLayout',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // 首页
      { path: '/', redirect: '/security/user_manage' },
      // Security
      {
        path: '/security',
        name: 'security',
        icon: 'icon-anquanbaozhang',
        routes: [
          { path: '/security', redirect: '/security/user_manage' },
          { path: '/security/user_manage', name: 'user_manage', icon: 'icon-yonghuguanli1', component: './Security/UserManage' },
          { path: '/security/role_manage', name: 'role_manage', icon: 'icon-jiaoseguanli1', component: './Security/UserManage' },
          { path: '/security/service_sys', name: 'service_sys', icon: 'icon-drxx11', component: './Security/UserManage' },
          { path: '/security/permission_manage', name: 'permission_manage', icon: 'icon-quanxian', component: './Security/UserManage' },
          { path: '/security/authorization', name: 'authorization', icon: 'icon-shouquanchenggong', component: './Security/UserManage' },
          { path: '/security/login_log', name: 'login_log', icon: 'icon-log1', component: './Security/UserManage' },
          { path: '/security/remember_me_token_manage', name: 'remember_me_token_manage', icon: 'icon-token1', component: './Security/UserManage' },
          { path: '/security/jwt_token_manage', name: 'jwt_token_manage', icon: 'icon-token1', component: './Security/UserManage' },
          { path: '/security/oauth_token_manage', name: 'oauth_token_manage', icon: 'icon-token1', component: './Security/UserManage' },
          { path: '/security/cas_token_manage', name: 'cas_token_manage', icon: 'icon-token1', component: './Security/UserManage' },
        ],
      },
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
        ],
      },
      // 多语言翻译开发工具
      {
        path: '/translate',
        name: 'translate',
        icon: 'icon-fanyipingtai',
        routes: [
          { path: '/translate/baidu', name: 'baidu', icon: 'icon-fanyi1', component: './Translate/Baidu' },
        ],
      },
      // 文档
      {
        name: "hlep-doc",
        icon: 'question-circle',
        path: 'http://doc.msvc.top/docs/antd-react',
        target: '_blank',
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
