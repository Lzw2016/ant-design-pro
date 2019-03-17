import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { getIcon, checkPermissionItem, getMenuItemPath } from './utils';
import styles from './SecondaryMenu.less';

export default class SecondaryMenu extends PureComponent {
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData) => {
    const { Authorized } = this.props;
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return checkPermissionItem(item.authority, ItemDom, Authorized);
      })
      .filter(item => item);
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    // doc: add hideChildrenInMenu
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      const { name } = item;
      return (
        <Menu.SubMenu title={item.icon ? <span>{getIcon(item.icon, styles.icon)}<span>{name}</span></span> : name} key={item.path}>
          {this.getNavMenuItems(item.children)}
        </Menu.SubMenu>
      );
    }
    const { isMobile, onCollapse } = this.props;
    return <Menu.Item key={item.path} data-menu-item={item}>{getMenuItemPath(item, styles.icon, isMobile, onCollapse)}</Menu.Item>;
  };

  render() {
    const { sideTheme, collapsed, menuData, selectedKeys, openKeys = [], firstMenuSelectedKeys, handleOpenChange, handleSecondaryMenuClick } = this.props;
    // 合并 selectedKeys 到 openKeys
    if (!collapsed && selectedKeys && openKeys.length === 0) {
      selectedKeys.forEach(key => { if (openKeys.indexOf(key) < 0) openKeys.push(key) });
    }
    const defaultProps = collapsed ? {} : { openKeys };
    return (
      <Menu
        key="Menu"
        mode="inline"
        style={{ userSelect: 'none', border: 'none' }}
        theme={sideTheme}
        selectedKeys={selectedKeys}
        {...defaultProps}
        onOpenChange={openKeysParam => {
          if (!handleOpenChange || !(handleOpenChange instanceof Function)) return;
          if (!firstMenuSelectedKeys || firstMenuSelectedKeys.length <= 0) return;
          const firstMenuKey = firstMenuSelectedKeys[0];
          handleOpenChange(openKeysParam, firstMenuKey)
        }}
        onClick={({ item }) => {
          if (!item || !item.props || !item.props['data-menu-item']) return;
          if (!handleSecondaryMenuClick || !(handleSecondaryMenuClick instanceof Function)) return;
          if (!firstMenuSelectedKeys || firstMenuSelectedKeys.length <= 0) return;
          const firstMenuKey = firstMenuSelectedKeys[0];
          handleSecondaryMenuClick(item.props['data-menu-item'], firstMenuKey);
        }}
      >
        {this.getNavMenuItems(menuData)}
      </Menu>
    );
  }
}
