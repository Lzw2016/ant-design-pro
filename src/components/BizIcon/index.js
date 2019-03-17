import React from 'react';
import './index.less';

const BizIcon = props => {
  const { type, style } = props;
  return <i className={`iconfont icon-${type}`} style={style} />;
};
export default BizIcon;
