import React from 'react';
import { Icon } from 'antd';
import IconFont from '@/components/IconFont';

/**
 * Allow menu.js config icon as string or ReactNode
 * icon: 'setting',
 * icon: 'http://demo.com/icon.png',
 * icon: <Icon type="setting" />,
 * @param {*} icon
 * @param {*} stylesIcon  styles.icon
 */
const getIcon = (icon, stylesIcon) => {
  if (typeof icon === 'string') {
    if (icon.startsWith('https://') || icon.startsWith('http://')) {
      return <img src={icon} alt="icon" className={stylesIcon} />;
    }
    if (icon.startsWith('icon-')) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
};

const conversionPath = path => {
  if (path && /^https?:\/\//.test(path)) {
    return path;
  }
  return `/${path || ''}`.replace(/\/+/g, '/');
};

/**
 * 获取Menu.Item下的内容
 * @param {*} item
 * @param {*} stylesIcon    styles.icon
 * @param {*} isMobile      const { isMobile } = this.props;
 * @param {*} onCollapse    const { onCollapse } = this.props;
 */
const getMenuItemPath = (item, stylesIcon, isMobile, onCollapse) => {
  const { name } = item;
  const itemPath = conversionPath(item.path);
  const icon = getIcon(item.icon, stylesIcon);
  const { target } = item;
  // Is it a http link
  if (/^https?:\/\//.test(itemPath)) {
    return (
      <a href={itemPath} target={target}>
        {icon}
        <span>{name}</span>
      </a>
    );
  }
  return (
    <span onClick={isMobile ? () => { if (onCollapse instanceof Function) onCollapse(true) } : undefined}>
      {icon}
      <span>{name}</span>
    </span>
  );
};

/**
 * permission to check
 * @param {*} authority   item.authority
 * @param {*} ItemDom
 * @param {*} Authorized  const { Authorized } = this.props;
 */
const checkPermissionItem = (authority, ItemDom, Authorized) => {
  if (Authorized && Authorized.check) {
    const { check } = Authorized;
    return check(authority, ItemDom);
  }
  return ItemDom;
};

export {
  getIcon,
  conversionPath,
  getMenuItemPath,
  checkPermissionItem,
};
