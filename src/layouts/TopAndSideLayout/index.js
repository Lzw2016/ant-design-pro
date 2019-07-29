import React from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import forEach from 'lodash/forEach';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import router from 'umi/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import Authorized from '@/utils/Authorized';
import { urlToList } from '@/components/_utils/pathTools';
import SettingDrawer from '@/components/SettingDrawer';
import logo from '../../assets/logo.svg';
import Exception403 from '../../pages/Exception/403';
import Context from '../MenuContext';
import Footer from '../Footer';
import Header from './Header';
import SecondaryMenu from './SecondaryMenu';
import { conversionPath } from './utils';
import { LayoutConfig, SystemInfo } from '@/config';
// import 'moment/locale/zh-cn';
// import 'moment/locale/zh-tw';
// import 'moment/locale/pt-br';
// import 'moment/locale/en-au';

// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  return data
    .map(item => {
      if (!item.name || !item.path) {
        return null;
      }

      let locale = 'menu';
      if (parentName) {
        locale = `${parentName}.${item.name}`;
      } else {
        locale = `menu.${item.name}`;
      }

      const result = {
        ...item,
        name: formatMessage({ id: locale, defaultMessage: item.name }),
        locale,
        authority: item.authority || parentAuthority,
      };
      if (item.routes) {
        const children = formatter(item.routes, item.authority, locale);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
  'screen-xs': { maxWidth: 575 },
  'screen-sm': { minWidth: 576, maxWidth: 767 },
  'screen-md': { minWidth: 768, maxWidth: 991 },
  'screen-lg': { minWidth: 992, maxWidth: 1199 },
  'screen-xl': { minWidth: 1200, maxWidth: 1599 },
  'screen-xxl': { minWidth: 1600 },
};

// 所有菜单数据
let AllMenus = null;

const getMenuMatches = (flatMenuKeys, path) =>
  flatMenuKeys.filter(item => {
    if (item) {
      return pathToRegexp(item).test(path);
    }
    return false;
  });

class CustomLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.getSelectedMenuKeys = memoizeOne(this.getSelectedMenuKeys, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }

  state = {
    isMobile: false,
    // 一级菜单数据(所有菜单)
    firstMenuData: this.getMenuData(),
    // 一级菜单所有key
    firstMenuAllKeys: this.getFirstLevelMenuKeys(AllMenus),
    // 点击一级菜单打开的页面映射(一级菜单path -> 跳转页面菜单数据)
    firstMenuRedirectMenuMap: this.getFirstMenuRedirectMenuMap(AllMenus),

    // 二级菜单数据(一级菜单path -> 二级菜单数据)
    secondaryMenuDataMap: this.getSecondaryMenuDataMap(AllMenus),
    // 二级菜单所有key(一级菜单path -> 二级菜单所有key)
    secondaryMenuAllKeysMap: this.getSecondaryMenuAllKeysMap(AllMenus),
    // 二级菜单Open状态的key(一级菜单path -> 二级菜单Open状态的key)
    secondaryMenuOpenKeysMap: this.getSecondaryMenuOpenKeysMap(AllMenus),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'user/fetchCurrent' });
    dispatch({ type: 'setting/getSetting' });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({ isMobile: mobile });
      }
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return { location, breadcrumbNameMap: this.breadcrumbNameMap };
  }

  getMenuData(reload = false) {
    if (!AllMenus || reload) {
      const { route: { routes } } = this.props;
      AllMenus = memoizeOneFormatter(routes);
    }
    return AllMenus;
  }

  // 获取所有菜单Key
  getAllMenuKeys(allMenus) {
    let keys = [];
    allMenus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getAllMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  // 获取所有一级菜单Key
  getFirstLevelMenuKeys(allMenus) {
    const keys = [];
    allMenus.forEach(item => keys.push(item.path));
    return keys;
  }

  // 点击一级菜单打开的页面映射(一级菜单path -> 跳转页面菜单数据)
  getFirstMenuRedirectMenuMap(allMenus) {
    const firstMenuRedirectMenuMap = {};
    allMenus.forEach(item => {
      firstMenuRedirectMenuMap[item.path] = this.getFirstMenuItem(item);
    });
    return firstMenuRedirectMenuMap;
  }

  // 读取第一个子菜单
  getFirstMenuItem(menuItem) {
    const { children } = menuItem;
    if (children && children.length > 0) {
      return this.getFirstMenuItem(children[0]);
    }
    return menuItem;
  };

  // 二级菜单数据(一级菜单path -> 二级菜单数据)
  getSecondaryMenuDataMap(allMenus) {
    const secondaryMenuDataMap = {};
    allMenus.forEach(item => {
      if (item.children) {
        secondaryMenuDataMap[item.path] = item.children;
      } else {
        secondaryMenuDataMap[item.path] = [];
      }
    });
    return secondaryMenuDataMap;
  }

  // 二级菜单所有key(一级菜单path -> 二级菜单所有key)
  getSecondaryMenuAllKeysMap(allMenus) {
    const secondaryMenuAllKeysMap = {};
    allMenus.forEach(item => {
      if (item.children) {
        secondaryMenuAllKeysMap[item.path] = this.getAllMenuKeys(item.children);
      } else {
        secondaryMenuAllKeysMap[item.path] = [];
      }
    });
    return secondaryMenuAllKeysMap;
  }

  // 二级菜单Open状态的key(一级菜单path -> 二级菜单Open状态的key)
  getSecondaryMenuOpenKeysMap(allMenus) {
    const secondaryMenuDataMap = this.getSecondaryMenuDataMap(allMenus);
    // console.log(secondaryMenuDataMap)
    const secondaryMenuOpenKeysMap = {};
    forEach(secondaryMenuDataMap, (menus, path) => {
      const openKeys = this.getMenuDefaultOpenKeys(menus);
      secondaryMenuOpenKeysMap[path] = openKeys;
    });
    return secondaryMenuOpenKeysMap;
  }

  // 获取菜单 Default Open Key
  getMenuDefaultOpenKeys(allMenus) {
    let keys = [];
    allMenus.forEach(item => {
      if (item.children && item.defaultOpen) {
        keys.push(item.path);
        keys = keys.concat(this.getMenuDefaultOpenKeys(item.children));
      }
    });
    return keys;
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);
    if (!currRouterData) {
      return SystemInfo.name;
    }
    const message = formatMessage({ id: currRouterData.locale || currRouterData.name, defaultMessage: currRouterData.name });
    return `${message} - ${SystemInfo.name}`;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return { margin: '24px 24px 0', paddingTop: fixedHeader ? 64 : 0 };
  };

  // 折叠二级菜单
  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({ type: 'global/changeLayoutCollapsed', payload: collapsed });
  };

  // 一级菜单点击
  handleFirstLevelMenuClick = menuPath => {
    const { firstMenuRedirectMenuMap } = this.state;
    if (!firstMenuRedirectMenuMap || !firstMenuRedirectMenuMap[menuPath]) return;
    const { path, target } = firstMenuRedirectMenuMap[menuPath];
    this.routerTo(path, target);
  };

  // 二级菜单点击
  handleSecondaryMenuClick = (menuItem, firstMenuKey) => {
    if (!menuItem) return;
    const { path, target } = menuItem;
    const { firstMenuRedirectMenuMap } = this.state;
    firstMenuRedirectMenuMap[firstMenuKey] = menuItem;
    this.setState({ firstMenuRedirectMenuMap: { ...firstMenuRedirectMenuMap } });
    this.routerTo(path, target);
  }

  // 二级菜单 SubMenu 展开/关闭的回调
  handleSecondaryMenuOpenChange = (openKeys, firstMenuKey) => {
    const { secondaryMenuOpenKeysMap } = this.state;
    secondaryMenuOpenKeysMap[firstMenuKey] = openKeys;
    this.setState({ secondaryMenuOpenKeysMap: { ...secondaryMenuOpenKeysMap } });
  }

  // 路由跳转
  routerTo = (path, target) => {
    if (target) {
      // _blank   在新窗口中打开被链接文档。
      // _self    默认。在相同的框架中打开被链接文档。
      // _parent  在父框架集中打开被链接文档。
      // _top     在整个窗口中打开被链接文档。
    }
    const { location: { pathname } } = this.props;
    const itemPath = conversionPath(path);
    if (itemPath === pathname) {
      router.replace(itemPath);
    } else {
      router.push(itemPath);
    }
  }

  // 获取匹配菜单key
  getSelectedMenuKeys = (pathname, menuKeys) => {
    let selectedKeys = urlToList(pathname).map(itemPath => getMenuMatches(menuKeys, itemPath).pop());
    // 除去 undefined 元素
    selectedKeys = selectedKeys.filter(item => !!item);
    return selectedKeys;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return { paddingLeft: collapsed ? '80px' : `${LayoutConfig.siderMenuWidth}px` };
    }
    return null;
  };

  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    // eslint-disable-next-line no-undef
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const { children, location: { pathname }, collapsed, navTheme } = this.props;
    const { isMobile, firstMenuData, firstMenuAllKeys, secondaryMenuDataMap, secondaryMenuAllKeysMap, secondaryMenuOpenKeysMap } = this.state;
    // 计算一级菜单选中key
    const firstMenuSelectedKeys = this.getSelectedMenuKeys(pathname, firstMenuAllKeys);
    // 选中一级菜单
    let firstMenu;
    // 二级菜单数据
    let secondaryMenuData = [];
    // 二级菜单所有key
    let secondaryMenuAllKeys = [];
    // 二级菜单选中key
    let secondaryMenuSelectedKeys = [];
    // 二级菜单Open状态的key
    let secondaryMenuOpenKeys = [];
    if (firstMenuSelectedKeys && firstMenuSelectedKeys.length > 0) {
      const firstMenuKey = firstMenuSelectedKeys[0];
      firstMenu = firstMenuData.find(menu => firstMenuKey === menu.path);
      secondaryMenuData = secondaryMenuDataMap[firstMenuKey];
      secondaryMenuAllKeys = secondaryMenuAllKeysMap[firstMenuKey];
      // 计算二级菜单选中key
      secondaryMenuSelectedKeys = this.getSelectedMenuKeys(pathname, secondaryMenuAllKeys);
      secondaryMenuOpenKeys = secondaryMenuOpenKeysMap[firstMenuKey];
    }
    // 是否存在二级菜单
    const hasSecondaryMenu = secondaryMenuData && secondaryMenuData.length > 0 && secondaryMenuData.filter(menu => !menu.hideInMenu).length > 0 && firstMenu && !firstMenu.hideInMenu && !firstMenu.hideChildrenInMenu;
    // routerConfig
    const routerConfig = this.matchParamsPath(pathname);
    // 设置二级菜单主题颜色
    let { sideTheme } = this.props;
    if (!sideTheme) sideTheme = navTheme;
    const layout = (
      <Layout style={{ ...this.getLayoutStyle(), minHeight: '100vh' }}>
        <Header
          menuData={firstMenuData}
          handleMenuCollapse={this.handleMenuCollapse}
          selectedKeys={firstMenuSelectedKeys}
          handleFirstLevelMenuClick={this.handleFirstLevelMenuClick}
          logo={logo}
          isMobile={isMobile}
          hasSecondaryMenu={hasSecondaryMenu}
          {...this.props}
        />
        {hasSecondaryMenu ?
          (
            // 存在二级菜单
            <Layout>
              <Layout.Sider collapsed={collapsed} theme={sideTheme} width={LayoutConfig.siderMenuWidth} style={{ boxShadow: '0 0 0 1px rgba(0, 21, 41, 0.15)' }}>
                <SecondaryMenu
                  sideTheme={sideTheme}
                  menuData={secondaryMenuData}
                  selectedKeys={secondaryMenuSelectedKeys}
                  openKeys={secondaryMenuOpenKeys}
                  firstMenuSelectedKeys={firstMenuSelectedKeys}
                  handleOpenChange={this.handleSecondaryMenuOpenChange}
                  handleSecondaryMenuClick={this.handleSecondaryMenuClick}
                  {...this.props}
                />
              </Layout.Sider>
              <Layout>
                <Layout.Content style={this.getContentStyle()}>
                  <Authorized authority={routerConfig && routerConfig.authority} noMatch={<Exception403 />}>
                    {children}
                  </Authorized>
                </Layout.Content>
                <Footer />
              </Layout>
            </Layout>

          ) :
          (
            // 没有二级菜单
            <React.Fragment>
              <Layout.Content style={this.getContentStyle()}>
                <Authorized authority={routerConfig && routerConfig.authority} noMatch={<Exception403 />}>
                  {children}
                </Authorized>
              </Layout.Content>
              <Footer />
            </React.Fragment>
          )
        }
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {this.renderSettingDrawer()}
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting,
}))(CustomLayout);
