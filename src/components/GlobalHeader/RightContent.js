import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Spin, Tag, Menu, Icon, Avatar, Tooltip, message } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import HeaderDropdown from '../HeaderDropdown';
import SelectLang from '../SelectLang';
import styles from './index.less';
import NoticeSvg from '../../assets/notice.svg';
import MessageSvg from '../../assets/message.svg';
import ToDoListSvg from '../../assets/to-do-list.svg';
import { LayoutConfig } from '../../utils/constant';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.entries(noticeData).forEach(([key, value]) => {
      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }
      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  changeReadState = clickedItem => {
    const { id } = clickedItem;
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeNoticeReadState',
      payload: id,
    });
  };

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter" disabled={!LayoutConfig.globalHeader.userCenter.enableAccountCenter}>
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="userinfo" disabled={!LayoutConfig.globalHeader.userCenter.enableAccountSettings}>
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {LayoutConfig.globalHeader.enableHeaderSearch ? (
          <HeaderSearch
            className={`${styles.action} ${styles.search}`}
            placeholder={formatMessage({ id: 'component.globalHeader.search' })}
            dataSource={LayoutConfig.globalHeader.searchList()}
            onSearch={value => {
              console.log('input', value); // eslint-disable-line
            }}
            onPressEnter={value => {
              console.log('enter', value); // eslint-disable-line
            }}
          />
        ) : ''}
        {LayoutConfig.globalHeader.enableHelpDocument ? (
          <Tooltip title={formatMessage({ id: 'component.globalHeader.help' })}>
            <a
              target={LayoutConfig.globalHeader.helpDocumentTarget}
              href={LayoutConfig.globalHeader.helpDocumentHref}
              rel="noopener noreferrer"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
        ) : ''}
        {LayoutConfig.globalHeader.enableNotice ? (
          <NoticeIcon
            className={styles.action}
            count={currentUser.unreadCount}
            onItemClick={(item, tabProps) => {
              console.log(item, tabProps); // eslint-disable-line
              this.changeReadState(item, tabProps);
            }}
            loading={fetchingNotices}
            locale={{
              emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
              clear: formatMessage({ id: 'component.noticeIcon.clear' }),
              viewMore: formatMessage({ id: 'component.noticeIcon.view-more' }),
              notification: formatMessage({ id: 'component.globalHeader.notification' }),
              message: formatMessage({ id: 'component.globalHeader.message' }),
              event: formatMessage({ id: 'component.globalHeader.event' }),
            }}
            onClear={onNoticeClear}
            onPopupVisibleChange={onNoticeVisibleChange}
            onViewMore={() => message.info('Click on view more')}
            clearClose
          >
            <NoticeIcon.Tab
              count={unreadMsg.notification}
              list={noticeData.notification}
              title={formatMessage({ id: 'component.globalHeader.notification' })}
              emptyText={formatMessage({ id: 'component.globalHeader.notification.empty' })}
              emptyImage={NoticeSvg}
              showViewMore
            />
            <NoticeIcon.Tab
              count={unreadMsg.message}
              list={noticeData.message}
              title={formatMessage({ id: 'component.globalHeader.message' })}
              emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
              emptyImage={MessageSvg}
              showViewMore
            />
            <NoticeIcon.Tab
              count={unreadMsg.event}
              list={noticeData.event}
              title={formatMessage({ id: 'component.globalHeader.event' })}
              emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
              emptyImage={ToDoListSvg}
              showViewMore
            />
          </NoticeIcon>
        ) : ''}
        {currentUser.name ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        {LayoutConfig.globalHeader.enableSelectLang ? (<SelectLang className={styles.action} />) : ''}
      </div>
    );
  }
}
