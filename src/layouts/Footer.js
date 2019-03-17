import React from 'react';
import { Layout } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import { LayoutConfig } from '../utils/constant';

const { Footer } = Layout;
const FooterView = () =>
  LayoutConfig.hiddenFooter ? '' :
    (
      <Footer style={{ padding: 0 }}>
        <GlobalFooter links={LayoutConfig.copyrightLinks} copyright={LayoutConfig.copyright} />
      </Footer>
    );
export default FooterView;
