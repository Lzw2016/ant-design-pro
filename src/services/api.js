import { stringify } from 'qs';
import request from '@/utils/request';
import { BaiduTranslateMD5 } from '@/utils/BaiduTranslateMD5';
import { BaiduTranslate } from '@/config';

export async function queryProjectNotice() {
  // return request('/api/project/notice');
  return [
    {
      id: 'xxx1',
      title: 'Alipay',
      logo: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      description: '那是一种内在的东西，他们到达不了，也无法触及的',
      updatedAt: new Date(),
      member: '科学搬砖组',
      href: '',
      memberLink: '',
    },
  ];
}

// 用户登录
export async function fakeAccountLogin(params) {
  // return request('/api/login/account', {
  //   method: 'POST',
  //   body: params,
  // });
  console.log("fakeAccountLogin", params);
  return { status: "ok", type: "account", currentAuthority: "admin" };
}

// 用户注册
export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

// 查询通知
export async function queryNotices(params = {}) {
  // return request(`/api/notices?${stringify(params)}`);
  console.log("queryNotices", params);
  return [
    {
      id: "000000003",
      avatar: "https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png",
      title: "这种模板可以区分多种通知类型",
      datetime: "2017-08-07",
      read: true,
      type: "notification",
    },
    {
      id: "000000006",
      avatar: "https://gw.alipayobjects.com/zos/rmsportal/fcHMVNCjPOsbUGdEduuv.jpeg",
      title: "曲丽丽 评论了你",
      description: "描述信息描述信息描述信息",
      datetime: "2017-08-07",
      type: "message",
      clickClose: true
    },
    {
      id: "000000011",
      title: "信息安全考试",
      description: "指派竹尔于 2017-01-09 前完成更新并发布",
      extra: "已耗时 8 天",
      status: "doing",
      type: "event"
    },
  ];
}

// 查询验证码
export async function getFakeCaptcha(mobile) {
  // return request(`/api/captcha?mobile=${mobile}`);
  console.log("getFakeCaptcha", mobile);
  return "captcha-xxx";
}

/**
 * Baidu翻译 http://api.fanyi.baidu.com/api/trans/product/apidoc#languageList
 * @param {*} from 待翻译语言类型
 * @param {*} to 目标语言类型
 * @param {*} q  待翻译内容
 */
export async function translateBaidu(from = 'auto', to, q) {
  const appid = BaiduTranslate.appid;
  const key = BaiduTranslate.key;
  const salt = (new Date).getTime();
  const sign = BaiduTranslateMD5(appid + q + salt + key);
  const param = { appid, salt, sign, from, to, q };
  return request(`/baidu/api/trans/vip/translate?${stringify(param)}`)
}
