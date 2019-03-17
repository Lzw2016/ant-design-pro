import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import intersection from 'lodash/intersection';
import { checkPermissionItem, getMenuItemPath } from './utils';
import styles from './FirstLevelMenu.less';

export default class FirstLevelMenu extends PureComponent {
  // 获取一级菜单
  getFirstLevelMenu = menusData => {
    const { Authorized } = this.props;
    if (!menusData) return [];
    return menusData
      // 排除隐藏的
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getMenItem(item);
        // 权限过滤
        return checkPermissionItem(item.authority, ItemDom, Authorized);
      })
      .filter(item => item);
  };

  getMenItem = item => {
    const { isMobile, onCollapse } = this.props;
    const { path } = item;
    return (
      <Menu.Item key={path} data-menu-path={path}>
        {getMenuItemPath(item, styles.icon, isMobile, onCollapse)}
      </Menu.Item>
    );
  };

  render() {
    const { theme, menuData, selectedKeys, handleFirstLevelMenuClick } = this.props;
    return (
      <Menu
        key="Menu"
        className="top-nav-menu"
        style={{ userSelect: 'none', border: 'none', display: 'inline-block', height: 64 }}
        mode="horizontal"
        theme={theme}
        selectedKeys={selectedKeys}
        onClick={({ item, keyPath }) => {
          if (intersection(selectedKeys, keyPath).length > 0) {
            return;
          }
          if (handleFirstLevelMenuClick && handleFirstLevelMenuClick instanceof Function) {
            if (item && item.props && item.props['data-menu-path']) {
              handleFirstLevelMenuClick(item.props['data-menu-path']);
            }
          }
        }}
      >
        {this.getFirstLevelMenu(menuData)}
      </Menu>
    );
  }
}
