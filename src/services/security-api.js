import { notification } from 'antd';
import { encode } from 'base64-arraybuffer';
// import { stringify } from 'qs';
import { UrlPrefix, CodeMessage } from '@/config';
import request from '@/utils/request';
import { LoginEncrypt } from '@/utils/crypto';

const prefix = UrlPrefix.security;

// 获取图片验证码
export async function getImgCaptcha() {
  const { data, response } = await request(`${prefix}/login/captcha.png`, { method: 'GET', getResponse: true, responseType: "arrayBuffer" });
  const captchaDigest = response && response.headers && response.headers.get("ImageDigest");
  return { captchaDigest, imgCaptchaData: `data:image/png;base64,${encode(data)}` };
}

// 用户登录
export async function login(params) {
  const { type, userName, password, captcha, captchaDigest, autoLogin } = params;
  // 登录方式 type -> mobile | account
  let loginType;
  switch (type) {
    case "account":
      loginType = "UsernamePassword";
      break;
    case "mobile":
      loginType = "TelephoneCode";
      break;
    default:
      loginType = null;
  }
  const { success, message, needCaptcha, user } = await request(`${prefix}/login.json`, {
    method: 'POST',
    data: {
      loginType,
      username: userName,
      password: LoginEncrypt(password),
      "remember-me": autoLogin,
      captcha,
      captchaDigest,
    },
    errorHandler: ({ response, data }) => {
      if (!response) return data || {};
      const { status } = response;
      if (status >= 500) {
        let errortext;
        if (data && data.message) errortext = data.message;
        if (!errortext) errortext = CodeMessage(response.status) || response.statusText;
        notification.error({ message: `请求错误 ${status}`, description: errortext });
      }
      return data || {};
    },
  });
  // let roleNames = [];
  let authorities = [];
  if (user && user.authorities) {
    authorities = user.authorities;
  }
  return { type, status: success === true ? "ok" : "error", message, needCaptcha, currentAuthority: authorities };
}

// 用户登出
export async function logout() {
  return request(`${prefix}/logout.json`, { method: 'POST' });
}

// 查询当前用户
export async function currentUser() {
  const { username, telephone, email, userType, roleNames, authorities } = await request(`${prefix}/login/user_info.json`);
  return {
    name: username,
    userid: username,
    avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png",
    email,
    phone: telephone,
    userType,
    roleNames,
    authorities,
    signature: "海纳百川，有容乃大",
    title: "交互专家",
    group: "蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED",
    tags: [
      {
        "key": "0",
        "label": "很有想法的"
      },
      {
        "key": "1",
        "label": "专注设计"
      },
      {
        "key": "2",
        "label": "辣~"
      },
      {
        "key": "3",
        "label": "大长腿"
      },
      {
        "key": "4",
        "label": "川妹子"
      },
      {
        "key": "5",
        "label": "海纳百川"
      }
    ],
    notifyCount: 3,
    unreadCount: 2,
    country: "China",
    geographic: {
      "province": {
        "label": "浙江省",
        "key": "330000"
      },
      "city": {
        "label": "杭州市",
        "key": "330100"
      }
    },
    address: "西湖区工专路 77 号",
  };
}
// 用户注册

// 查询验证码


