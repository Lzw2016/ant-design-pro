import { formatMessage } from 'umi-plugin-react/locale';
import pathToRegexp from 'path-to-regexp';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
// import { menu, title } from '../defaultSettings';
import { SystemInfo } from '@/config';

export const matchParamsPath = (pathname, breadcrumbNameMap) => {
  const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
  return breadcrumbNameMap[pathKey];
};

const getPageTitle = (pathname, breadcrumbNameMap) => {
  const currRouterData = matchParamsPath(pathname, breadcrumbNameMap);
  if (!currRouterData) {
    return SystemInfo.name;
  }
  const pageName = SystemInfo.menu.disableLocal
    ? currRouterData.name
    : formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - ${SystemInfo.name}`;
};

export default memoizeOne(getPageTitle, isEqual);
