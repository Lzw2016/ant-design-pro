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
  // Demo
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
      // 数据录入
      {
        path: '/entry',
        name: 'entry',
        icon: 'form',
        routes: [
          { path: '/entry/excel', name: 'excel-import', icon: 'file-excel', component: './Demo/ExcelImport' },
          { path: '/entry/remote-select-input', name: 'remote-select-input', icon: 'table', component: './Demo/RemoteSelect' },
          { path: '/entry/image-upload', name: 'image-upload', icon: 'table', component: './Demo/ImageUpload' },
          { path: '/entry/input-limit', name: 'input-limit', icon: 'table', component: './Demo/InputLimit' },
          { path: '/entry/form-engine', name: 'form-engine', icon: 'table', component: './Demo/FormEngine' },
          { path: '/entry/form-engine-01', name: 'form-engine-01', icon: 'table', component: './Demo/FormEngine01' },
          { path: '/entry/form-engine-02', name: 'form-engine-02', icon: 'table', component: './Demo/FormEngine02' },
          { path: '/entry/form-engine-03', name: 'form-engine-03', icon: 'table', component: './Demo/FormEngine03' },
          { path: '/entry/form-engine-04', name: 'form-engine-04', icon: 'table', component: './Demo/FormEngine04' },
          { path: '/entry/form-modal', name: 'form-modal', icon: 'table', component: './Demo/FormModal' },
          { path: '/entry/modal-table-select', name: 'modal-table-select', icon: 'table', component: './Demo/ModalTableSelect' },
          { path: '/entry/input-table-select', name: 'input-table-select', icon: 'table', component: './Demo/InputTableSelect' },
        ],
      },
      // 富文本编辑器
      {
        path: '/text-editor',
        name: 'text-editor',
        icon: 'form',
        routes: [
          // { path: '/text-editor/markdown-toast', name: 'markdown-toast', icon: 'table', component: './Demo/ToastMarkdown' },
          // { path: '/text-editor/markdown-easymde', name: 'markdown-easymde', icon: 'table', component: './Demo/EasyMDEMarkdown' },
          { path: '/text-editor/markdown-editor.md', name: 'markdown-editor.md', icon: 'table', component: './Demo/EditorMD' },
          { path: '/text-editor/wang-editor', name: 'wang-editor', icon: 'table', component: './Demo/WangEditor' },
          { path: '/text-editor/neditor', name: 'neditor', icon: 'table', component: './Demo/NEditor' },
        ],
      },
      // 代码编辑器
      {
        path: '/code-editor',
        name: 'code-editor',
        icon: 'form',
        routes: [
          // { path: '/code-editor/monaco-editor', name: 'monaco-editor', icon: 'table', component: './Demo/MonacoEditor' },
          // { path: '/code-editor/code-mirror-editor', name: 'code-mirror-editor', icon: 'table', component: './Demo/CodeMirrorEditor' },
          // { path: '/code-editor/syntax-highlighter', name: 'syntax-highlighter', icon: 'table', component: './Demo/SyntaxHighlighter' },
        ],
      },
      // 数据展示
      {
        path: '/show',
        name: 'show',
        icon: 'snippets',
        routes: [
          { path: '/show/detail-form', name: 'detail-form', icon: 'table', component: './Demo/DetailForm' },
          { path: '/show/detail-modal', name: 'detail-modal', icon: 'table', component: './Demo/DetailModal' },
          { path: '/show/paging-query-table', name: 'paging-query-table', icon: 'table', component: './Demo/PagingQueryTable' },
          { path: '/show/paging-query-page', name: 'paging-query-page', icon: 'table', component: './Demo/PagingQueryPage' },
        ],
      },
      // 其它
      {
        path: '/other',
        name: 'other',
        icon: 'snippets',
        routes: [
          { path: '/other/iframe', name: 'iframe', icon: 'table', component: './Demo/IFramePage' },
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
