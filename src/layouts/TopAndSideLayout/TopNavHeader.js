import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import router from 'umi/router';
import Debounce from 'lodash-decorators/debounce';
import RightContent from '@/components/GlobalHeader/RightContent';
import FirstLevelMenu from './FirstLevelMenu';
import styles from './TopNavHeader.less';
import { LayoutConfig, SystemInfo } from '../../utils/constant';

const logoWidth = LayoutConfig.siderMenuWidth;

export default class TopNavHeader extends PureComponent {
  state = {
    maxWidth: undefined,
  };

  static getDerivedStateFromProps(props) {
    return { maxWidth: ((props.contentWidth === 'Fixed') ? 1200 : window.innerWidth) - 280 - (logoWidth - 24) - 40 - 68 };
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  toggle = () => {
    const { collapsed, handleMenuCollapse } = this.props;
    handleMenuCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  render() {
    const { theme, contentWidth, logo, collapsed } = this.props;
    let { maxWidth } = this.state;
    let style = { paddingLeft: 24, width: logoWidth, cursor: 'pointer', boxShadow: '1px 0 0 0 rgba(0, 21, 41, 0.15)' };
    if (collapsed) {
      maxWidth = maxWidth + logoWidth - 80;
      style = { ...style, width: 80 };
    } else {
      style = { ...style };
    }
    if (theme === 'dark') {
      style = { ...style, background: '#002140' };
    }
    // , paddingLeft: 24
    // style={{ paddingLeft: theme === 'dark' ? 0 : 24 }}
    return (
      <div className={`${styles.head} ${theme === 'light' ? styles.light : styles.dark}`}>
        <div ref={ref => { this.maim = ref; }} className={`${styles.main} ${contentWidth === 'Fixed' ? styles.wide : ''}`}>
          <div className={styles.left}>
            <div className={styles.logo} style={style} key="logo" id="logo" onClick={() => router.push("/")}>
              <img src={logo} alt="logo" />
              {collapsed ? '' : <h1>{SystemInfo.name}</h1>}
            </div>
            <span className={theme === 'dark' ? styles.darkToggle : undefined}>
              <Icon className={styles.trigger} type={collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.toggle} />
            </span>
            <span style={{ maxWidth, display: 'inline-block' }}>
              <FirstLevelMenu {...this.props} />
            </span>
          </div>
          <RightContent {...this.props} />
        </div>
      </div>
    );
  }
}
